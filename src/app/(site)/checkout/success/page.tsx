"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <ScrollReveal animation="fade-up">
          <div className="size-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <span className="material-symbols-outlined text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Order Confirmed
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been engineered and is now entering our preparation phase.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-10 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Order Reference</span>
              <span className="text-xs font-mono font-bold text-primary">#{orderId?.slice(0, 8)}</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              A confirmation email is on its way to your inbox.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/shop" 
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Back to the Lab
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
