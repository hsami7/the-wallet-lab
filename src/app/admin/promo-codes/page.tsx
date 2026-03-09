"use client";

import { useState } from "react";

type PromoCode = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expires: string;
  status: "Active" | "Expired" | "Paused";
};

const initialCodes: PromoCode[] = [
  { id: "1", code: "LAUNCH20",   type: "percentage", value: 20, minOrder: 0,   maxUses: 500, usedCount: 342, expires: "2026-06-30", status: "Active"  },
  { id: "2", code: "WELCOME50",  type: "fixed",      value: 50, minOrder: 300, maxUses: 200, usedCount: 198, expires: "2026-04-01", status: "Active"  },
  { id: "3", code: "SUMMER15",   type: "percentage", value: 15, minOrder: 200, maxUses: 300, usedCount: 300, expires: "2026-08-31", status: "Paused"  },
  { id: "4", code: "FLASH100",   type: "fixed",      value: 100,minOrder: 500, maxUses: 100, usedCount: 100, expires: "2026-02-14", status: "Expired" },
  { id: "5", code: "VIP30",      type: "percentage", value: 30, minOrder: 800, maxUses: 50,  usedCount: 12,  expires: "2026-12-31", status: "Active"  },
];

const emptyForm = {
  code: "", type: "percentage" as "percentage" | "fixed",
  value: "", minOrder: "", maxUses: "", expires: "",
};

const statusColors: Record<string, string> = {
  Active:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Paused:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const inputCls = "w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(c: PromoCode) {
    setForm({ code: c.code, type: c.type, value: String(c.value), minOrder: String(c.minOrder), maxUses: String(c.maxUses), expires: c.expires });
    setEditId(c.id);
    setShowModal(true);
  }

  function save() {
    if (!form.code || !form.value) return;
    if (editId) {
      setCodes((prev) => prev.map((c) => c.id === editId ? {
        ...c, code: form.code.toUpperCase(), type: form.type,
        value: Number(form.value), minOrder: Number(form.minOrder),
        maxUses: Number(form.maxUses), expires: form.expires,
      } : c));
    } else {
      setCodes((prev) => [...prev, {
        id: String(Date.now()), code: form.code.toUpperCase(), type: form.type,
        value: Number(form.value), minOrder: Number(form.minOrder),
        maxUses: Number(form.maxUses), expires: form.expires,
        usedCount: 0, status: "Active",
      }]);
    }
    setShowModal(false);
  }

  function toggleStatus(id: string) {
    setCodes((prev) => prev.map((c) => c.id === id ? {
      ...c, status: c.status === "Active" ? "Paused" : "Active",
    } : c));
  }

  function deleteCode(id: string) {
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  const active  = codes.filter((c) => c.status === "Active").length;
  const expired = codes.filter((c) => c.status === "Expired").length;
  const totalUses = codes.reduce((s, c) => s + c.usedCount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promo Codes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create and manage discount codes for your customers.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          Create Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Codes",  value: codes.length, icon: "confirmation_number", color: "text-primary" },
          { label: "Active",       value: active,        icon: "check_circle",        color: "text-green-600 dark:text-green-400" },
          { label: "Expired",      value: expired,       icon: "cancel",              color: "text-red-500" },
          { label: "Total Uses",   value: totalUses,     icon: "bar_chart",           color: "text-slate-900 dark:text-white" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
            </div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Code", "Discount", "Min. Order", "Usage", "Expires", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map((c, i) => {
                const usePct = c.maxUses > 0 ? Math.round((c.usedCount / c.maxUses) * 100) : 0;
                return (
                  <tr key={c.id} className={`${i < codes.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white tracking-wider">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-base">{copied === c.code ? "check" : "content_copy"}</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {c.type === "percentage" ? `${c.value}% off` : `${c.value} MAD off`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {c.minOrder > 0 ? `${c.minOrder} MAD` : "None"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">{c.usedCount} / {c.maxUses}</span>
                        <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${usePct >= 90 ? "bg-red-500" : usePct >= 60 ? "bg-yellow-500" : "bg-primary"}`}
                            style={{ width: `${usePct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{c.expires}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStatus(c.id)}
                          title={c.status === "Active" ? "Pause" : "Activate"}
                          className={`text-slate-400 transition-colors ${c.status === "Expired" ? "opacity-30 cursor-not-allowed" : "hover:text-yellow-500"}`}
                          disabled={c.status === "Expired"}>
                          <span className="material-symbols-outlined text-lg">{c.status === "Active" ? "pause_circle" : "play_circle"}</span>
                        </button>
                        <button onClick={() => openEdit(c)} className="text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => deleteCode(c.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editId ? "Edit Promo Code" : "Create Promo Code"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <Field label="Code *">
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER20" className={`${inputCls} font-mono uppercase tracking-widest`} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Discount Type">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })} className={inputCls}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (MAD)</option>
                  </select>
                </Field>
                <Field label={`Value (${form.type === "percentage" ? "%" : "MAD"}) *`}>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 50"} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Min. Order (MAD)">
                  <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                    placeholder="0 = no minimum" className={inputCls} />
                </Field>
                <Field label="Max Uses">
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="0 = unlimited" className={inputCls} />
                </Field>
              </div>
              <Field label="Expiry Date">
                <input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={save}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-lg">save</span>
                {editId ? "Save Changes" : "Create Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
