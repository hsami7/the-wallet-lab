"use client";

import { useState } from "react";

const orders = [
  { id: "#ORD-4821", customer: "Jean Dupont", product: "Carbon Series Pro", amount: "850 MAD", status: "Shipped", date: "Mar 09, 2026" },
  { id: "#ORD-4820", customer: "Sara El Amrani", product: "Titanium Minimalist", amount: "1,200 MAD", status: "Processing", date: "Mar 09, 2026" },
  { id: "#ORD-4819", customer: "Omar Bensali", product: "Classic Cognac", amount: "650 MAD", status: "Delivered", date: "Mar 08, 2026" },
  { id: "#ORD-4818", customer: "Nadia Chaoui", product: "Stealth Black Edition", amount: "950 MAD", status: "Shipped", date: "Mar 08, 2026" },
  { id: "#ORD-4817", customer: "Yassine Mouhssine", product: "Carbon Series Pro", amount: "850 MAD", status: "Pending", date: "Mar 07, 2026" },
  { id: "#ORD-4816", customer: "Fatima Zohra", product: "Classic Cognac", amount: "650 MAD", status: "Delivered", date: "Mar 07, 2026" },
  { id: "#ORD-4815", customer: "Karim El Idrissi", product: "Stealth Black Edition", amount: "950 MAD", status: "Refunded", date: "Mar 06, 2026" },
  { id: "#ORD-4814", customer: "Leila Benali", product: "Titanium Minimalist", amount: "1,200 MAD", status: "Processing", date: "Mar 06, 2026" },
  { id: "#ORD-4813", customer: "Hassan Oumali", product: "Carbon Series Pro", amount: "850 MAD", status: "Delivered", date: "Mar 05, 2026" },
  { id: "#ORD-4812", customer: "Amina Tazi", product: "Classic Cognac", amount: "650 MAD", status: "Shipped", date: "Mar 05, 2026" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrders() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Refunded"];

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage, monitor, and update status for all customer transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: "1,284", icon: "receipt_long" },
          { label: "Pending Processing", value: "42", icon: "hourglass_empty" },
          { label: "Shipped Today", value: "118", icon: "local_shipping" },
          { label: "Refund Requests", value: "3", icon: "assignment_return" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40"
              placeholder="Search orders..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Order ID", "Customer", "Product", "Amount", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.product}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 1 to {filtered.length} of 1,284 orders</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 text-xs">Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 text-xs">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
