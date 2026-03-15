"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function ProductDetailsClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].color : null
  );

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image",
      description: product.category || "Premium Carry",
      variant: selectedColor || undefined
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-4 md:pt-8 pb-24">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-primary/10">
            <img
              src={product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Add more images if available in schema */}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                {product.category || "Premium Carry"}
              </span>
              {product.track_inventory ? (
                <>
                  {product.inventory_count <= 0 ? (
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Out of Stock
                    </span>
                  ) : product.inventory_count <= (product.min_stock_level || 5) ? (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      In Stock
                    </span>
                  )}
                </>
              ) : (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  In Stock
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} MAD</p>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {product.description || "The pinnacle of engineering and minimalist design. Crafted for those who demand precision and performance in every detail of their carry."}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Select Finish</p>
              <div className="flex gap-4">
                {product.colors.map((variant: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(variant.color)}
                    className={`group relative size-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === variant.color ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <div
                      className="size-7 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: variant.color }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {variant.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-200 dark:border-primary/10 flex flex-col gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.inventory_count <= 0}
              className="w-full py-5 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-400 disabled:shadow-none"
            >
              Add to Laboratory Cart <span className="material-symbols-outlined">add_shopping_cart</span>
            </button>
            <p className="text-center text-xs text-slate-500 font-medium">Free worldwide shipping on orders over 1500 MAD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
