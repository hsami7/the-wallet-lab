"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { flyToCart } from "@/utils/animations";
import { trackEvent } from "@/components/analytics/TrackingProvider";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/utils/translations";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "name-asc";

function ShopContent({ products }: { products: any[] }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Derive unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
    return cats.sort();
  }, [products]);

  const { language } = useLanguage();
  const t = translations[language]?.shop || translations['en'].shop;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Sync state with URL params
  useEffect(() => {
    const catParam = searchParams.get("category");
    const sortParam = searchParams.get("sort") as SortOption;

    if (catParam) {
      // Check if it's a valid category
      if (categories.includes(catParam) || catParam === "All") {
        setActiveCategory(catParam);
      }
    } else {
      setActiveCategory("All");
    }

    if (sortParam && ["featured", "price-asc", "price-desc", "newest", "name-asc"].includes(sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams, categories]);

  // Handle URL updates when filtering locally
  const updateParams = (cat: string, sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }

    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const sortLabels: Record<SortOption, string> = {
    featured: t.featured || "Featured",
    "price-asc": t.priceLow || "Price: Low to High",
    "price-desc": t.priceHigh || "Price: High to Low",
    newest: t.newest || "Newest",
    "name-asc": "Name A–Z",
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case "featured":
        result = result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "price-asc":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name-asc":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

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

    trackEvent("add_to_cart", { 
      product_id: product.id, 
      product_name: product.name, 
      price: product.price,
      source: "shop_grid"
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
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-0 pb-24 w-full">
      <div className="mb-12 mt-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-primary/60">
          {t.title || "THREADED EXPERIMENTS"}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
          Wearable art crafted with surgical precision. Elevate your style with intricate, meticulously calculated embroidery.
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-primary/10 pb-8">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All pill */}
          <button
            onClick={() => updateParams("All", sortBy)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeCategory === "All"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 hover:bg-primary/20"
              }`}
          >
            {t.all || "All"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams(cat, sortBy)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeCategory === cat
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 hover:bg-primary/20"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & count */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-slate-500">
            {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""}
          </p>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-primary/20 rounded-xl text-sm font-medium hover:border-primary transition-all"
            >
              {t.sortBy || "Sort"}: {sortLabels[sortBy]}
              <span className={`material-symbols-outlined text-sm transition-transform ${sortOpen ? "rotate-180" : ""}`}>
                keyboard_arrow_down
              </span>
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => { updateParams(activeCategory, value); setSortOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${sortBy === value
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {sortOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAndSorted.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">inventory_2</span>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t.noProducts || 'No products in this category yet.'}</p>
          </div>
        ) : (
          filteredAndSorted.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300"
            >
              <div className={`relative aspect-square overflow-hidden ${product.is_wide ? 'p-3 bg-slate-200/5 dark:bg-white/5 border border-slate-200/50 dark:border-primary/10 rounded-lg' : 'bg-slate-200/5 dark:bg-white/5'} flex items-center justify-center`}>
                <Image
                  alt={`${product.name} - Premium Embroidery Art`}
                  className={`${product.is_wide ? 'object-contain' : 'object-cover'} group-hover:scale-110 transition-transform duration-500`}
                  src={product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.track_inventory && product.inventory_count <= 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase shadow-lg shadow-red-500/30">Sold Out</span>
                  </div>
                )}

                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url || "https://placehold.co/600x600/1e293b/ffffff?text=No+Image",
                      slug: product.slug,
                      category: product.category,
                    });
                    trackEvent("wishlist_add", { product_id: product.id, product_name: product.name });
                  }}
                  className={`absolute bottom-4 right-4 size-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${isWishlisted(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white hover:bg-red-500"
                    }`}
                  title={isWishlisted(product.id) ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isWishlisted(product.id) ? "'FILL' 1" : "'FILL' 0" }}
                  >favorite</span>
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* 1. Category */}
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">{product.category || "Premium Carry"}</p>
                
                {/* 2. Name */}
                <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
                
                {/* 3. Colors */}
                <div className="flex gap-1.5 mb-4 mt-auto">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.slice(0, 4).map((variant: any, idx: number) => {
                      const isDualColor = !!variant.secondaryHex;
                      return (
                        <div
                          key={idx}
                          className="size-3.5 rounded-full border border-white/20 shadow-sm relative overflow-hidden bg-slate-200 dark:bg-slate-700"
                          title={variant.name}
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
                    })
                  ) : (
                    <div className="size-3.5 rounded-full bg-slate-400 border border-white/20" />
                  )}
                  {product.colors && product.colors.length > 4 && (
                    <span className="text-[10px] font-bold text-slate-400">+{product.colors.length - 4}</span>
                  )}
                </div>

                {/* 4. Price */}
                <div className="mb-6">
                  <span className="text-primary font-black text-lg">{product.price.toFixed(2)} <span className="text-[10px]">MAD</span></span>
                </div>



                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`mt-auto w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${addedItems[product.id]
                    ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-[0.98]"
                    : "bg-primary hover:bg-blue-600 text-white shadow-[0_10px_20px_rgba(13,89,242,0.3)]"
                    }`}
                >
                  {addedItems[product.id] ? (
                    <>
                      Item Added <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </>
                  ) : (
                    <>
                      Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </>
                  )}
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Newsletter CTA commented out
      <div className="mt-24 p-8 md:p-16 rounded-[2.5rem] bg-primary relative overflow-hidden border border-white/10 shadow-2xl shadow-primary/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mr-48 -mt-48 rounded-full" />
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
      */}
    </div>
  );
}

export function ShopClient({ products }: { products: any[] }) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 md:px-20 pt-24 pb-24 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    }>
      <ShopContent products={products} />
    </Suspense>
  );
}
