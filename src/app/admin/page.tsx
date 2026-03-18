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
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = (visitorCount || 0) > 0 ? (totalOrders / (visitorCount || 1)) * 100 : 0;

  // 2. Variant Performance Matrix
  const { data: variantData } = await supabase.from("order_items").select("variant");
  const variantStats: Record<string, { label: string; count: number; hex?: string }> = {};
  
  variantData?.forEach((item: any) => {
    if (!item.variant) return;
    const key = typeof item.variant === 'object' ? item.variant.name : item.variant;
    if (!variantStats[key]) {
      variantStats[key] = { 
        label: key, 
        count: 0, 
        hex: typeof item.variant === 'object' ? item.variant.hex : undefined 
      };
    }
    variantStats[key].count += 1;
  });

  const topVariants = Object.values(variantStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // 3. Fetch Recent Orders
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

  const stats = [
    { label: "GMV (Revenue)", value: `${totalRevenue.toLocaleString()} MAD`, icon: "payments", sub: "Live Revenue" },
    { label: "AOV (Average)", value: `${aov.toFixed(0)} MAD`, icon: "analytics", sub: "Value per order" },
    { label: "Conversion", value: `${conversionRate.toFixed(1)}%`, icon: "ads_click", sub: "Visitor to Order" },
    { label: "Total Orders", value: totalOrders.toString(), icon: "shopping_bag", sub: "Lifetime Vol." },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Lab Operations Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Real-time telemetry and fulfillment metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
               </div>
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">Live</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Recent Orders - Occupies 2 columns */}
         <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                Recent Transactions
              </h2>
              <Link href="/admin/orders" className="text-[10px] font-black uppercase text-primary hover:underline">View All Orders</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-3 text-[10px] uppercase font-black text-slate-400 tracking-widest">Order</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase font-black text-slate-400 tracking-widest">Customer</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase font-black text-slate-400 tracking-widest">Amount</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase font-black text-slate-400 tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formattedRecentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-black text-primary text-xs">{order.id}</td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-slate-900 dark:text-white">{order.customer}</p>
                         <p className="text-[10px] text-slate-400 italic line-clamp-1">{order.product}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900 dark:text-white">{order.amount}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColors[order.status.toLowerCase()] || 'bg-slate-100'}`}>
                            {order.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>

         {/* Variant Matrix */}
         <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-primary/5">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                Variant Matrix
              </h2>
              <span className="material-symbols-outlined text-primary text-sm">dynamic_feed</span>
            </div>
            <div className="p-6 space-y-6">
               {topVariants.length > 0 ? (
                 topVariants.map((v, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                         <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full border border-slate-200" style={{ backgroundColor: v.hex || '#000' }} />
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.label}</span>
                         </div>
                         <span className="text-[10px] font-black text-primary uppercase">{v.count} Sales</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary rounded-full transition-all duration-1000" 
                           style={{ width: `${(v.count / (variantData?.length || 1)) * 100}%` }} 
                         />
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-12 text-center opacity-20">
                    <span className="material-symbols-outlined text-4xl">analytics</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">No Variant Data</p>
                 </div>
               )}

               <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Top Performer</p>
                     <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{topVariants[0]?.label || 'Pending'}</p>
                     <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">This variant represents {Math.round((topVariants[0]?.count || 0) / (variantData?.length || 1) * 100)}% of your total lab output.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
