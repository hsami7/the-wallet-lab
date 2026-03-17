"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Product {
  id: string;
  name: string;
  image_url: string;
  colors: any[];
}

export function ProductSelector({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url, colors")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-white/10">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select from Products</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map(product => {
                const images = Array.from(new Set([
                  product.image_url,
                  ...(product.colors?.map((c: any) => c.imageUrl) || []),
                  ...(product.colors?.map((c: any) => c.image) || [])
                ])).filter(Boolean);
                
                return (
                  <div key={product.id} className="space-y-3 bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary truncate px-1">{product.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => onSelect(url as string)}
                          className="group relative aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-sm"
                        >
                          <img src={url as string} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" loading="lazy" />
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-primary px-2 py-1 rounded shadow-lg">Select</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
