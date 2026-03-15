"use client";

import React from "react";

export default function Loading() {
  React.useEffect(() => {
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
    <div className="flex min-h-[80vh] flex-col items-center justify-start bg-[#0F172A] relative overflow-hidden pt-48 pb-20">
      <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Laboratory Animation */}
        <div className="relative size-32">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-2 border-primary/40 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl animate-bounce">biotech</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">CALIBRATING</h2>
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
            LABORATORY INSTRUMENTS...
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest rounded-lg"
        >
          Reload Protocol
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}
