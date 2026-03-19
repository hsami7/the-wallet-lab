"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useAdminSearch } from "@/context/AdminSearchContext";
import { updateOrderStatus, updateOrderTracking, deleteOrder } from "@/app/actions/orders";
import { Logo } from "@/components/Logo";

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

  const [isDeleting, setIsDeleting] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  async function handleDeleteOrder(orderId: string | string[]) {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      const ids = Array.isArray(orderId) ? orderId : (typeof orderId === 'string' && orderId.includes(',') ? orderId.split(',') : [orderId]);
      const res = await deleteOrder(ids);
      if (!res.success) throw new Error(res.error);

      setOrders(orders.filter(o => !ids.includes(o.id)));
      showToast(`${ids.length} order${ids.length > 1 ? 's' : ''} deleted successfully`, "success");
      setOrderToDelete(null);
      setSelectedOrderId(null);
      setSelectedIds(new Set());
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsDeleting(false);
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

  const handlePrint = () => {
    window.print();
  };

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
          <div className="flex items-center gap-3">
             {selectedIds.size > 0 && (
               <button 
                 onClick={() => setOrderToDelete(Array.from(selectedIds).join(','))}
                 className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all animate-in slide-in-from-left-2"
               >
                 <span className="material-symbols-outlined text-sm">delete</span>
                 Delete Selection ({selectedIds.size})
               </button>
             )}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40" placeholder="Search orders..." />
            </div>
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
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white font-medium">{customerName}</p>
                      <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider leading-none mt-1">{order.profiles?.email || order.shipping_address?.email || "No Email"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{getMainProduct(order.order_items)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-current ${riskColor}`}>
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
                        <button onClick={() => setOrderToDelete(order.id)} className="text-slate-400 hover:text-red-500 transition-all active:scale-90" title="Delete">
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bulk Status:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleStatusUpdate([...selectedIds], "processing")}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110"
              >
                Processing
              </button>
              <button 
                onClick={() => handleStatusUpdate([...selectedIds], "shipped")}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110"
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
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">contact_page</span> Account Identity
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all space-y-6">
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Email Address</p>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                        {selectedOrder.profiles?.email || selectedOrder.shipping_address?.email || "Guest Checkout"}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Phone Number</p>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                        {selectedOrder.shipping_address?.phone || selectedOrder.profiles?.phone || "No phone recorded"}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">shield</span> Security Assessment
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "IP Address", value: selectedOrder.ip_address || "Unknown", icon: "language", mono: true },
                      { 
                        label: "Fraud Score", 
                        value: `${selectedOrder.fraud_score || 0}%`, 
                        icon: "gpp_maybe",
                        custom: <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${(selectedOrder.fraud_score || 0) > 50 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>{selectedOrder.fraud_score || 0}%</span> 
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{item.label}</p>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                          <span className="material-symbols-outlined text-slate-400 text-lg">{item.icon}</span>
                          <span className={item.mono ? 'font-mono' : ''}>{item.custom || item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
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
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
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
                      className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Update Tracking Info
                    </button>
                  </div>
                </section>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">inventory_2</span> Order Items
                </h4>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                   {selectedOrder.order_items?.map((item: any, idx: number) => {
                      const variantImageUrl = item.variant?.imageUrl || item.variant?.image;
                      
                      const productDefaultColor = item.products?.colors?.[0];
                      const fallbackName = typeof productDefaultColor === 'object' ? productDefaultColor.name : productDefaultColor;
                      
                      const variantName = (item.variant && typeof item.variant === 'object') 
                        ? item.variant.name 
                        : (typeof item.variant === 'string' ? item.variant : null);
                      
                      const displayVariant = (variantName && variantName !== 'Default') ? variantName : (fallbackName !== 'Default' ? fallbackName : null);
                      
                      const itemImage = variantImageUrl || item.products?.image_url;
                     
                     return (
                       <div key={idx} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                             {itemImage ? (
                               <img src={itemImage} alt="" className="h-full w-full object-cover" />
                             ) : (
                               <span className="material-symbols-outlined text-slate-300">image</span>
                             )}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-none">{item.products?.name}</p>
                                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1 mb-2">{item.products?.sku || 'NO-SKU'}</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-3 mt-auto">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.quantity} × {formatCurrency(item.unit_price)}</span>
                                {displayVariant && (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
                                     <div 
                                       className="size-2 rounded-full border border-white/20" 
                                       style={{ 
                                         backgroundColor: (item.variant && typeof item.variant === 'object') 
                                           ? (item.variant.hex || item.variant.color || '#000000') 
                                           : (typeof item.variant === 'string' ? item.variant : (typeof productDefaultColor === 'object' ? productDefaultColor.hex : '#000000'))
                                       }} 
                                     />
                                     <span className="text-[9px] font-black text-primary uppercase tracking-widest">{displayVariant}</span>
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>
                     );
                   })}
                </div>

                 <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {/* Dynamic Financial Summary */}
                    {(() => {
                      const shipping = selectedOrder.shipping_address || {};
                      const discountAmount = selectedOrder.discount_amount || shipping.discount_amount || 0;
                      const promoCode = selectedOrder.promo_code || shipping.promo_code || null;
                      const shippingAmount = selectedOrder.shipping_amount !== undefined ? selectedOrder.shipping_amount : (shipping.shipping_amount !== undefined ? shipping.shipping_amount : 20);
                      
                      const itemsSubtotal = selectedOrder.order_items?.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0) || 0;
                      
                      return (
                        <>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                             <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(itemsSubtotal)}</span>
                          </div>

                          {promoCode && (
                            <div className="flex justify-between items-center text-sm">
                               <div className="flex items-center gap-2">
                                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Promo Code</span>
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-widest border border-primary/20">{promoCode}</span>
                               </div>
                               <span className="font-bold text-green-600 dark:text-green-400">-{formatCurrency(discountAmount)}</span>
                            </div>
                          )}

                          {discountAmount > 0 && !promoCode && (
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discount</span>
                               <span className="font-bold text-green-600 dark:text-green-400">-{formatCurrency(discountAmount)}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Delivery</span>
                             <span className="font-bold text-slate-900 dark:text-white">{shippingAmount === 0 ? 'FREE' : formatCurrency(shippingAmount)}</span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800">
                             <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Total Amount</span>
                             <span className="text-2xl font-black text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                          </div>
                        </>
                      );
                    })()}
                 </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <button onClick={() => setOrderToDelete(selectedOrder.id)} className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  Delete Order
               </button>
               <div className="flex gap-3">
                  <button onClick={() => setSelectedOrderId(null)} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                    Close
                  </button>
                  <button onClick={handlePrint} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">print</span> Print Invoice
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
      {/* Redesigned Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-red-500/10 max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
            <div className="p-8 text-center">
              <div className="size-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-20" />
                <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
                Wait! Danger Zone
              </h3>

              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
                Are you absolutely sure? This will permanently delete {orderToDelete.includes(',') ? 'these orders' : 'this order'} and all {orderToDelete.includes(',') ? 'their' : 'its'} history.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(orderToDelete)}
                  disabled={isDeleting}
                  className="w-full py-4 px-6 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Deleting {orderToDelete.includes(',') ? 'Orders' : 'Order'}...
                    </>
                  ) : (
                    `Yes, Delete ${orderToDelete.includes(',') ? `${orderToDelete.split(',').length} Orders` : 'Permanently'}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeleting}
                  className="w-full py-4 px-6 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Nevermind, Go Back
                </button>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-xs">info</span>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Action cannot be undone</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Invoice Template */}
      {selectedOrder && (
        <div id="printable-invoice" className="hidden print:block p-10 bg-white text-black font-sans">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
            <div>
              <Logo size={120} forceFull />
              <div className="mt-4 text-xs text-slate-500 leading-relaxed text-left">
                <p className="font-bold text-slate-900">The Embroidery's Lab</p>
                <p>123 Atelier Street, Design District</p>
                <p>Casablanca, Morocco</p>
                <p>contact@embroiderylab.com</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Invoice</h1>
              <p className="text-sm font-bold text-primary">#{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
              <div className="mt-4 text-xs text-slate-500">
                <p>Date: {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p>Status: <span className="uppercase font-bold">{selectedOrder.status}</span></p>
              </div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-12 mb-10 text-left">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-left">Bill To</h4>
              <p className="font-bold text-slate-900">{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                {selectedOrder.profiles?.email || selectedOrder.shipping_address?.email}<br />
                {selectedOrder.shipping_address?.phone || selectedOrder.profiles?.phone}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-left">Ship To</h4>
              <p className="font-bold text-slate-900">{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                {selectedOrder.shipping_address?.address1}<br />
                {selectedOrder.shipping_address?.address2 ? `${selectedOrder.shipping_address.address2}, ` : ''}
                {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.province} {selectedOrder.shipping_address?.zip}<br />
                Morocco
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <table className="w-full mb-10">
            <thead>
              <tr className="border-b-2 border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="pb-3 px-2 text-left">Item Description</th>
                <th className="pb-3 px-2 text-center">Qty</th>
                <th className="pb-3 px-2 text-right">Unit Price</th>
                <th className="pb-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {selectedOrder.order_items?.map((item: any, idx: number) => {
                const variantName = (item.variant && typeof item.variant === 'object') 
                  ? item.variant.name 
                  : (typeof item.variant === 'string' ? item.variant : null);
                
                return (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-4 px-2 text-left">
                      <p className="font-bold text-slate-900 text-left">{item.products?.name}</p>
                      {variantName && <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5 text-left">{variantName}</p>}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">{item.quantity}</td>
                    <td className="py-4 px-2 text-right font-medium">{formatCurrency(item.unit_price)}</td>
                    <td className="py-4 px-2 text-right font-bold text-slate-900">{formatCurrency(item.quantity * item.unit_price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Summary */}
          <div className="flex justify-end border-t-2 border-slate-100 pt-8">
            <div className="w-1/3 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedOrder.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-900 mb-1">Thank you for choosing The Embroidery&apos;s Lab!</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Crafted with passion in Morocco</p>
          </div>
        </div>
      )}
    </div>
  );
}
