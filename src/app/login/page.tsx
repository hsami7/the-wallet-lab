"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 md:px-10 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-[480px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {mode === "signin" ? "Securely access your digital assets" : "Join the inner circle of secure carry"}
          </p>
        </div>

        <div className="flex p-1 mb-8 rounded-full bg-slate-200 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
          <button 
            onClick={() => setMode("signin")}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${mode === "signin" ? "bg-primary text-white shadow-lg" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            Sign In
          </button>
          <button 
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${mode === "signup" ? "bg-primary text-white shadow-lg" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            Sign Up
          </button>
        </div>

        <div className="mb-8">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPEpCY4P1QbZ-91qxDRJRq6JKgFeDYjfxPsgd_a9gx-mfki4EoCwcaD9S8OmrbLzdG7Kgnix_2MgQaFN-35Wc-qRj0Fcov34PfEyGkDX75aK0yTkGyQPLlwtOxaW3MvL94g2K5GgAHYcK-STKHvI854AQ70BOHC5U-mnF4uS3Plv8XtKpiImPwZNf4hcnzL-3HY6i1AY8apeeOxfocn8YJ5cGhZOl1Z2wsh-G5JfUnIpcIFIZLiobr8ysVBHnfBTHu-8o-C2ub6gE"/>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background-light dark:bg-slate-900 px-4 text-slate-500">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500" placeholder="John Doe" type="text"/>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
              <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500" placeholder="name@example.com" type="email"/>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              {mode === "signin" && <a className="text-xs text-primary hover:underline" href="#">Forgot password?</a>}
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
              <input className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500" placeholder="••••••••" type="password"/>
              <button className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" type="button">visibility</button>
            </div>
          </div>
          
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(13,89,242,0.2)] transition-all transform active:scale-[0.98] mt-4" type="button">
            {mode === "signin" ? "Sign In to Your Wallet" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold hover:underline ml-1">
            {mode === "signin" ? "Create an account" : "Sign In"}
          </button>
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500 bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
          AES-256 Bit Encryption Active
        </div>
      </div>
    </div>
  );
}
