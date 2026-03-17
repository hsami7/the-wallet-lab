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
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-primary/10">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={product.name}
                src={product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image"}
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{product.name}</h4>
                  <p className="text-sm text-slate-500">{product.category || "Premium Carry"}</p>
                </div>
                <span className="text-lg font-bold text-primary">{product.price.toFixed(2)} MAD</span>
              </div>
              <div className="flex gap-1.5">
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
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className={`w-full mt-auto py-3 font-bold rounded-full transition-all text-sm font-display flex items-center justify-center gap-2 ${addedItems[product.id]
                    ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-[0.98]"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white"
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
