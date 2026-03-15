"use client";

import { useState } from "react";

const shippingRates = [
  {
    icon: "local_shipping",
    name: "Domestic Standard",
    desc: "3-5 business days",
    price: "$4.99",
    secondary: "$0.00",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
  {
    icon: "bolt",
    name: "Express Overnight",
    desc: "1 business day",
    price: "$10.99",
    secondary: "$0.00",
    iconBg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500",
  },
];

export function SettingsClient({ currentUserId, profiles }: { currentUserId?: string, profiles: Record<string, any>[] }) {
  const [saved, setSaved] = useState(false);
  const [discarded, setDiscarded] = useState(false);

  // Map the Supabase profiles into the format expected by the UI
  const staffMembers = profiles.map(profile => {
    const initials = profile.full_name
      ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
      : "AU";
    
    // Assign a color based on the role or just a random hash for variety
    const isCurrentUser = profile.id === currentUserId;
    const color = isCurrentUser ? "bg-primary" : "bg-slate-500";

    return {
      id: profile.id,
      name: profile.full_name || "Admin User",
      email: profile.email,
      role: profile.role || "Administrator",
      active: true, // We don't have an active status in DB yet
      initials,
      color,
      isCurrentUser
    }
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDiscard = () => {
    setDiscarded(true);
    setTimeout(() => setDiscarded(false), 1500);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure your store operations and team permissions.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Store Profile ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
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
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="The Wallet Lab"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="admin@walletlab.com"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Business Address
            </label>
            <input
              type="text"
              defaultValue="742 Evergreen Terrace, San Francisco, CA 94105"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* ── Shipping Rates ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Rates</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage global delivery costs</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold transition-all hover:bg-primary/90">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Zone
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {shippingRates.map((rate) => (
              <div
                key={rate.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${rate.iconBg}`}>
                  <span className={`material-symbols-outlined text-lg ${rate.iconColor}`}>{rate.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{rate.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rate.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">{rate.price}</p>
                  <p className="text-xs text-slate-400">{rate.secondary}</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <span className="material-symbols-outlined text-base">more_horiz</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment Gateway ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">credit_card</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Payment Gateway</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">How you receive money</p>
            </div>
          </div>

          {/* Stripe card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#635BFF] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-base">bolt</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Stripe Connected</p>
                <p className="text-xs text-slate-400">Payouts every 48 hours</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10">
              Manage Stripe Account
            </button>
          </div>
        </div>

        {/* ── Staff Accounts ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold transition-all hover:bg-primary/90">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Invite Staff
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-2 mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Staff Member</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</p>
          </div>

          <div className="flex flex-col gap-2">
            {staffMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                {/* Name + email */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`size-9 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {member.name} 
                      {member.isCurrentUser && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">You</span>}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                  </div>
                </div>

                {/* Role badge */}
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize whitespace-nowrap">
                  {member.role}
                </span>

                {/* Status */}
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className={`size-2 rounded-full ${member.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className={`text-xs font-medium ${member.active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <span className="material-symbols-outlined text-base">more_horiz</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Save / Discard ── */}
        <div className="flex items-center justify-end gap-3 pb-2">
          <button
            onClick={handleDiscard}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {discarded ? "Discarded" : "Discard Changes"}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {saved ? "check_circle" : "save"}
            </span>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6 pb-2">
        © 2026 The Wallet Lab Admin Console. All rights reserved.
      </p>
    </div>
  );
}
