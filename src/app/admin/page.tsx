import Link from "next/link";

const recentOrders = [
  {
    id: "#ORD-4821",
    customer: "Jean Dupont",
    product: "Carbon Series Pro",
    amount: "850 MAD",
    status: "Shipped",
    date: "Mar 09, 2026",
  },
  {
    id: "#ORD-4820",
    customer: "Sara El Amrani",
    product: "Titanium Minimalist",
    amount: "1,200 MAD",
    status: "Processing",
    date: "Mar 09, 2026",
  },
  {
    id: "#ORD-4819",
    customer: "Omar Bensali",
    product: "Classic Cognac",
    amount: "650 MAD",
    status: "Delivered",
    date: "Mar 08, 2026",
  },
  {
    id: "#ORD-4818",
    customer: "Nadia Chaoui",
    product: "Stealth Black Edition",
    amount: "950 MAD",
    status: "Shipped",
    date: "Mar 08, 2026",
  },
  {
    id: "#ORD-4817",
    customer: "Yassine Mouhssine",
    product: "Carbon Series Pro",
    amount: "850 MAD",
    status: "Pending",
    date: "Mar 07, 2026",
  },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const topSellers = [
  { rank: 1, name: "Carbon Series Pro", category: "Carbon Fiber", units: 312, revenue: "265,200 MAD", share: 100 },
  { rank: 2, name: "Classic Cognac", category: "Leather", units: 248, revenue: "161,200 MAD", share: 79 },
  { rank: 3, name: "Titanium Minimalist", category: "Metal", units: 189, revenue: "226,800 MAD", share: 61 },
  { rank: 4, name: "Stealth Black Edition", category: "Carbon Fiber", units: 156, revenue: "148,200 MAD", share: 50 },
  { rank: 5, name: "The Nomad Slim", category: "Leather", units: 134, revenue: "96,480 MAD", share: 43 },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Welcome back, here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Revenue",
            value: "42,500 MAD",
            icon: "payments",
            trend: "+12.5%",
            trendUp: true,
          },
          {
            label: "Total Orders",
            value: "1,284",
            icon: "shopping_cart",
            trend: "+8.2%",
            trendUp: true,
          },
          {
            label: "Total Visitors",
            value: "15,200",
            icon: "group",
            trend: "+3.1%",
            trendUp: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
          >
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <span
                className={`text-xs font-medium mt-2 inline-block ${
                  stat.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600"
                }`}
              >
                {stat.trend} vs last month
              </span>
            </div>
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          >
            View all
            <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className={`${
                    i < recentOrders.length - 1
                      ? "border-b border-slate-100 dark:border-slate-800"
                      : ""
                  } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.product}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Sellers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-6">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Top 5 Sellers</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">This Month</span>
        </div>
        <div className="p-6 flex flex-col gap-5">
          {topSellers.map((p) => (
            <div key={p.rank} className="flex items-center gap-4">
              <span className={`text-sm font-bold w-5 shrink-0 ${
                p.rank === 1 ? "text-yellow-500" :
                p.rank === 2 ? "text-slate-400" :
                p.rank === 3 ? "text-orange-400" :
                "text-slate-500 dark:text-slate-500"
              }`}>#{p.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate block">{p.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.category}</span>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{p.units} units</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.revenue}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      p.rank === 1 ? "bg-primary" : "bg-primary/50"
                    }`}
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
