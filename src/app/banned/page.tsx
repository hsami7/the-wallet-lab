import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function BannedPage() {
  const supabase = await createClient();
  
  // Try to get admin email for contact, or use a default
  // In a real app, you might fetch this from a 'settings' table or env
  const adminEmail = "support@the-wallet-lab.com";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-geist">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-red-500/10 border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-10 animate-in zoom-in-95 duration-500">
        <div className="size-24 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-8 relative">
           <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-20" />
           <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>block</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Access Restricted</h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
          Your account has been suspended due to a violation of our terms of service or suspicious activity detected by our security lab.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Need Help?</p>
           <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
             Contact our administration team at:
           </p>
           <a 
             href={`mailto:${adminEmail}`} 
             className="text-primary hover:underline font-black mt-1 inline-block"
           >
             {adminEmail}
           </a>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
