"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { flyToCart } from "@/utils/animations";

export function ProductDetailsClient({ product, highlights = [] }: { product: any; highlights?: any[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const [selectedVariant, setSelectedVariant] = useState(product.colors?.[0] || { name: 'Default', hex: '#000000', imageUrl: product.image_url });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [mainImage, setMainImage] = useState(product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image");

  const variantImages = (product.colors || [])
    .map((v: any) => v.imageUrl || v.image)
    .filter(Boolean);

  const allImages = Array.from(new Set([
    product.image_url,
    ...variantImages,
    ...(product.images || [])
  ])).filter(Boolean);

  const handleAddToCart = (e: React.MouseEvent) => {
    if (added) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image",
      description: product.category || "Premium Carry",
      variant: selectedVariant || undefined
    });

    // Trigger fly to cart animation
    if (e.currentTarget instanceof HTMLElement) {
      flyToCart(e.currentTarget);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image",
      slug: product.slug,
      category: product.category,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-4 md:pt-8 pb-24">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-400 capitalize">{product.category}</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-primary/10">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-4">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative size-20 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img
                    ? "border-primary ring-4 ring-primary/10"
                    : "border-slate-200 dark:border-white/5 hover:border-primary/50"
                    }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
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

          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              {product.description}
            </p>
          </div>


          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Select Finish</p>
              <div className="flex gap-4">
                {product.colors.map((variant: any, idx: number) => {
                  const colorHex = variant.hex || variant.color;
                  const secondaryHex = variant.secondaryHex;
                  const isSelected = selectedVariant?.name === variant.name;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariant(variant);
                        if (variant.imageUrl || variant.image) {
                          setMainImage(variant.imageUrl || variant.image);
                        }
                      }}
                      className={`group relative size-10 rounded-full transition-all flex items-center justify-center 
                        ${isSelected 
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-[#070b14]' 
                          : 'hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-[#070b14]'
                        }`}
                    >

                      <div
                        className="relative z-10 size-7 rounded-full border border-white/20 shadow-inner overflow-hidden flex"
                        style={{ backgroundColor: colorHex }}
                      >
                        {secondaryHex ? (
                          <>
                            <div className="w-1/2 h-full" style={{ backgroundColor: colorHex }} />
                            <div className="w-[calc(50%+1px)] h-full -ml-[1px]" style={{ backgroundColor: secondaryHex }} />
                          </>
                        ) : (
                          <div className="size-full" style={{ backgroundColor: colorHex }} />
                        )}
                      </div>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap opacity-0 group-hover:opacity-100 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                        {variant.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={(e) => handleAddToCart(e)}
                disabled={product.inventory_count <= 0}
                className={`flex-1 py-5 font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-400 disabled:shadow-none ${added
                  ? 'bg-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.35)] scale-[0.98]'
                  : 'bg-primary hover:opacity-90 text-white shadow-[0_20px_40px_rgba(13,89,242,0.3)]'
                  }`}
              >
                {added ? (
                  <>
                    Item Added
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </>
                ) : (
                  <>
                    Add to Cart <span className="material-symbols-outlined">add_shopping_cart</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className={`size-[62px] shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${wishlisted
                  ? "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/40 text-red-500 scale-[1.02]"
                  : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  }`}
              >
                <span
                  className="material-symbols-outlined text-[26px] transition-all"
                  style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Wishlist link hint when saved */}
            {wishlisted && (
              <Link
                href="/wishlist"
                className="text-center text-xs font-semibold text-red-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">favorite</span>
                Saved to wishlist — view it
              </Link>
            )}
          </div>

          {/* Product Highlights Section - Relocated & Restyled per Snippet */}
          {highlights && highlights.length > 0 && (
            <div className="pt-8 space-y-6">
              {highlights.map((h) => (
                <div key={h.id} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    {h.icon_name?.trim().startsWith('<svg') ? (
                      <div
                        className="size-6 [&>svg]:size-full [&>svg]:fill-current"
                        dangerouslySetInnerHTML={{ __html: h.icon_name }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[24px]">
                        {h.icon_name || 'verified'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{h.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{h.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
