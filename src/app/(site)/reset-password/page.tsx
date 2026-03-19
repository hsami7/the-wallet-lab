"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { updatePassword } from "@/app/actions/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 md:px-10 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-[480px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            Set New Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Securely update your laboratory access credentials
          </p>
        </div>

        {urlError && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
            {urlError}
          </div>
        )}

        <form action={updatePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">New Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
              <input 
                name="password" 
                required 
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)} 
                className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" 
                type="button"
              >
                {showPassword ? "visibility_off" : "visibility"}
              </button>
            </div>
          </div>
          
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(13,89,242,0.2)] transition-all transform active:scale-[0.98] mt-4" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-16">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Initializing Lab</span>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
