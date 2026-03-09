"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin",             label: "Overview",    icon: "dashboard" },
  { href: "/admin/orders",      label: "Orders",      icon: "shopping_cart" },
  { href: "/admin/products",    label: "Products",    icon: "inventory_2" },
  { href: "/admin/customers",   label: "Customers",   icon: "group" },
  { href: "/admin/analytics",   label: "Analytics",   icon: "leaderboard" },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: "confirmation_number" },
  { href: "/admin/settings",    label: "Settings",    icon: "settings" },
];

const notifications = [
  { icon: "shopping_cart",   title: "New order #ORD-4822",          desc: "Jean Dupont placed an order",       time: "2m ago",  unread: true  },
  { icon: "inventory_2",     title: "Low stock: Titanium Minimalist", desc: "Only 7 units remaining",           time: "1h ago",  unread: true  },
  { icon: "assignment_return",title: "Refund requested",              desc: "Karim El Idrissi — ORD-4815",     time: "3h ago",  unread: false },
  { icon: "person_add",      title: "New customer registered",       desc: "nadia.c@email.com just signed up", time: "5h ago",  unread: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-slate-100 font-bold text-sm leading-tight">The Wallet Lab</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              AM
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold truncate">Alex Morgan</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate">alex@walletlab.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 border-0"
              placeholder="Search orders, clients, or insights..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
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

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </Link>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
