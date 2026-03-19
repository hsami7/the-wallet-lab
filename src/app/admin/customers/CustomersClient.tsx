// Helper to handle the "more" UI
"use client";

import React, { useState, useEffect } from "react";
import { useAdminSearch } from "@/context/AdminSearchContext";
import { useToast } from "@/context/ToastContext";
import { banUser, deleteUserAccount } from "@/app/actions/customer";

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Guest: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Banned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  ltv: number;
  joined: string;
  joinedFormatted: string;
  lastActiveFormatted: string;
  lastIp: string;
  status: string;
  isRegistered: boolean;
  itemsCount: number;
  itemsList: any[];
}

export function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [filter, setFilter] = useState("All");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { searchQuery, setSearchQuery, setPageResults } = useAdminSearch();
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Sync customers to global search results
  useEffect(() => {
    const results = customers.map(c => ({
      id: c.id,
      title: c.name,
      subtitle: c.email,
      href: "/admin/customers",
      icon: "person",
      type: "content" as const
    }));
    setPageResults(results);
    return () => setPageResults([]);
  }, [customers, setPageResults]);

  const handleBan = async (id: string, currentlyBanned: boolean) => {
    setIsProcessing(id);
    setActiveMenuId(null);
    try {
      const res = await banUser(id, !currentlyBanned);
      if (!res.success) throw new Error(res.error);
      
      setCustomers(customers.map(c => c.id === id ? { ...c, status: !currentlyBanned ? "Banned" : "Active" } : c));
      showToast(currentlyBanned ? "User unbanned successfully" : "User banned successfully", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];
    setActiveMenuId(null);
    if (!confirm(`Are you ABSOLUTELY sure? This will delete ${ids.length} account(s). This cannot be undone.`)) return;
    
    setIsProcessing("bulk");
    try {
      for (const singleId of ids) {
        const res = await deleteUserAccount(singleId);
        if (!res.success) throw new Error(res.error);
      }
      
      setCustomers(customers.filter(c => !ids.includes(c.id)));
      setSelectedIds(new Set());
      showToast(`${ids.length} account(s) deleted successfully`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = customers.filter((c) => {
    const matchFilter = filter === "All" || c.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone.toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Customer Intelligence</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Deep insights and management for your unified customer base.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Base", value: customers.length, icon: "groups", color: "text-primary", bg: "bg-primary/10" },
          { label: "Banned Users", value: customers.filter(c => c.status === 'Banned').length, icon: "block", color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Total LTV", value: `${customers.reduce((acc, c) => acc + c.ltv, 0).toLocaleString()} MAD`, icon: "payments", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Retention Rate", value: `${Math.round((customers.filter(c => c.orders > 1).length / (customers.length || 1)) * 100)}%`, icon: "rebase_edit", color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className={`size-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${s.color} text-xl`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Banned", "Guest", "New"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40 sm:w-64" 
              placeholder="Filter by name, email or phone..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-6 py-3 w-10 text-center">
                   <input 
                     type="checkbox" 
                     checked={selectedIds.size === filtered.length && filtered.length > 0} 
                     onChange={toggleSelectAll}
                     className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                   />
                </th>
                {["Customer Identity", "Status", "Technical", "Orders", "LTV", "Activity", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isBanned = c.status === 'Banned';
                const isSelected = selectedIds.has(c.id);
                const isMenuActive = activeMenuId === c.id;
                
                return (
                  <tr key={c.id} className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4 text-center">
                       <input 
                         type="checkbox" 
                         checked={isSelected}
                         onChange={() => toggleSelect(c.id)}
                         className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                       />
                    </td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                         <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border ${
                          isBanned ? 'bg-red-50 text-red-500 border-red-100' : 'bg-primary/5 text-primary border-primary/10'
                        }`}>
                          {c.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold uppercase tracking-tight">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider leading-none mt-1">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[c.status] || statusColors["Active"]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[12px] text-slate-400">language</span>
                           <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">{c.lastIp || "—"}</span>
                         </div>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Joined {c.joinedFormatted}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-black text-slate-900 dark:text-white">{c.orders}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Orders</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-black text-emerald-500 tracking-tight">{c.spent}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">LTV</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white whitespace-nowrap">{c.lastActiveFormatted}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Last Activity</p>
                    </td>
                    <td className="py-4 px-6 relative">
                      <button 
                        onClick={() => setActiveMenuId(isMenuActive ? null : c.id)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {isMenuActive && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-6 top-12 z-50 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 animate-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => { setSelectedCustomerId(c.id); setActiveMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3"
                            >
                              <span className="material-symbols-outlined text-lg">person</span> View Full Profile
                            </button>
                            <button 
                              onClick={() => { setSelectedCustomerId(c.id); setActiveMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3"
                            >
                              <span className="material-symbols-outlined text-lg">history</span> Purchase History
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            {c.isRegistered && (
                              <button 
                                onClick={() => handleBan(c.id, isBanned)}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-3 ${isBanned ? 'text-emerald-500 hover:bg-emerald-50' : 'text-red-500 hover:bg-red-50'}`}
                              >
                                <span className="material-symbols-outlined text-lg">{isBanned ? 'shield_check' : 'block'}</span>
                                {isBanned ? 'Unban User' : 'Ban User Account'}
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(c.id)}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span> Delete Profile
                            </button>
                          </div>
                        </>
                      )}
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
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bulk Actions:</span>
            <button 
              onClick={() => handleDelete(Array.from(selectedIds))}
              disabled={isProcessing === "bulk"}
              className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing === "bulk" ? 'Processing...' : 'Delete Selected'}
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="ml-4 text-xs font-bold text-slate-400 hover:text-white dark:hover:text-slate-900">Cancel</button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-4">
                <div className={`size-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg border ${
                  selectedCustomer.status === 'Banned' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-primary text-white border-primary/10'
                }`}>
                  {selectedCustomer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 font-mono font-bold tracking-widest flex items-center gap-2">
                    ID: {selectedCustomer.id}
                    <button className="hover:text-primary active:scale-90 transition-all" onClick={() => { navigator.clipboard.writeText(selectedCustomer.id); showToast("ID copied", "info"); }}>
                       <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    </button>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomerId(null)} 
                className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-12 custom-scrollbar">
              {/* Profile & Technical Section */}
              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">contact_page</span> Account Identity
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "Email Address", value: selectedCustomer.email, icon: "mail" },
                      { label: "Phone Number", value: selectedCustomer.phone || "No phone recorded", icon: "call" },
                      { label: "Account Status", value: selectedCustomer.status, icon: "shield", 
                        custom: <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[selectedCustomer.status]}`}>{selectedCustomer.status}</span> 
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{item.label}</p>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                          <span className="material-symbols-outlined text-slate-400 text-lg">{item.icon}</span>
                          {item.custom || item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">analytics</span> Technical Analytics
                  </h4>
                  <div className="bg-slate-900 dark:bg-white rounded-[2rem] p-8 text-white dark:text-slate-900 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 dark:border-slate-100 pb-4">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Last IP Address</p>
                          <p className="text-lg font-mono font-black">{selectedCustomer.lastIp || "—"}</p>
                       </div>
                       <span className="material-symbols-outlined text-3xl opacity-20">language</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Joined Date</p>
                          <p className="text-xs font-black">{selectedCustomer.joinedFormatted}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Last Login</p>
                          <p className="text-xs font-black">{selectedCustomer.lastActiveFormatted}</p>
                       </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Commerce & History Section */}
              <div className="space-y-10">
                <section>
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                         <span className="material-symbols-outlined text-sm">history</span> Purchase History
                      </h4>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{selectedCustomer.itemsCount} Total Units</span>
                   </div>
                   
                   <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {selectedCustomer.itemsList.length > 0 ? (
                        selectedCustomer.itemsList.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all">
                              <div className="size-16 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                 {item.image ? (
                                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                 ) : (
                                    <span className="material-symbols-outlined text-slate-300">image</span>
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{item.name}</p>
                                 <div className="flex items-center gap-3 mt-1.5">
                                    <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-[9px] font-black">{item.quantity} UNITS</span>
                                    {item.variant && (
                                       <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                          <div className="size-2 rounded-full shadow-sm" style={{ backgroundColor: typeof item.variant === 'object' ? item.variant.hex : item.variant }} />
                                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{typeof item.variant === 'object' ? item.variant.name : 'Custom'}</span>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="py-20 border-3 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center gap-6 opacity-30 text-center px-10">
                           <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                           <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em]">No commercial logs</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">This customer hasn't made any purchases yet.</p>
                           </div>
                        </div>
                      )}
                   </div>
                </section>

                <section className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">Customer Life-Time Value</p>
                         <p className="text-4xl font-black text-primary mt-2">{selectedCustomer.spent}</p>
                      </div>
                      <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                         <span className="material-symbols-outlined text-white text-3xl">payments</span>
                      </div>
                   </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
               <button 
                 onClick={() => setSelectedCustomerId(null)}
                 className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
               >
                 Close Overview
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
