"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function OrdersClient({ initialOrders }: { initialOrders: Record<string, any>[] }) {
  const supabase = createClient();
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Refunded"];

  const filtered = orders.filter((o) => {
    const statusMap: Record<string, string> = {
      "Pending": "pending",
      "Processing": "processing",
      "Shipped": "shipped", 
      "Delivered": "delivered",
      "Refunded": "refunded",
    };
    
    const mappedFilter = statusMap[filter] || filter;
    const matchFilter = filter === "All" || o.status === mappedFilter;
    
    // Safely search through customer name/email, order ID, or product names
    const searchLower = search.toLowerCase();
    
    // We expect the profile to be joined
    const customerName = o.profiles?.full_name || o.profiles?.email || "Unknown Customer";
    
    // We expect items to be joined, mapping over products
    const productNames = o.order_items?.map((item: Record<string, any>) => item.products?.name).join(" ") || "";
    
    const matchSearch = 
      o.id.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      productNames.toLowerCase().includes(searchLower);
      
    return matchFilter && matchSearch;
  });

  // Example status update handler
  async function updateOrderStatus(id: string, newStatus: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)
        .select(`
          *,
          profiles(full_name, email),
          order_items(
            quantity, price_at_time,
            products(name, sku)
          )
        `)
        .single();
        
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? data : o));
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status.");
    }
  }

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  };
  
  // Helper to derive main product for summary
  const getMainProduct = (orderItems: Record<string, any>[]) => {
    if (!orderItems || orderItems.length === 0) return "No items";
    const firstItem = orderItems[0];
    const productName = firstItem.products?.name || "Unknown Product";
    if (orderItems.length > 1) {
      return `${productName} +${orderItems.length - 1} more`;
    }
    return productName;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage, monitor, and update status for all customer transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length.toString(), icon: "receipt_long" },
          { label: "Pending Processing", value: orders.filter(o => o.status === 'processing').length.toString(), icon: "hourglass_empty" },
          { label: "Shipped", value: orders.filter(o => o.status === 'shipped').length.toString(), icon: "local_shipping" },
          { label: "Refund Requests", value: orders.filter(o => o.status === 'refunded').length.toString(), icon: "assignment_return" },
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40"
              placeholder="Search orders..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Order ID", "Customer", "Product", "Amount", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const customerName = order.profiles?.full_name || order.profiles?.email || "Unknown";
                const dateRaw = new Date(order.created_at);
                const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
                const formattedDate = dateRaw.toLocaleDateString('en-US', dateOptions);
                const displayStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                
                return (
                  <tr
                    key={order.id}
                    className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-primary">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{customerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{getMainProduct(order.order_items)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formattedDate}</td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 1 to {filtered.length} of {orders.length} orders</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 text-xs disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs">1</button>
            <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 text-xs disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
