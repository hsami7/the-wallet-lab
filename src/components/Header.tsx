"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-3xl">layers</span>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">The Wallet Lab</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Shop</Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Technology</Link>
          <Link href="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Manifesto</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700/50">
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 w-32 lg:w-48 outline-none" placeholder="Search tech..." />
        </div>
        <button 
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
        >
          {mounted && resolvedTheme === 'dark' ? (
            <span className="material-symbols-outlined text-xl">light_mode</span>
          ) : mounted ? (
            <span className="material-symbols-outlined text-xl">dark_mode</span>
          ) : (
             <div className="size-5"></div>
          )}
        </button>
        <Link href="/cart" className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white transition-all">
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
        </Link>
        <Link href="/login" className="flex items-center justify-center rounded-full size-10 bg-primary text-slate-100 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-xl">person</span>
        </Link>
      </div>
    </header>
  );
}
