"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price: number;
  delivery_time_days: string;
  is_active: boolean;
}

interface ShippingRule {
  id: string;
  name: string;
  active: boolean;
  min_amount: number;
  min_quantity: number;
}

export function SettingsClient({
  currentUserId,
  profiles,
  initialShippingRates,
  initialShippingRules
}: {
  currentUserId?: string,
  profiles: Record<string, any>[],
  initialShippingRates: ShippingRate[],
  initialShippingRules: ShippingRule[]
}) {
  const [saved, setSaved] = useState(false);
  const [discarded, setDiscarded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(initialShippingRates);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>(initialShippingRules);

  const supabase = createClient();

  // Map the Supabase profiles into the format expected by the UI
  const staffMembers = profiles.map(profile => {
    const initials = profile.full_name
      ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
      : "AU";

    const isCurrentUser = profile.id === currentUserId;
    const color = isCurrentUser ? "bg-primary" : "bg-slate-500";

    return {
      id: profile.id,
      name: profile.full_name || "Admin User",
      email: profile.email,
      role: profile.role || "Administrator",
      active: true,
      initials,
      color,
      isCurrentUser
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save shipping rates
      for (const rate of shippingRates) {
        await supabase
          .from("shipping_rates")
          .update({
            price: rate.price,
            description: rate.description,
            is_active: rate.is_active
          })
          .eq("id", rate.id);
      }

      // Save shipping rules
      for (const rule of shippingRules) {
        await supabase
          .from("shipping_rules")
          .update({
            active: rule.active,
            min_amount: rule.min_amount,
            min_quantity: rule.min_quantity
          })
          .eq("id", rule.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setShippingRates(initialShippingRates);
    setShippingRules(initialShippingRules);
    setDiscarded(true);
    setTimeout(() => setDiscarded(false), 1500);
  };

  const updateRatePrice = (id: string, price: string) => {
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!isNaN(numPrice)) {
      setShippingRates(rates => rates.map(r => r.id === id ? { ...r, price: numPrice } : r));
    }
  };

  const updateRuleValue = (id: string, field: keyof ShippingRule, value: any) => {
    setShippingRules(rules => rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="p-8 pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure your store operations and promotional shipping rules.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Store Profile ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">storefront</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Store Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Publicly visible store information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="The embroidery's Lab"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="lab@embroidery.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Promotional Shipping Rules ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-xl">redeem</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Promotional Rules</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated free delivery triggers</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {shippingRules.map((rule) => (
              <div key={rule.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{rule.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${rule.active ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 dark:bg-white/10 text-slate-400"}`}>
                      {rule.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rule.active}
                      onChange={(e) => updateRuleValue(rule.id, "active", e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      Min Purchase Amount (MAD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rule.min_amount}
                        onChange={(e) => updateRuleValue(rule.id, "min_amount", parseFloat(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all pr-12 font-bold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">DH</span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 leading-relaxed italic">
                      Zero shipping fee if subtotal is greater than this value.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      Min Item Count
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rule.min_quantity}
                        onChange={(e) => updateRuleValue(rule.id, "min_quantity", parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all pr-12 font-bold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 leading-relaxed italic">
                      Zero shipping fee if item quantity is greater than this value.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Shipping Rates ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Rates</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Standard and Express pricing</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {shippingRates.map((rate) => (
              <div
                key={rate.id}
                className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="size-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {rate.name.includes("Express") ? "bolt" : "local_shipping"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{rate.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rate.description}</p>
                </div>
                <div className="relative w-32">
                  <input
                    type="text"
                    value={rate.price}
                    onChange={(e) => updateRatePrice(rate.id, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-right font-bold text-primary focus:outline-none focus:border-primary"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 opacity-50">DH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Staff Accounts ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">group</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Staff Accounts</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Admins with store access</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {staffMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={`size-10 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-black/5`}>
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {member.name}
                    {member.isCurrentUser && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">YOU</span>}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{member.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                  {member.role}
                </span>
                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Save / Discard ── */}
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
          <button
            onClick={handleDiscard}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-xl shadow-black/5"
          >
            {discarded ? "Changes Discarded" : "Discard"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-xl shadow-primary/20 ${saved
                ? "bg-emerald-500 text-white scale-95"
                : "bg-primary text-white hover:scale-105 active:scale-95"
              } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSaving ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-lg">
                {saved ? "done_all" : "auto_fix"}
              </span>
            )}
            {saved ? "System Synchronized" : isSaving ? "Saving..." : "Apply Changes"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-12 mb-8">
        © 2026 The embroidery&apos;s Lab Terminal
      </p>
    </div>
  );
}
