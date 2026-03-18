import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Stats
  const { data: ordersData } = await supabase.from("orders").select("total_amount");
  const { count: visitorCount } = await supabase.from("traffic_logs").select("*", { count: "exact", head: true });

  const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;
  const totalOrders = ordersData?.length || 0;

  // 2. Fetch Recent Orders
  const { data: rawRecentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      status,
      created_at,
      shipping_address,
      customer:profiles(full_name, email),
      items:order_items(
        product:products(name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const formattedRecentOrders = rawRecentOrders?.map((order: any) => {
    const shipping = order.shipping_address;
    const shippingName = shipping?.firstName ? `${shipping.firstName} ${shipping.lastName}` : null;
    const profileName = order.customer?.full_name || order.customer?.email;
    
    return {
      id: `#ORD-${order.id.slice(0, 4)}`,
      customer: shippingName || profileName || "Guest",
      product: order.items?.[0]?.product?.name + (order.items?.length > 1 ? ` (+${order.items.length - 1} more)` : ""),
      amount: `${Number(order.total_amount).toLocaleString()} MAD`,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
  }) || [];

  // 3. Fetch Top Sellers (simplified for now: just based on total units in order_items)
  const { data: topSellersData } = await supabase
    .from("order_items")
    .select(`
      quantity,
      product:products(name, category:categories(name))
    `);

  const productStats: Record<string, { name: string; category: string; units: number; revenue: number }> = {};
  
  topSellersData?.forEach((item: any) => {
    const pName = item.product?.name;
    if (!pName) return;
    if (!productStats[pName]) {
      productStats[pName] = { 
        name: pName, 
        category: item.product?.category?.name || "Uncategorized", 
        units: 0, 
        revenue: 0 
      };
    }
    productStats[pName].units += item.quantity;
    // Note: In a real app we'd fetch price or store it in items. For now we use units.
  });

  const topSellers = Object.values(productStats)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((p, i) => ({
      rank: i + 1,
      name: p.name,
      category: p.category,
      units: p.units,
      revenue: "Real-time sync", // Placeholder as we don't store historical price per item easily without a join
      share: Math.round((p.units / (topSellersData?.reduce((acc, i) => acc + i.quantity, 0) || 1)) * 100)
    }));

  const stats = [
    {
      label: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} MAD`,
      icon: "payments",
      trend: "+--%", // Trends require historical data comparisons (future work)
      trendUp: true,
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: "shopping_cart",
      trend: "+--%",
      trendUp: true,
    },
    {
      label: "Total Visitors",
      value: (visitorCount || 0).toLocaleString(),
      icon: "group",
      trend: "+--%",
      trendUp: true,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Welcome back, here&apos;s what&apos;s happening in the lab.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
          >
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 inline-block">
                Live Data Feed
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 font-geist">
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
              {formattedRecentOrders.length > 0 ? (
                formattedRecentOrders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`${
                      i < formattedRecentOrders.length - 1
                        ? "border-b border-slate-100 dark:border-slate-800"
                        : ""
                    } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-bold text-primary">{order.id}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 italic line-clamp-1">{order.product}</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[order.status.toLowerCase()] || "bg-slate-100 text-slate-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                      <p className="text-xs font-bold uppercase tracking-widest">No orders recorded yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Sellers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Product Performance</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">Top Performers</span>
        </div>
        <div className="p-8 flex flex-col gap-8">
          {topSellers.length > 0 ? (
            topSellers.map((p) => (
              <div key={p.rank} className="flex items-center gap-6">
                <span className={`text-xl font-black w-8 shrink-0 ${
                  p.rank === 1 ? "text-primary" :
                  p.rank === 2 ? "text-slate-400" :
                  p.rank === 3 ? "text-slate-300" :
                  "text-slate-200 dark:text-slate-700"
                }`}>0{p.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate block uppercase tracking-tight">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-sm font-black text-slate-900 dark:text-white block">{p.units} UNITS</span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Best Seller</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        p.rank === 1 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "bg-primary/40"
                      }`}
                      style={{ width: `${p.share}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center opacity-30">
              <span className="material-symbols-outlined text-4xl mb-2">analytics</span>
              <p className="text-xs font-bold uppercase tracking-widest">Waiting for initial sales data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
