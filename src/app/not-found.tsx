"use client";

import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] relative overflow-hidden px-6 pt-24 pb-24 transition-colors duration-500">
        {/* Carbon fiber pattern overlay */}
        <div className="absolute inset-0 carbon-pattern opacity-[0.03] dark:opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <h1 className="text-[120px] md:text-[180px] font-black text-slate-300/70 dark:text-white/5 tracking-tighter leading-none select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-black text-primary drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse uppercase tracking-tight">
                Experiment Unavailable
              </span>
            </div>
          </div>

          <p className="max-w-md text-lg text-slate-600 dark:text-slate-400 mb-10 font-medium">
            The requested coordinate does not exist in our current laboratory simulations.
            Please recalibrate your path or return to base.
          </p>

          <div className="w-full max-w-sm relative group mb-12">
            <input
              type="text"
              placeholder="Search laboratory database..."
              className="w-full px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 font-semibold shadow-sm group-hover:shadow-md"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-sm font-bold">search</span>
            </button>
          </div>

          <Link
            href="/shop"
            className="px-10 py-4 bg-primary text-white font-black rounded-full shadow-[0_20px_40px_rgba(13,89,242,0.3)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Return to Laboratory
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-50 dark:opacity-100"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full opacity-50 dark:opacity-100"></div>
      </main>
      <Footer />
    </div>
  );
}
