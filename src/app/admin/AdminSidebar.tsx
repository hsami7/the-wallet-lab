"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/admin",             label: "Overview",    icon: "dashboard" },
  { href: "/admin/orders",      label: "Orders",      icon: "shopping_cart" },
  { href: "/admin/products",    label: "Products",    icon: "inventory_2" },
  { href: "/admin/customers",   label: "Customers",   icon: "group" },
  { href: "/admin/analytics",   label: "Analytics",   icon: "leaderboard" },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: "confirmation_number" },
  { href: "/admin/settings",    label: "Settings",    icon: "settings" },
];

export default function AdminSidebar({
  fullName,
  initials,
  email,
}: {
  fullName: string;
  initials: string;
  email?: string;
}) {
  const pathname = usePathname() || "/admin";

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={140} />
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
        <div className="flex items-center gap-3 p-2 mb-2">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold truncate">{fullName}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
