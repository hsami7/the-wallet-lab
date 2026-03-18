"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/components/analytics/TrackingProvider";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function WishlistContent() {
  const { wishlist: localWishlist, removeFromWishlist, clearWishlist, addToWishlist } = useWishlist();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [sharedWishlist, setSharedWishlist] = useState<any[]>([]);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string | number>>(new Set());

  // Check for shared wishlist on load
  useEffect(() => {
    const shareId = searchParams.get("s");
    if (shareId) {
      fetchSharedWishlist(shareId);
    }
  }, [searchParams]);

  const fetchSharedWishlist = async (id: string) => {
    setIsLoadingShared(true);
    try {
      const { data: share } = await supabase
        .from("shared_wishlists")
        .select("product_ids")
        .eq("id", id)
        .single();

      if (share && share.product_ids) {
        // Fetch full product details for these IDs
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .in("id", share.product_ids);

        if (products) {
          setSharedWishlist(products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image_url,
            slug: p.slug,
            category: p.category
          })));
          setIsSharedView(true);
        }
      }
    } catch (err) {
      console.error("Shared wishlist error:", err);
    } finally {
      setIsLoadingShared(false);
    }
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    
    trackEvent("add_to_cart", {
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      source: isSharedView ? "shared_wishlist" : "personal_wishlist"
    });

    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  const handleCopyLink = async () => {
    if (localWishlist.length === 0) return;

    // 1. Save to Supabase to get a short ID
    setIsGenerating(true);
    const productIds = localWishlist.map(item => item.id);
    const sid = sessionStorage.getItem("tracking_session_id") || "anon";
    
    const { data: newShare, error } = await supabase
      .from("shared_wishlists")
      .insert({
        product_ids: productIds,
        session_id: sid
      })
      .select("id")
      .single();

    setIsGenerating(false);

    if (error) {
      console.error("Error creating shared wishlist:", error);
      return;
    }

    // 2. Generate short URL
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?s=${newShare.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      
      trackEvent("wishlist_share_created", { share_id: newShare.id });
    } catch {
      window.prompt("Copy this link to share your wishlist:", shareUrl);
    }
  };

  const activeWishlist = isSharedView ? sharedWishlist : localWishlist;
  const count = activeWishlist.length;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-10 pb-32 min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Wishlist</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isSharedView ? "Shared Wishlist" : "Your Wishlist"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isLoadingShared ? "Loading shared items..." : 
             count === 0 ? "Empty wishlist" : 
             `${count} item${count !== 1 ? "s" : ""} ${isSharedView ? "being shared" : "saved"}`}
          </p>
        </div>
        <div className="flex gap-3">
          {!isSharedView && localWishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 hover:border-red-400 hover:text-red-500 transition-all bg-white dark:bg-slate-900"
            >
              <span className="material-symbols-outlined text-base">delete_sweep</span>
              Clear All
            </button>
          )}
          {isSharedView && (
            <>
              <button
                onClick={() => {
                  activeWishlist.forEach(item => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                    });
                  });
                  alert(`${activeWishlist.length} items added to your cart!`);
                  trackEvent("wishlist_bulk_add_to_cart", { count: activeWishlist.length });
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
              >
                <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                Buy Entire Collection
              </button>
              <button
                onClick={() => {
                  setSharedWishlist([]);
                  setIsSharedView(false);
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all bg-white dark:bg-slate-900"
              >
                <span className="material-symbols-outlined text-base">person</span>
                View My List
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State */}
      {count === 0 && !isLoadingShared && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-24 rounded-3xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-primary/40">favorite</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3">Nothing here yet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8 font-medium">
            {isSharedView 
              ? "This shared link doesn't contain any products or they were removed."
              : "Save your favourite pieces and come back to them anytime. Hit the heart on any product to add it here."}
          </p>
          <Link
            href="/shop"
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">storefront</span>
            Browse Collection
          </Link>
        </div>
      )}

      {/* Grid */}
      {count > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {activeWishlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-[#1a2234] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className={`relative aspect-square overflow-hidden ${item.is_wide ? 'bg-slate-200/5 dark:bg-white/5 p-3' : 'bg-slate-200/5 dark:bg-white/5'} flex items-center justify-center`}>
                  <Link href={`/product/${item.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`${item.is_wide ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'} group-hover:scale-105 transition-transform duration-500`}
                    />
                  </Link>
                  {/* Action Icon Top-Right */}
                  {!isSharedView ? (
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        trackEvent("wishlist_remove", { product_id: item.id, product_name: item.name });
                      }}
                      className="absolute top-3 right-3 size-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-red-500"
                      title="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToWishlist(item);
                        trackEvent("wishlist_import", { product_id: item.id, product_name: item.name });
                        alert("Added to your personal wishlist!");
                      }}
                      className="absolute top-3 right-3 size-9 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all text-white"
                      title="Add to my wishlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        favorite
                      </span>
                    </button>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* 1. Category */}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    {item.category || "Premium Carry"}
                  </p>
                  
                  {/* 2. Name */}
                  <Link href={`/product/${item.slug}`} className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors mb-3 flex items-center">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-4">
                    {/* 3. Price */}
                    <p className="text-lg font-black text-slate-900 dark:text-white mb-4">
                      {item.price.toFixed(2)} <span className="text-xs font-bold text-slate-400">MAD</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${addedIds.has(item.id)
                          ? "bg-green-500 text-white"
                          : "bg-primary hover:bg-blue-600 text-white"
                          }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {addedIds.has(item.id) ? "check" : "add_shopping_cart"}
                        </span>
                        {addedIds.has(item.id) ? "Added!" : "Add to Cart"}
                      </button>
                      <Link
                        href={`/product/${item.slug}`}
                        className="size-10 flex items-center justify-center rounded-xl border-2 border-slate-100 dark:border-white/10 hover:border-primary hover:text-primary transition-all bg-white dark:bg-transparent"
                        title="View product"
                      >
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Wishlist */}
          {!isSharedView && (
            <div className="mt-4 p-6 rounded-3xl bg-white dark:bg-[#1a2234] border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">share</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base">Share your Wishlist</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Send your list to friends and family as a hint.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                disabled={isGenerating}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 w-full sm:w-auto justify-center ${copied
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-primary text-white shadow-lg shadow-primary/20 hover:translate-y-[-1px]"
                  }`}
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? "check_circle" : "link"}
                </span>
                {copied ? "Link Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="size-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse text-sm">Loading Wishlist...</p>
      </div>
    }>
      <WishlistContent />
    </Suspense>
  );
}
