"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";
import { useAdminSearch } from "@/context/AdminSearchContext";

const notifications = [
  { icon: "shopping_cart", title: "New order #ORD-4822", desc: "Jean Dupont placed an order", time: "2m ago", unread: true },
  { icon: "inventory_2", title: "Low stock: Titanium Minimalist", desc: "Only 7 units remaining", time: "1h ago", unread: true },
  { icon: "assignment_return", title: "Refund requested", desc: "Karim El Idrissi — ORD-4815", time: "3h ago", unread: false },
  { icon: "person_add", title: "New customer registered", desc: "nadia.c@email.com just signed up", time: "5h ago", unread: false },
];

export default function AdminHeader({
  fullName,
  initials,
  email,
}: {
  fullName?: string;
  initials?: string;
  email?: string;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { searchQuery, setSearchQuery, pageResults } = useAdminSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".admin-search-container")) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/admin", label: "Overview", icon: "dashboard" },
    { href: "/admin/orders", label: "Orders Management", icon: "shopping_cart" },
    { href: "/admin/products", label: "Product Inventory", icon: "inventory_2" },
    { href: "/admin/categories", label: "Categories", icon: "category" },
    { href: "/admin/collections", label: "Home Collections", icon: "web" },
    { href: "/admin/customers", label: "Customer List", icon: "group" },
    { href: "/admin/analytics", label: "Business Analytics", icon: "leaderboard" },
    { href: "/admin/promo-codes", label: "Promo Codes", icon: "confirmation_number" },
    { href: "/admin/settings", label: "System Settings", icon: "settings" },
  ];

  const filteredNavItems = searchQuery.trim() === "" 
    ? [] 
    : navItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.href.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const filteredPageResults = searchQuery.trim() === ""
    ? []
    : pageResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden flex items-center justify-center p-2 text-slate-600 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          
          <Link href="/admin" className="lg:hidden flex items-center">
            <Logo size={120} />
          </Link>

          {/* Search */}
          <div className="relative w-40 md:w-80 hidden sm:block admin-search-container">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 border-0 transition-all"
              placeholder="Navigate to..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />

            {/* Search Results */}
            {showResults && (filteredNavItems.length > 0 || filteredPageResults.length > 0) && (
              <div className="absolute top-12 left-0 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top max-h-[80vh] overflow-y-auto">
                <div className="p-2 flex flex-col gap-1">
                  
                  {/* Page-Specific Content Results */}
                  {filteredPageResults.length > 0 && (
                    <div className="mb-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">In this Section</p>
                      {filteredPageResults.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">{item.icon || "receipt_long"}</span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white block">{item.title}</span>
                            {item.subtitle && <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">{item.subtitle}</span>}
                          </div>
                          <span className="ml-auto material-symbols-outlined text-slate-400 text-[16px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Navigation Results */}
                  {filteredNavItems.length > 0 && (
                    <div>
                      {filteredPageResults.length > 0 && <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 mt-1">Navigation</p>}
                      {filteredNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                          <span className="ml-auto material-symbols-outlined text-slate-400 text-[16px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Settings */}
          <Link
            href="/admin/settings"
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all group"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-500">settings</span>
          </Link>
          {/* Theme toggle - optimized for instant display */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px] show-light">dark_mode</span>
            <span className="material-symbols-outlined text-[20px] show-dark">light_mode</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-[1.5px] border-white dark:border-slate-900" />
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-12 z-[110] w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                    <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
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

      {/* Admin Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 lg:hidden">
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="p-6 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  <Logo size={140} forceFull />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-8 admin-search-container">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 border-0 transition-all font-medium"
                  placeholder="Navigate to..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                />
                
                {/* Search Results for Mobile */}
                {showResults && (filteredNavItems.length > 0 || filteredPageResults.length > 0) && (
                  <div className="absolute top-14 left-0 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[110] max-h-[60vh] overflow-y-auto">
                    <div className="p-2 flex flex-col gap-1">
                      {filteredPageResults.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery("");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">{item.icon || "receipt_long"}</span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white block">{item.title}</span>
                            {item.subtitle && <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">{item.subtitle}</span>}
                          </div>
                        </Link>
                      ))}
                      {filteredNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery("");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-semibold transition-all hover:bg-primary hover:text-white group"
                  >
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-white/30 transition-all text-slate-600 dark:text-slate-400 group-hover:text-white">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {initials || "AD"}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{fullName || "Admin Portal"}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{email || "Backoffice Access"}</p>
                    </div>
                  </div>
                  <form action={logout}>
                    <button type="submit" className="size-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
                      <span className="material-symbols-outlined text-xl">logout</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
