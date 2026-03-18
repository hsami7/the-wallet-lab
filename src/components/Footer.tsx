"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 px-6 lg:px-20 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={180} />
          </Link>
          <p className="text-slate-600 dark:text-slate-500 max-w-xs text-sm leading-relaxed">
            Engineering wearable art through experimental stitching. Every thread calculated, every garment meticulously crafted in our lab.
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
            <Link href="/shop?category=Jackets" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Embroidered Jackets</Link>
            <Link href="/shop?category=Jeans" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Custom Denim</Link>
            <Link href="/shop?sort=newest" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">New Arrivals</Link>
            <Link href="/shop?category=Patches" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Custom Patches</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">The Lab</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/about#process" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Our Process</Link>
            <Link href="/about#gallery" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Lookbook / Gallery</Link>
            <Link href="/about#custom" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Custom Orders</Link>
            <Link href="/about#care" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Garment Care</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Support</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/about#size-guide" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Size Guide</Link>
            <Link href="/about#shipping" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Shipping & Delivery</Link>
            <Link href="/about#returns" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Returns & Exchanges</Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-500 hover:text-primary text-sm transition-colors">Contact Us</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 dark:text-slate-600 text-xs text-center md:text-left">
          © 2026 The embroidery&apos;s Lab. Engineered for those who know better. build by <a href="https://github.com/hsami7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dotted">github.com/hsami7</a>
        </p>
        <div className="flex gap-8 text-xs text-slate-500 dark:text-slate-600">
          <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary">Terms of Service</Link>
          <Link href="#" className="hover:text-primary">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
