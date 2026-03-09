import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 px-6 lg:px-20 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">layers</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">The Wallet Lab</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-500 max-w-xs text-sm leading-relaxed">
            Redefining how you carry essentials for the digital world. Modern engineering, timeless craftsmanship.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-primary dark:hover:border-primary text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-xl">share</span>
            </Link>
            <Link href="#" className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-primary dark:hover:border-primary text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-xl">play_circle</span>
            </Link>
            <Link href="#" className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-primary dark:hover:border-primary text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Shop</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/shop" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Carbon Series</Link>
            <Link href="/shop" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Leather Pro</Link>
            <Link href="/shop" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Modular Kits</Link>
            <Link href="/shop" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Limited Drops</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Tech</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/about" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Materials</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">RFID Lab</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Sustainability</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Patents</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Support</h4>
          <nav className="flex flex-col gap-3">
            <Link href="#" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Shipping</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Returns</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Warranty</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 dark:text-slate-600 text-xs">© 2024 The Wallet Lab. Engineered for those who know better.</p>
        <div className="flex gap-8 text-xs text-slate-500 dark:text-slate-600">
          <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary">Terms of Service</Link>
          <Link href="#" className="hover:text-primary">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
