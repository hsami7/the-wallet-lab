"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// --- Data ---
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const salesData  = [28000, 34000, 42500, 38000, 45000, 52000, 48000, 55000, 61000, 58000, 63000, 70000];
const ordersData = [310,   390,   480,   420,   510,   590,   545,   625,   690,   660,   715,   790];
const maxSales   = Math.max(...salesData);
const maxOrders  = Math.max(...ordersData);

// Visitor activity — last 7 days
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const visitorData   = [1240, 980, 1530, 1880, 2100, 2450, 1760];
const sessionData   = [890,  730, 1140, 1390, 1580, 1820, 1330];
const maxVisitors   = Math.max(...visitorData);

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
  const supabase = createClient();

  useEffect(() => {
    async function fetchTraffic() {
      const { data: logs } = await supabase.from("traffic_logs").select("utm_source");
      
      if (logs) {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
          const source = log.utm_source || "Direct";
          counts[source] = (counts[source] || 0) + 1;
        });

        const total = logs.length;
        const mapped = Object.entries(counts).map(([name, count]) => ({
          name,
          icon: name === "Direct" ? "link" : 
                name.toLowerCase().includes("insta") ? "photo_camera" :
                name.toLowerCase().includes("tiktok") ? "music_note" :
                name.toLowerCase().includes("face") ? "thumb_up" :
                name.toLowerCase().includes("google") ? "search" :
                name.toLowerCase().includes("wishlist") ? "favorite" : "open_in_new",
          color: name === "Direct" ? "from-slate-500 to-slate-600" :
                 name.toLowerCase().includes("insta") ? "from-pink-500 to-purple-600" :
                 name.toLowerCase().includes("tiktok") ? "from-rose-500 to-pink-600" :
                 name.toLowerCase().includes("wishlist") ? "from-red-500 to-orange-600" : "from-blue-500 to-indigo-600",
          visitors: count,
          share: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
          change: "Real-time"
        })).sort((a, b) => b.visitors - a.visitors);

        setTrafficSources(mapped);
      }
    }

    fetchTraffic();
  }, []);

  const chartData  = activeSeries === "revenue" ? salesData  : ordersData;
  const chartMax   = activeSeries === "revenue" ? maxSales   : maxOrders;
  const chartLabel = activeSeries === "revenue" ? "MAD"      : "orders";

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
          { label: "Total Visitors",   value: "15,210",      change: "+22.4%", up: true,  icon: "group"         },
          { label: "Avg. Order Value", value: "891 MAD",     change: "-2.1%",  up: false, icon: "shopping_bag"  },
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

      {/* ── Sales Trends ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Sales Trends — 2025</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly performance</p>
          </div>
          <div className="flex gap-2">
            {(["revenue", "orders"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeries(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all capitalize ${
                  activeSeries === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {/* Bar chart */}
        <div className="flex items-end gap-2 h-44">
          {chartData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className="w-full rounded-t-md bg-primary/20 hover:bg-primary transition-colors relative"
                style={{ height: `${(val / chartMax) * 100}%` }}
              >
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {activeSeries === "revenue" ? `${(val / 1000).toFixed(0)}k MAD` : `${val} ${chartLabel}`}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Visitor Activity ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Visitor Activity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 7 days — unique visitors vs sessions</p>
        </div>
        <div className="flex items-end gap-3 h-36 mb-3">
          {visitorData.map((visitors, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: `${(visitors / maxVisitors) * 100}%` }}>
                {/* Visitors bar */}
                <div className="flex-1 bg-primary/70 hover:bg-primary rounded-t-sm transition-colors h-full relative">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {visitors.toLocaleString()} visitors
                  </div>
                </div>
                {/* Sessions bar */}
                <div
                  className="flex-1 bg-primary/25 rounded-t-sm"
                  style={{ height: `${(sessionData[i] / visitors) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{days[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary/70 inline-block" /> Unique Visitors</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary/25 inline-block" /> Sessions</span>
        </div>
      </div>

      {/* ── Traffic Sources + Global Reach side-by-side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Traffic Sources</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Where visitors are coming from</p>
          <div className="flex flex-col gap-4">
            {trafficSources.map((src) => (
              <div key={src.name} className="flex items-center gap-3">
                <div className={`size-9 rounded-lg bg-gradient-to-br ${src.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-white text-base">{src.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{src.name}</span>
                    <div className="flex items-center gap-3 text-xs shrink-0 ml-2">
                      <span className="text-green-600 dark:text-green-400 font-medium">{src.change}</span>
                      <span className="text-slate-500 dark:text-slate-400">{src.visitors.toLocaleString()}</span>
                      <span className="font-semibold text-slate-900 dark:text-white w-10 text-right">{src.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${src.color} rounded-full`} style={{ width: `${src.share * 3.15}%` }} />
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
