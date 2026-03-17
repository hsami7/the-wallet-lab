"use client";

import { useEffect } from "react";
import { IconMark } from "@/components/IconMark";

export default function Loading() {
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }
    return () => {
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 carbon-pattern opacity-[0.03] dark:opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center gap-12 -mt-20">
        {/* Laboratory Calibration Animation */}
        <div className="relative size-40 flex items-center justify-center">
          {/* Inner Emblem */}
          <IconMark size={140} className="relative z-10" />
          
          {/* External Calibration Rings */}
          <div className="absolute inset-0 border-[3px] border-primary/5 dark:border-primary/10 rounded-full scale-110"></div>
          <div className="absolute inset-0 border-[3px] border-t-primary rounded-full animate-spin scale-110 shadow-[0_0_15px_rgba(13,89,242,0.3)]"></div>
          
          {/* Pulsing Glow */}
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-75 animate-pulse"></div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-widest uppercase">CALIBRATING</h2>
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
            LABORATORY INSTRUMENTS...
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest rounded-lg"
        >
          Reload Protocol
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}
