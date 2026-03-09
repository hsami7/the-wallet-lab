"use client";

import { useState } from "react";

type Notification = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: "Order" | "Inventory" | "Customer" | "Finance";
};

const initialNotifications: Notification[] = [
  { id: "1",  icon: "shopping_cart",    title: "New order #ORD-4822",             desc: "Jean Dupont placed a new order — Carbon Series Pro",      time: "2 min ago",   unread: true,  category: "Order"     },
  { id: "2",  icon: "inventory_2",      title: "Low stock: Titanium Minimalist",   desc: "Only 7 units remaining. Consider restocking soon.",       time: "1 hr ago",    unread: true,  category: "Inventory" },
  { id: "3",  icon: "assignment_return",title: "Refund requested",                 desc: "Karim El Idrissi — ORD-4815 · 950 MAD",                   time: "3 hrs ago",   unread: false, category: "Finance"   },
  { id: "4",  icon: "person_add",       title: "New customer registered",          desc: "nadia.c@email.com just signed up",                        time: "5 hrs ago",   unread: false, category: "Customer"  },
  { id: "5",  icon: "local_shipping",   title: "Order shipped: #ORD-4820",         desc: "Sara El Amrani's order is on its way",                    time: "6 hrs ago",   unread: false, category: "Order"     },
  { id: "6",  icon: "inventory_2",      title: "Out of stock: Stealth Black",      desc: "Stealth Black Edition is now out of stock (0 units)",     time: "Yesterday",   unread: false, category: "Inventory" },
  { id: "7",  icon: "shopping_cart",    title: "New order #ORD-4819",             desc: "Omar Bensali — Classic Cognac · 650 MAD",                 time: "Yesterday",   unread: false, category: "Order"     },
  { id: "8",  icon: "confirmation_number", title: "Promo LAUNCH20 near limit",    desc: "342 of 500 uses reached (68%)",                           time: "2 days ago",  unread: false, category: "Finance"   },
  { id: "9",  icon: "star",             title: "New product review",               desc: "Carbon Series Pro received a 5-star review",              time: "2 days ago",  unread: false, category: "Customer"  },
  { id: "10", icon: "payments",         title: "Monthly revenue milestone",        desc: "March revenue exceeded 40,000 MAD 🎉",                    time: "3 days ago",  unread: false, category: "Finance"   },
];

const categoryColors: Record<string, string> = {
  Order:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Inventory: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Customer:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Finance:   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const categoryIcons: Record<string, string> = {
  Order: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  Inventory: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  Customer: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  Finance: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = filter === "All"
    ? notifications
    : filter === "Unread"
    ? notifications.filter((n) => n.unread)
    : notifications.filter((n) => n.category === filter);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-lg">done_all</span>
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Unread", "Order", "Inventory", "Customer", "Finance"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f ? "bg-primary text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}>
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-bold">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">notifications_off</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm">No notifications here.</p>
          </div>
        )}
        {filtered.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${n.unread ? "bg-primary/5 dark:bg-primary/5" : ""}`}>
            {/* Icon */}
            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${categoryIcons[n.category]}`}>
              <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className={`text-sm leading-snug ${n.unread ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                  {n.title}
                </p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[n.category]}`}>
                  {n.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.desc}</p>
              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {n.unread && (
                <button onClick={() => markRead(n.id)} title="Mark as read"
                  className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-base">mark_email_read</span>
                </button>
              )}
              <button onClick={() => dismiss(n.id)} title="Dismiss"
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            {/* Unread dot */}
            {n.unread && <span className="size-2 rounded-full bg-primary shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
