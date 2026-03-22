"use client";

import React, { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getOrderTracking } from "@/app/actions/tracking";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTrackingData(null);

    const result = await getOrderTracking(orderId, email);

    if (result.success) {
      setTrackingData(result.order);
    } else {
      setError(result.error || "Failed to find order.");
    }

    setLoading(false);
  };

  const getStatusStep = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = trackingData ? getStatusStep(trackingData.status) : 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      <ScrollReveal animation="fade-up" className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 relative inline-block">
          Track Your Order
          <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-primary"></div>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mt-8 font-medium">
          Enter your order number and email address below to see the current status of your laboratory piece.
        </p>
      </ScrollReveal>

      {!trackingData ? (
        <ScrollReveal animation="fade-up" delay={200} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-500/20">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs uppercase font-bold text-slate-400 tracking-widest pl-2 mb-2 block">Order Number</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 123e4567..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                value={orderId}
                onChange={e => setOrderId(e.target.value.trim())}
              />
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-slate-400 tracking-widest pl-2 mb-2 block">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                value={email}
                onChange={e => setEmail(e.target.value.trim())}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Track Order <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>
        </ScrollReveal>
      ) : (
        <ScrollReveal animation="fade-up" className="space-y-8">
           <button 
            onClick={() => setTrackingData(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-wider mb-8"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span> Track Another Order
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">Order Summary</p>
                <p className="text-lg font-mono font-bold">#{trackingData.id.split('-')[0].toUpperCase()}</p>
                <p className="text-sm text-slate-500 mt-1">Placed on {new Date(trackingData.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">Status</p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider backdrop-blur-sm">
                  {trackingData.status}
                </div>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="relative mb-16 px-4 md:px-8">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 hidden md:block rounded-full"></div>
              {currentStep > 0 && (
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 hidden md:block rounded-full transition-all duration-1000"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                {[
                  { step: 1, label: 'Order Placed', icon: 'receipt_long' },
                  { step: 2, label: 'Processing', icon: 'precision_manufacturing' },
                  { step: 3, label: 'Shipped', icon: 'local_shipping' },
                  { step: 4, label: 'Delivered', icon: 'home' }
                ].map((item, index) => (
                  <div key={index} className="flex md:flex-col items-center gap-4 md:gap-3 group">
                    <div className={`size-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                      currentStep >= item.step 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div className="md:text-center md:absolute md:top-16 md:left-1/2 md:-translate-x-1/2 md:w-32">
                      <p className={`text-sm font-bold uppercase tracking-wider ${currentStep >= item.step ? 'text-primary' : 'text-slate-400'}`}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prepped for Future Delivery API Integration */}
            {(trackingData.tracking_number || trackingData.carrier) && (
               <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 mb-12 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined">api</span>
                     Delivery Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {trackingData.carrier && (
                        <div>
                           <p className="text-xs text-slate-400 mb-1">Carrier</p>
                           <p className="font-bold">{trackingData.carrier}</p>
                        </div>
                     )}
                     {trackingData.tracking_number && (
                        <div>
                           <p className="text-xs text-slate-400 mb-1">Tracking Number</p>
                           <p className="font-mono font-bold bg-white dark:bg-slate-900 inline-block px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 select-all cursor-pointer">
                              {trackingData.tracking_number}
                           </p>
                        </div>
                     )}
                  </div>
                  <p className="text-xs text-slate-400 mt-4 italic">* Additional real-time delivery tracking powered by external partners will appear here.</p>
               </div>
            )}

            {/* Notification History */}
            {trackingData.notification_history && trackingData.notification_history.length > 0 && (
               <div className="mb-12">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Laboratory Logs</h3>
                  <div className="space-y-4">
                     {trackingData.notification_history.map((log: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                           <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary text-sm">history</span>
                           </div>
                           <div>
                              <p className="text-sm text-slate-600 dark:text-slate-300">{log.message}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">
                                 {new Date(log.timestamp).toLocaleString()}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Items Summary */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Items in Order</h3>
              <div className="space-y-4">
                {trackingData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <img src={item.image_url} alt={item.name} className="size-16 object-cover rounded-xl" />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
