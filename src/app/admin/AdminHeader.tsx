"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const notifications = [
  { icon: "shopping_cart",   title: "New order #ORD-4822",          desc: "Jean Dupont placed an order",       time: "2m ago",  unread: true  },
  { icon: "inventory_2",     title: "Low stock: Titanium Minimalist", desc: "Only 7 units remaining",           time: "1h ago",  unread: true  },
  { icon: "assignment_return",title: "Refund requested",              desc: "Karim El Idrissi — ORD-4815",     time: "3h ago",  unread: false },
  { icon: "person_add",      title: "New customer registered",       desc: "nadia.c@email.com just signed up", time: "5h ago",  unread: false },
];

export default function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64 md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 border-0 transition-all"
            placeholder="Search items..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Settings */}
        <Link
          href="/admin/settings"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors group"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-500">settings</span>
        </Link>
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="Toggle theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                  <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map((n, i) => (
                    <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${n.unread ? "bg-primary/5" : ""}`}>
                      <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.unread ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                        <span className="material-symbols-outlined text-base">{n.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm leading-snug ${n.unread ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="size-2 rounded-full bg-primary shrink-0 mt-2" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link href="/admin/notifications" onClick={() => setNotifOpen(false)}
                    className="text-xs text-primary font-medium hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
