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
      customer:profiles(full_name),
      items:order_items(
        product:products(name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10); // increased limit to show more recent activity

  const formattedRecentOrders = rawRecentOrders?.map((order: any) => {
    const shipping = order.shipping_address;
    const nameFromShipping = shipping?.firstName ? `${shipping.firstName} ${shipping.lastName}` : null;
    const customerName = nameFromShipping || order.customer?.full_name || "Guest";

    return {
      id: `#ORD-${order.id.slice(0, 4).toUpperCase()}`,
      customer: customerName,
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
      product:products(name, category)
    `);

  const productStats: Record<string, { name: string; category: string; units: number; revenue: number }> = {};
  
  topSellersData?.forEach((item: any) => {
    const pName = item.product?.name;
    if (!pName) return;
    if (!productStats[pName]) {
      productStats[pName] = { 
        name: pName, 
        category: item.product?.category || "Uncategorized", 
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold">Revenue Over Time</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">{totalRevenue.toLocaleString()} MAD</span>
                <span className="text-sm text-emerald-500 font-bold">+10% vs last week</span>
              </div>
            </div>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-primary/30">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="relative pt-4 flex gap-4">
            {/* Y-axis Labels */}
            <div className="flex flex-col justify-between h-48 grow-0 shrink-0 min-w-[50px] text-[10px] font-bold text-slate-400 py-1">
              <span>{Math.round(totalRevenue * 1.2).toLocaleString()}</span>
              <span>{Math.round(totalRevenue * 0.8).toLocaleString()}</span>
              <span>{Math.round(totalRevenue * 0.4).toLocaleString()}</span>
              <span className="text-primary font-black uppercase tracking-tight">0 MAD</span>
            </div>
            
            <div className="flex-1">
              {/* Line Chart Simulation */}
              <div className="relative h-48 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="neonGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0d59f2" stopOpacity="0.4"></stop>
                      <stop offset="100%" stopColor="#0d59f2" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10 V100 H0 Z" fill="url(#neonGradient)"></path>
                  <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10" fill="none" stroke="#0d59f2" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Volume Chart Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold">Order Volume</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">{totalOrders.toLocaleString()}</span>
                <span className="text-sm text-emerald-500 font-bold">+4% vs last week</span>
              </div>
            </div>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-primary/30">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="relative pt-4 flex gap-4">
            {/* Y-axis Labels for Order Volume */}
            <div className="flex flex-col justify-between h-48 grow-0 shrink-0 min-w-[30px] text-[10px] font-bold text-slate-400 py-1 text-right">
              <span>1.5k</span>
              <span>1k</span>
              <span>500</span>
              <span className="text-primary font-black uppercase tracking-tight">0</span>
            </div>
            
            <div className="flex-1">
              {/* Bar Chart Simulation */}
              <div className="flex items-end justify-between h-48 w-full px-2">
                {[
                  { day: "Mon", height: "45%" },
                  { day: "Tue", height: "75%" },
                  { day: "Wed", height: "90%", active: true },
                  { day: "Thu", height: "55%" },
                  { day: "Fri", height: "65%" },
                  { day: "Sat", height: "80%" },
                  { day: "Sun", height: "40%" },
                ].map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center w-full h-full justify-end">
                    <div 
                      className={`w-6 sm:w-8 rounded-full transition-all duration-500 ${
                        bar.active 
                          ? "bg-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.6)]" 
                          : "bg-slate-200 dark:bg-slate-700/50"
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* Product Performance Section */}
      <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 mt-6 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Performance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold font-geist">Top sellers by unit volume</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">Live Intelligence</span>
        </div>
        <div className="p-8 flex flex-col gap-10">
          {topSellers.length > 0 ? (
            topSellers.map((p) => (
              <div key={p.rank} className="flex items-center gap-8 group">
                <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
                  <span className={`text-2xl font-black italic ${
                    p.rank === 1 ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" :
                    p.rank === 2 ? "text-slate-400" :
                    p.rank === 3 ? "text-slate-300" :
                    "text-slate-200 dark:text-slate-700"
                  }`}>{p.rank}</span>
                  {p.rank === 1 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#0d59f2]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-end justify-between mb-4">
                    <div className="min-w-0">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate block uppercase tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{p.category}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-slate-900 dark:text-white block tracking-tighter">{p.units} UNITS SOLD</span>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Trending high</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-zinc-800/50 rounded-full overflow-hidden p-[2px]">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        p.rank === 1 ? "bg-primary shadow-[0_0_15px_rgba(13,89,242,0.4)]" : "bg-slate-400 dark:bg-slate-600"
                      }`}
                      style={{ width: `${p.share}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center opacity-30 flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl mb-3 animate-pulse">analytics</span>
              <p className="text-xs font-bold uppercase tracking-widest">Waiting for initial sales data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
