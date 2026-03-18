"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { flyToCart } from "@/utils/animations";

export function FeaturedProductsClient({ featuredProducts }: { featuredProducts: any[] }) {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (addedItems[product.id]) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image",
      description: product.category || "Premium Carry"
    });

    // Trigger fly to cart animation
    if (e.currentTarget instanceof HTMLElement) {
      flyToCart(e.currentTarget);
    }

    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredProducts && featuredProducts.length > 0 ? (
        featuredProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-all">
            <div className={`overflow-hidden rounded-lg ${product.is_wide ? 'aspect-square p-3 bg-slate-200/5 dark:bg-white/5' : 'aspect-[4/5] bg-slate-200/5 dark:bg-white/5'} border border-slate-200/50 dark:border-primary/10 flex items-center justify-center`}>
              <img
                className={`${product.is_wide ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'} transition-transform duration-500 group-hover:scale-110`}
                alt={`${product.name} - Premium Embroidery Art`}
                src={product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image"}
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col pt-2">
              <div className="flex flex-col gap-1 mb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {product.category || "Premium Carry"}
                </p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {product.name}
                </h4>
              </div>

              <div className="flex gap-1.5 mb-4">
                {product.colors && product.colors.slice(0, 3).map((variant: any, idx: number) => {
                  const isDualColor = !!variant.secondaryHex;
                  return (
                    <div
                      key={idx}
                      className="size-3 rounded-full border border-white/20 shadow-sm relative overflow-hidden bg-slate-200 dark:bg-slate-700"
                    >
                      {isDualColor ? (
                        <>
                          <div
                            className="absolute inset-y-0 left-0 w-[51%] transition-colors duration-300"
                            style={{ backgroundColor: variant.hex }}
                          />
                          <div
                            className="absolute inset-y-0 right-0 w-[51%] transition-colors duration-300"
                            style={{ backgroundColor: variant.secondaryHex }}
                          />
                        </>
                      ) : (
                        <div
                          className="absolute inset-0 transition-colors duration-300"
                          style={{ backgroundColor: variant.hex || variant.color || '#94a3b8' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mb-6">
                <span className="text-xl font-black text-primary">{product.price.toFixed(2)} <span className="text-xs">MAD</span></span>
              </div>

              <button
                onClick={(e) => handleAddToCart(e, product)}
                className={`w-full mt-auto py-4 font-black rounded-2xl transition-all text-sm flex items-center justify-center gap-2 ${addedItems[product.id]
                  ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-[0.98]"
                  : "bg-slate-100 dark:bg-slate-700/50 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white border border-slate-200 dark:border-white/5"
                  }`}
              >
                {addedItems[product.id] ? (
                  <>
                    Item Added <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full py-12 text-center text-slate-500">
          No featured products available.
        </div>
      )}
    </div>
  );
}
