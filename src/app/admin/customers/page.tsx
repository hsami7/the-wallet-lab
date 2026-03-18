"use client";

import { useState, useEffect } from "react";
import { useAdminSearch } from "@/context/AdminSearchContext";

const customers = [
  { id: "C-001", name: "Jean Dupont", email: "jean.dupont@email.com", orders: 7, spent: "5,950 MAD", joined: "Jan 15, 2025", status: "Active" },
  { id: "C-002", name: "Sara El Amrani", email: "sara@email.com", orders: 3, spent: "3,100 MAD", joined: "Feb 08, 2025", status: "Active" },
  { id: "C-003", name: "Omar Bensali", email: "omar.b@email.com", orders: 12, spent: "9,200 MAD", joined: "Nov 20, 2024", status: "Active" },
  { id: "C-004", name: "Nadia Chaoui", email: "nadia.c@email.com", orders: 1, spent: "950 MAD", joined: "Mar 01, 2026", status: "New" },
  { id: "C-005", name: "Yassine Mouhssine", email: "yassine@email.com", orders: 5, spent: "4,250 MAD", joined: "Dec 10, 2024", status: "Active" },
  { id: "C-006", name: "Fatima Zohra", email: "fatima.z@email.com", orders: 2, spent: "1,300 MAD", joined: "Feb 20, 2025", status: "Active" },
  { id: "C-007", name: "Karim El Idrissi", email: "karim@email.com", orders: 4, spent: "3,400 MAD", joined: "Oct 05, 2024", status: "Inactive" },
  { id: "C-008", name: "Leila Benali", email: "leila.b@email.com", orders: 9, spent: "7,800 MAD", joined: "Aug 12, 2024", status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function AdminCustomers() {
  const [filter, setFilter] = useState("All");
  const { searchQuery, setSearchQuery, setPageResults } = useAdminSearch();

  // Sync customers to global search results
  useEffect(() => {
    const results = customers.map(c => ({
      id: c.id,
      title: c.name,
      subtitle: c.email,
      href: "/admin/customers",
      icon: "person",
      type: "content" as const
    }));
    setPageResults(results);
    
    // Cleanup on unmount
    return () => setPageResults([]);
  }, [setPageResults]);

  const filtered = customers.filter((c) => {
    const matchFilter = filter === "All" || c.status === filter;
    const matchSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage and view your customer base.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-lg">download</span>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Customers", value: customers.length, icon: "group" },
          { label: "Active", value: customers.filter((c) => c.status === "Active").length, icon: "person_check" },
          { label: "New This Month", value: customers.filter((c) => c.status === "New").length, icon: "person_add" },
          { label: "Avg. Orders", value: "4.1", icon: "shopping_bag" },
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

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "New", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40" 
              placeholder="Search customers..." 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Customer", "Email", "Orders", "Total Spent", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{c.email}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{c.orders}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{c.spent}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
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
      </div>
    </div>
  );
}
