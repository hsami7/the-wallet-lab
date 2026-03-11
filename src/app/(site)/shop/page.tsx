import Link from "next/link";
import React from "react";
import { createClient } from "@/utils/supabase/server";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Fallback to empty array if error or no data
  const safeProducts = products || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-24 w-full">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-primary/60">
          PREMIUM CARRY
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
          Meticulously crafted for the modern minimalist. Engineering precision meets timeless craftsmanship.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-primary/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Material <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Price Range <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Color <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <div className="h-6 w-px bg-slate-300 dark:bg-primary/20 mx-2 hidden sm:block"></div>
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">All</span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/20 cursor-pointer">Leather</span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/20 cursor-pointer">Carbon</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-slate-500">{safeProducts.length} products</p>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-primary/20 rounded-xl text-sm font-medium">
            Sort by: Featured <span className="material-symbols-outlined text-sm">swap_vert</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {safeProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">No products available at the moment.</p>
          </div>
        ) : (
          safeProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image"}
                />
                {product.status === 'out_of_stock' && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase backdrop-blur-sm">Sold Out</span>
                  </div>
                )}
                {product.status === 'active' && product.inventory_count < 10 && product.inventory_count > 0 && (
                   <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase">Low Stock</span>
                  </div>
                )}
                <button className="absolute bottom-4 right-4 size-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{product.category || "Premium Carry"}</p>
                  </div>
                  <span className="text-primary font-bold">{product.price.toFixed(2)} MAD</span>
                </div>
                {/* Mocking colors until we implement a variations table */}
                <div className="flex gap-1 mb-6">
                  <div className="size-3 rounded-full bg-slate-900 border border-white/20"></div>
                  <div className="size-3 rounded-full bg-slate-400 border border-white/20"></div>
                </div>
                <button className="mt-auto w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
                  Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-24 p-8 md:p-16 rounded-[2.5rem] bg-primary relative overflow-hidden border border-white/10 shadow-2xl shadow-primary/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Join the inner circle.</h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed font-display">Be the first to know about limited drops, engineering insights, and exclusive community events.</p>
          <form className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <div className="flex-1 relative group">
              <input 
                className="w-full px-8 py-4 rounded-2xl bg-primary-dark/20 border-2 border-white/20 text-white focus:outline-none focus:border-white transition-all outline-none placeholder:text-white/40 font-semibold" 
                placeholder="Enter your email" 
                type="email"
              />
            </div>
            <button 
              className="px-10 py-4 bg-white text-primary font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all text-lg whitespace-nowrap" 
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
