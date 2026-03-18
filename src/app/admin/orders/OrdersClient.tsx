"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useAdminSearch } from "@/context/AdminSearchContext";
import { updateOrderStatus, updateOrderTracking } from "@/app/actions/orders";

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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { searchQuery, setSearchQuery, setPageResults } = useAdminSearch();
  const { showToast } = useToast();
  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Refunded"];

  // Tracking State
  const [trackingInfo, setTrackingInfo] = useState({
    tracking_number: "",
    carrier: "Express"
  });

  async function handleStatusUpdate(orderId: string | string[], newStatus: string) {
    try {
      const res = await updateOrderStatus(orderId, newStatus.toLowerCase());
      if (!res.success) throw new Error(res.error);

      const ids = Array.isArray(orderId) ? orderId : [orderId];
      setOrders(orders.map(o => ids.includes(o.id) ? { ...o, status: newStatus.toLowerCase() } : o));
      if (Array.isArray(orderId)) setSelectedIds(new Set());
      showToast(`Orders updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  }

  async function handleTrackingUpdate() {
    if (!selectedOrderId) return;
    try {
      const res = await updateOrderTracking(selectedOrderId, trackingInfo);
      if (!res.success) throw new Error(res.error);

      setOrders(orders.map(o => o.id === selectedOrderId ? { ...o, ...trackingInfo } : o));
      showToast("Tracking information updated", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order permanently? This action cannot be undone.")) return;
    
    try {
      const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", orderId);
      if (itemsError) throw itemsError;

      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;

      setOrders(orders.filter(o => o.id !== orderId));
      showToast("Order deleted successfully", "success");
      setSelectedOrderId(null);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(o => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  useEffect(() => {
    const results = orders.map(o => ({
      id: o.id,
      title: `Order #${o.id.slice(0, 8).toUpperCase()}`,
      subtitle: `${o.profiles?.full_name || o.profiles?.email || 'Customer'} — ${o.total_amount} MAD`,
      href: `/admin/orders`,
      icon: "shopping_cart",
      type: "content" as const
    }));
    setPageResults(results);
    return () => setPageResults([]);
  }, [orders, setPageResults]);

  const filtered = orders.filter((o) => {
    const statusMap: Record<string, string> = {
      "Pending": "pending", "Processing": "processing", "Shipped": "shipped", 
      "Delivered": "delivered", "Refunded": "refunded",
    };
    const mappedFilter = statusMap[filter] || filter;
    const matchFilter = filter === "All" || o.status === mappedFilter;
    const searchLower = searchQuery.toLowerCase();
    const shipping = o.shipping_address;
    const shippingName = shipping?.firstName ? `${shipping.firstName} ${shipping.lastName}` : null;
    const customerName = shippingName || o.profiles?.full_name || o.profiles?.email || "Unknown Customer";
    const productNames = o.order_items?.map((item: Record<string, any>) => item.products?.name).join(" ") || "";
    
    return matchFilter && (
      o.id.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      productNames.toLowerCase().includes(searchLower)
    );
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  
  useEffect(() => {
    if (selectedOrder) {
      setTrackingInfo({
        tracking_number: selectedOrder.tracking_number || "",
        carrier: selectedOrder.carrier || "Express"
      });
    }
  }, [selectedOrderId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };
  
  const getMainProduct = (orderItems: Record<string, any>[]) => {
    if (!orderItems || orderItems.length === 0) return "No items";
    const productName = orderItems[0].products?.name || "Unknown Product";
    return orderItems.length > 1 ? `${productName} +${orderItems.length - 1} more` : productName;
  };

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage, monitor, and update status for all customer transactions.</p>
      </div>

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

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>{s}</button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40" placeholder="Search orders..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 w-10">
                   <input 
                     type="checkbox" 
                     checked={selectedIds.size === filtered.length && filtered.length > 0} 
                     onChange={toggleSelectAll}
                     className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                   />
                </th>
                {["Order ID", "Customer", "Product", "Amount", "Status", "Risk", "Date", "Actions"].map((h) => (
                  <th key={h} className={`text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider ${h === 'Risk' ? 'text-center' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const shipping = order.shipping_address;
                const customerName = (shipping?.firstName ? `${shipping.firstName} ${shipping.lastName}` : null) || order.profiles?.full_name || order.profiles?.email || "Unknown";
                const dateRaw = new Date(order.created_at);
                const formattedDate = dateRaw.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                const riskColor = order.fraud_score > 50 ? 'bg-red-500/10 text-red-500' : order.fraud_score > 20 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500';
                
                return (
                  <tr key={order.id} className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedIds.has(order.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                       <input 
                         type="checkbox" 
                         checked={selectedIds.has(order.id)}
                         onChange={() => toggleSelect(order.id)}
                         className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                       />
                    </td>
                    <td className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline" onClick={() => setSelectedOrderId(order.id)}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{customerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{getMainProduct(order.order_items)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-current ${riskColor}`}>
                          {order.fraud_score || 0}%
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formattedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedOrderId(order.id)} className="text-slate-400 hover:text-primary transition-all active:scale-90" title="View Details">
                           <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <select 
                          value={order.status.toLowerCase()}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="bg-transparent text-[10px] font-black text-slate-400 hover:text-primary outline-none cursor-pointer uppercase tracking-widest border-0 focus:ring-0"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <button onClick={() => handleDeleteOrder(order.id)} className="text-slate-400 hover:text-red-500 transition-all active:scale-90" title="Delete">
                           <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 border-r border-slate-700 dark:border-slate-200 pr-8">
            <span className="text-xl font-bold">{selectedIds.size}</span>
            <span className="text-xs uppercase font-black tracking-widest text-slate-400">Selected</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bulk Status:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleStatusUpdate([...selectedIds], "processing")}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110"
              >
                Processing
              </button>
              <button 
                onClick={() => handleStatusUpdate([...selectedIds], "shipped")}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110"
              >
                Shipped
              </button>
            </div>
            <button 
               onClick={() => setSelectedIds(new Set())}
               className="ml-4 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Order Details <span className="text-primary font-black">#{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">person</span> Customer Info
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                      {selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{selectedOrder.profiles?.email}</p>
                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
                       <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs">mail</span> {selectedOrder.profiles?.email}
                       </p>
                       <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs">call</span> {selectedOrder.shipping_address?.phone || selectedOrder.profiles?.phone || "No phone provided"}
                       </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">shield</span> Security Assessment
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-500">IP Address</span>
                       <span className="text-xs font-mono font-bold text-slate-900 dark:text-white px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">{selectedOrder.ip_address || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-500">Fraud Score</span>
                       <span className={`text-xs font-black px-2 py-0.5 rounded ${selectedOrder.fraud_score > 50 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {selectedOrder.fraud_score || 0}%
                       </span>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">notifications_active</span> Notification History
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {selectedOrder.notification_history?.length > 0 ? (
                      <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                        {selectedOrder.notification_history.map((n: any, nidx: number) => (
                          <div key={nidx} className="relative pl-6">
                            <div className="absolute left-0 top-1.5 size-3 rounded-full bg-primary border-2 border-white dark:border-slate-900 shadow-sm" />
                            <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">{n.message}</p>
                            <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-widest">{new Date(n.timestamp).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic text-center py-4">No notifications sent yet.</p>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">local_shipping</span> Fulfillment Details
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Courier</label>
                          <input 
                            value={trackingInfo.carrier}
                            onChange={(e) => setTrackingInfo({...trackingInfo, carrier: e.target.value})}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Tracking Number</label>
                          <input 
                            placeholder="e.g. EBX-998822"
                            value={trackingInfo.tracking_number}
                            onChange={(e) => setTrackingInfo({...trackingInfo, tracking_number: e.target.value})}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                          />
                       </div>
                    </div>
                    <button 
                      onClick={handleTrackingUpdate}
                      className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Update Tracking Info
                    </button>
                  </div>
                </section>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">inventory_2</span> Order Items
                </h4>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                       <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          <img src={item.products?.image_url} alt="" className="h-full w-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">{item.products?.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} × {formatCurrency(item.unit_price)}</span>
                             {item.variant && (
                               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10">
                                  <div className="size-2 rounded-full border border-white/20" style={{ backgroundColor: typeof item.variant === 'object' ? item.variant.hex : item.variant }} />
                                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">{typeof item.variant === 'object' ? item.variant.name : 'Custom'}</span>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedOrder.total_amount - 20)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Delivery</span>
                      <span className="font-bold text-slate-900 dark:text-white">20.00 MAD</span>
                   </div>
                   <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Total Amount</span>
                      <span className="text-2xl font-black text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  Delete Order
               </button>
               <div className="flex gap-3">
                  <button onClick={() => setSelectedOrderId(null)} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all">
                    Close
                  </button>
                  <button onClick={() => showToast("Print functionality coming soon", "info")} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">print</span> Print Invoice
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
