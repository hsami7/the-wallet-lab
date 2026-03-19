"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// --- Data ---
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const topSellers = [
  { rank: 1, name: "Carbon Series Pro",  category: "Carbon Fiber", sold: 312, revenue: "265,200 MAD", share: 100 },
  { rank: 2, name: "Classic Cognac",     category: "Leather",      sold: 248, revenue: "161,200 MAD", share: 79  },
  { rank: 3, name: "Titanium Minimalist",category: "Metal",        sold: 189, revenue: "226,800 MAD", share: 61  },
  { rank: 4, name: "Stealth Black Edition",category:"Carbon Fiber",sold: 156, revenue: "148,200 MAD", share: 50  },
];

const countries = [
  { name: "Morocco",        flag: "🇲🇦", visitors: 8920, share: 58.7 },
  { name: "France",         flag: "🇫🇷", visitors: 2340, share: 15.4 },
  { name: "Spain",          flag: "🇪🇸", visitors: 1180, share: 7.8  },
  { name: "UAE",            flag: "🇦🇪", visitors: 890,  share: 5.9  },
  { name: "Canada",         flag: "🇨🇦", visitors: 560,  share: 3.7  },
  { name: "Germany",        flag: "🇩🇪", visitors: 420,  share: 2.8  },
  { name: "United States",  flag: "🇺🇸", visitors: 380,  share: 2.5  },
  { name: "United Kingdom", flag: "🇬🇧", visitors: 310,  share: 2.1  },
  { name: "Other",          flag: "🌍",  visitors: 200,  share: 1.3  },
];

