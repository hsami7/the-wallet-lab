"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string | number>>(new Set());

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      description: item.category || "Premium Carry",
    });
    // Show brief "Added!" feedback without removing from wishlist
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
    // Generate a trackable URL
    const baseUrl = window.location.origin + window.location.pathname;
    const sid = sessionStorage.getItem("tracking_session_id") || "anon";
    const shareUrl = `${baseUrl}?utm_source=wishlist_share&utm_medium=social&utm_campaign=personal_wishlist&ref_user=${sid}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link to share your wishlist:", shareUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-10 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Wishlist</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Wishlist
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {wishlist.length === 0
              ? "Your wishlist is empty"
              : `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 hover:border-red-400 hover:text-red-500 transition-all"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-24 rounded-3xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-primary/40">favorite</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3">Nothing here yet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8">
            Save your favourite pieces and come back to them anytime. Hit the heart on any product to add it here.
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
      {wishlist.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-[#1a2234] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  <Link href={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 size-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title="Remove from wishlist"
                  >
                    <span className="material-symbols-outlined text-red-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                    {item.category || "Premium Carry"}
                  </p>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-2 mb-3">
                      {item.name}
                    </h3>
                  </Link>
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
                      className="size-10 flex items-center justify-center rounded-xl border-2 border-slate-100 dark:border-white/10 hover:border-primary hover:text-primary transition-all"
                      title="View product"
                    >
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Wishlist */}
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
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${copied
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
        </>
      )}
    </div>
  );
}
