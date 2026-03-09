"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your store configuration and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Store Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Store Name", value: "The Wallet Lab", type: "text" },
              { label: "Contact Email", value: "hello@thewalletlab.ma", type: "email" },
              { label: "Phone Number", value: "+212 6 00 00 00 00", type: "tel" },
              { label: "Currency", value: "MAD (Moroccan Dirham)", type: "text" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Store Description
            </label>
            <textarea
              defaultValue="Redefining how you carry essentials for the digital world. Modern engineering, timeless craftsmanship."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Notifications</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "New Order Alerts", desc: "Get notified when a new order is placed", default: true },
              { label: "Low Stock Warnings", desc: "Alert when a product falls below 5 units", default: true },
              { label: "Customer Signups", desc: "Notify on new customer registrations", default: false },
              { label: "Refund Requests", desc: "Alert on refund or return requests", default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-checked:bg-primary rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Shipping & Delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Free Shipping Threshold", value: "500 MAD" },
              { label: "Standard Delivery (days)", value: "3-5" },
              { label: "Express Delivery (days)", value: "1-2" },
              { label: "Default Shipping Region", value: "Morocco" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  type="text"
                  defaultValue={field.value}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              saved
                ? "bg-green-600 text-white"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {saved ? "check_circle" : "save"}
            </span>
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