export default function AdminAnalytics() {
  const [activeSeries, setActiveSeries] = useState<"revenue" | "orders">("revenue");
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [topWishlisted, setTopWishlisted] = useState<any[]>([]);
  const [topCarted, setTopCarted] = useState<any[]>([]);
  const [totalCartAdds, setTotalCartAdds] = useState<number>(0);
  
  // Real Data State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(new Array(12).fill(0));
  const [monthlyOrders, setMonthlyOrders] = useState<number[]>(new Array(12).fill(0));
  const [visitorActivity, setVisitorActivity] = useState<number[]>(new Array(7).fill(0));
  const [sessionActivity, setSessionActivity] = useState<number[]>(new Array(7).fill(0));

  // UTM Generator State
  const [utmSource, setUtmSource] = useState("instagram");
  const [utmMedium, setUtmMedium] = useState("social");
  const [utmCampaign, setUtmCampaign] = useState("winter_sale");
  const [utmPath, setUtmPath] = useState("/shop");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://the-wallet-lab.com");
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    async function fetchAnalyticsData() {
      // 1. Fetch Orders for 2026 Trends
      const start2026 = "2026-01-01T00:00:00Z";
      const end2026 = "2026-12-31T23:59:59Z";
      
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .gte("created_at", start2026)
        .lte("created_at", end2026);
      
      if (orders) {
        const rev = new Array(12).fill(0);
        const ord = new Array(12).fill(0);
        
        orders.forEach(o => {
          const date = new Date(o.created_at);
          const month = date.getUTCMonth();
          rev[month] += Number(o.total_amount);
          ord[month] += 1;
        });
        
        setMonthlyRevenue(rev);
        setMonthlyOrders(ord);
      }

      // 2. Fetch Traffic Logs for Last 7 Days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
      sevenDaysAgo.setUTCHours(0, 0, 0, 0);
      
      const { data: traffic } = await supabase
        .from("traffic_logs")
        .select("created_at, session_id, event_type")
        .gte("created_at", sevenDaysAgo.toISOString());
      
      if (traffic) {
        const vAct = new Array(7).fill(0);
        const sAct = new Array(7).fill(0);
        
        // Map day indexes to relative days (0 to 6)
        const dayMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(sevenDaysAgo);
          d.setUTCDate(sevenDaysAgo.getUTCDate() + i);
          dayMap[d.getUTCDay()] = i;
        }

        const sessionsByDay: Record<number, Set<string>> = {};
        
        traffic.forEach(t => {
          const date = new Date(t.created_at);
          const dayOfWeek = date.getUTCDay();
          const index = dayMap[dayOfWeek];
          
          if (index !== undefined) {
            // Count all page views for sessions
            if (t.event_type === "page_view") {
              sAct[index] += 1;
            }
            
            // Count unique sessions for visitors
            if (!sessionsByDay[index]) sessionsByDay[index] = new Set();
            sessionsByDay[index].add(t.session_id);
          }
        });

        for (let i = 0; i < 7; i++) {
          vAct[i] = sessionsByDay[i]?.size || 0;
        }
        
        setVisitorActivity(vAct);
        setSessionActivity(sAct);
      }

      // 3. Fetch Overall Traffic Stats (Existing Logic)
      const { data: logs } = await supabase.from("traffic_logs")
        .select("utm_source, metadata")
        .eq("event_type", "page_view");
      
      if (logs) {
        setTotalVisitors(logs.length);
        const counts: Record<string, number> = {};
        const total = logs.length;

        logs.forEach(log => {
          let source = log.utm_source || "Direct";
          if (source === "wishlist_share" && (log.metadata as any)?.ref_user) {
            source = `Wishlist (Ref: ${(log.metadata as any).ref_user.slice(0, 5)})`;
          } else if (source === "wishlist_share") {
            source = "Wishlist Share";
          }
          counts[source] = (counts[source] || 0) + 1;
        });

        const mapped = Object.entries(counts).map(([name, count]) => {
          const isWishlist = name.toLowerCase().includes("wishlist");
          const isInsta = name.toLowerCase().includes("insta") || name.toLowerCase().includes("instagram");
          const isTiktok = name.toLowerCase().includes("tiktok");
          
          return {
            name,
            icon: name === "Direct" ? "link" : isInsta ? "photo_camera" : isTiktok ? "music_note" : isWishlist ? "favorite" : "open_in_new",
            color: name === "Direct" ? "from-slate-500 to-slate-600" : isInsta ? "from-pink-500 to-purple-600" : isTiktok ? "from-rose-500 to-pink-600" : isWishlist ? "from-red-500 to-orange-600" : "from-blue-500 to-indigo-600",
            visitors: count,
            share: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
            change: "Live"
          };
        }).sort((a, b) => b.visitors - a.visitors);

        setTrafficSources(mapped);
      }

      // 4. Fetch Wishlist Trends
      const { data: wishlistEvents } = await supabase.from("traffic_logs")
        .select("metadata")
        .eq("event_type", "wishlist_add");
      
      if (wishlistEvents) {
        const counts: Record<string, number> = {};
        wishlistEvents.forEach(e => {
          const id = (e.metadata as any)?.product_id;
          if (id) counts[id] = (counts[id] || 0) + 1;
        });
        
        const topIds = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id]) => id);
          
        if (topIds.length > 0) {
          const { data: products } = await supabase
            .from("products")
            .select("id, name, image_url, category")
            .in("id", topIds);
            
          if (products) {
            setTopWishlisted(topIds.map(id => {
              const p = products.find(prod => String(prod.id) === String(id));
              return {
                id,
                name: p?.name || "Archived Product",
                image: p?.image_url,
                category: p?.category,
                count: counts[id]
              };
            }).filter(Boolean));
          }
        }
      }

      // 5. Fetch Cart Interest
      const { data: cartEvents } = await supabase.from("traffic_logs")
        .select("metadata")
        .eq("event_type", "add_to_cart");
      
      if (cartEvents) {
        setTotalCartAdds(cartEvents.length);
        const counts: Record<string, number> = {};
        cartEvents.forEach(e => {
          const id = (e.metadata as any)?.product_id;
          if (id) counts[id] = (counts[id] || 0) + 1;
        });
        
        const topIds = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id]) => id);
          
        if (topIds.length > 0) {
          const { data: products } = await supabase
            .from("products")
            .select("id, name, image_url, category")
            .in("id", topIds);
            
          if (products) {
            setTopCarted(topIds.map(id => {
              const p = products.find(prod => String(prod.id) === String(id));
              return {
                id,
                name: p?.name || "Archived Product",
                image: p?.image_url,
                category: p?.category,
                count: counts[id]
              };
            }).filter(Boolean));
          }
        }
      }
    }

    fetchAnalyticsData();
  }, []);

  const chartData  = activeSeries === "revenue" ? monthlyRevenue : monthlyOrders;
  const chartMax   = Math.max(...chartData, 10);
  const chartLabel = activeSeries === "revenue" ? "MAD" : "orders";

  const maxVisitors = Math.max(...visitorActivity, ...sessionActivity, 10);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Sales trends, visitor activity, traffic sources, and global reach.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue",    value: "630,400 MAD", change: "+18.3%", up: true,  icon: "payments"      },
          { label: "Total Orders",     value: "1,284",       change: "+12.1%", up: true,  icon: "receipt_long"  },
          { label: "Total Visitors",   value: totalVisitors.toLocaleString(), change: "Live", up: true,  icon: "group"         },
          { label: "Cart Interest",    value: `${totalCartAdds}`, change: "Live", up: true,  icon: "add_shopping_cart" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.up ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {s.change}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Sales Trends — 2026 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Sales Trends — 2026</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tight">Monthly performance</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveSeries("revenue")}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                  activeSeries === "revenue" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                Revenue
              </button>
              <button 
                onClick={() => setActiveSeries("orders")}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                  activeSeries === "orders" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                Orders
              </button>
            </div>
          </div>
          
          <div className="relative h-64 w-full mt-4 flex flex-col justify-between">
             <div className="flex-1 relative">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1100 100">
                 <path 
                   d="M0,80 L100,70 L200,85 L300,50 L400,60 L500,40 L600,55 L700,30 L800,45 L900,15 L1000,20 L1100,5" 
                   fill="none" 
                   stroke="#8b5cf6" 
                   strokeLinecap="round" 
                   strokeWidth="4"
                   className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                 />
               </svg>
             </div>
             <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter overflow-hidden shrink-0">
                {months.map(m => <span key={m}>{m}</span>)}
             </div>
          </div>
        </div>

        {/* Visitor Activity Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Visitor Activity</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tight">Last 7 days — unique visitors vs sessions</p>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64 w-full mt-4 px-2 gap-4 flex-1">
             {visitorActivity.map((visitors: number, i: number) => (
               <div key={days[i]} className="flex flex-col items-center w-full h-full justify-end gap-3">
                 <div className="flex items-end gap-1.5 h-full w-full justify-center">
                    <div className="w-1.5 sm:w-2.5 rounded-t-sm bg-[#8b5cf6]/30 transition-all duration-700" style={{ height: `${(sessionActivity[i] / maxVisitors) * 100}%` }} />
                    <div className="w-1.5 sm:w-2.5 rounded-t-sm bg-[#8b5cf6] transition-all duration-700" style={{ height: `${(visitors / maxVisitors) * 100}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{days[i]}</span>
               </div>
             ))}
          </div>
          
          <div className="flex gap-6 mt-4 pt-4 border-t border-t-slate-100 dark:border-t-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]/30" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grids side-by-side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Traffic Sources</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Where visitors are coming from</p>
          <div className="flex flex-col gap-4">
            {trafficSources.slice(0, 5).map((src) => (
              <div key={src.name} className="flex items-center gap-3">
                <div className={`size-9 rounded-lg bg-gradient-to-br ${src.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-white text-base">{src.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">{src.name}</span>
                    <div className="flex items-center gap-3 text-xs shrink-0 ml-2">
                      <span className="text-slate-500 dark:text-slate-400">{src.visitors}</span>
                      <span className="font-semibold text-slate-900 dark:text-white w-10 text-right">{src.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${src.color} rounded-full`} style={{ width: `${src.share}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Reach */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Global Reach</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Top countries by visitor count</p>
          <div className="flex flex-col gap-3">
            {countries.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xl w-7 shrink-0">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
                    <div className="flex items-center gap-3 text-xs shrink-0 ml-2">
                       <span className="text-slate-500 dark:text-slate-400">{c.visitors.toLocaleString()}</span>
                       <span className="font-semibold text-slate-900 dark:text-white w-10 text-right">{c.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-primary" : "bg-primary/40"}`}
                      style={{ width: `${c.share * 1.7}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wishlist Trends */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Wishlist Trends</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Products in customer wishlists (Desire)</p>
          <div className="flex flex-col gap-3">
            {topWishlisted.length > 0 ? topWishlisted.map((item, i) => (
              <div key={item.id || item.name} className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 shrink-0 min-w-0">
                  <div className="relative size-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    {item.image ? (
                      <img src={item.image} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300">image</span>
                    )}
                    <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-lg shadow-sm">
                      #{i+1}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2 leading-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-60 mt-0.5">{item.category || 'Laboratory Item'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pr-2">
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{item.count}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter hidden sm:inline">Saves</span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-400 text-xs italic">
                No wishlist data yet.
              </div>
            )}
          </div>
        </div>

        {/* Cart Trends */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Cart Trends</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Products in shopping carts (Intent)</p>
          <div className="flex flex-col gap-3">
            {topCarted.length > 0 ? topCarted.map((item, i) => (
              <div key={item.id || item.name} className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 group hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-3 shrink-0 min-w-0">
                  <div className="relative size-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    {item.image ? (
                      <img src={item.image} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300">image</span>
                    )}
                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-lg shadow-sm">
                      #{i+1}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2 leading-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-60 mt-0.5">{item.category || 'Laboratory Item'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pr-2">
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">{item.count}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter hidden sm:inline">Adds</span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-400 text-xs italic">
                No cart data captured yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── UTM Link Generator (NEW) ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-primary/20 p-6 mb-6 shadow-xl shadow-primary/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">link</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">UTM Link Generator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create tracked links for your ads & social media</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Target Page</label>
            <select 
              value={utmPath}
              onChange={(e) => setUtmPath(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
            >
              <option value="/">Home Page</option>
              <option value="/shop">Shop All</option>
              <option value="/wishlist">Wishlist</option>
              {/* You can add more specific product pages here if needed */}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Platform (Source)</label>
            <select 
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Placement (Medium)</label>
            <select 
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
            >
              <option value="social">Social Post</option>
              <option value="ad">Paid Ad</option>
              <option value="chat">Direct Chat (WhatsApp/DM)</option>
              <option value="bio">Profile Link (Bio)</option>
              <option value="story">Story Link</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Campaign Name</label>
            <input 
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="e.g. winter_sale"
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group">
          <div className="flex-1 min-w-0 w-full overflow-hidden">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Generated Tracking Link:</p>
            <code className="text-primary dark:text-primary-foreground/90 font-mono text-sm break-all">
              {origin}
              {utmPath}?utm_source={utmSource}&utm_medium={utmMedium}&utm_campaign={utmCampaign}
            </code>
          </div>
          <button
            onClick={() => {
              const url = `${origin}${utmPath}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">{copied ? "done" : "content_copy"}</span>
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* ── Top Products by Revenue ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Top Products by Revenue</h2>
        <div className="flex flex-col gap-5">
          {topSellers.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-5 ${
                    p.rank === 1 ? "text-yellow-500" : p.rank === 2 ? "text-slate-400" : p.rank === 3 ? "text-orange-400" : "text-slate-500"
                  }`}>#{p.rank}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">({p.category})</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{p.sold} sold</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{p.revenue}</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${p.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
