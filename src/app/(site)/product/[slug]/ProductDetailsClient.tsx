"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { flyToCart } from "@/utils/animations";
import { trackEvent } from "@/components/analytics/TrackingProvider";
import { submitReview } from "@/app/actions/reviews";

export function ProductDetailsClient({
  product,
  highlights = [],
  shippingRules = [],
  reviews = [],
  reviewStats = { averageRating: 0, totalReviews: 0 },
  relatedProducts = []
}: {
  product: any;
  highlights?: any[];
  shippingRules?: any[];
  reviews?: any[];
  reviewStats?: { averageRating: number, totalReviews: number };
  relatedProducts?: any[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // Check for active free shipping promotions
  const activePromo = shippingRules.find(r => r.active);
  const promoHighlight = activePromo ? {
    id: 'promo-free-delivery',
    title: 'Free Delivery Promotion',
    description: activePromo.min_amount > 0
      ? `Get free standard delivery on all orders over ${activePromo.min_amount} MAD.`
      : activePromo.min_quantity > 0
        ? `Get free standard delivery when you buy ${activePromo.min_quantity} or more items.`
        : 'Free standard delivery is currently active on all orders!',
    icon_name: 'local_shipping'
  } : null;

  const allHighlights = promoHighlight ? [...highlights, promoHighlight] : highlights;

  const [selectedVariant, setSelectedVariant] = useState(product.colors?.[0] || { name: 'Default', hex: '#000000', imageUrl: product.image_url });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    
    setIsSubmittingReview(true);
    const result = await submitReview(product.id, reviewName, reviewRating, reviewComment);
    
    if (result.success) {
      setReviewSuccess(true);
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    }
    setIsSubmittingReview(false);
  };

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
      image: selectedVariant?.imageUrl || selectedVariant?.image || product.image_url || "https://placehold.co/800x800/1e293b/ffffff?text=No+Image",
      description: product.category || "Premium Carry",
      variant: selectedVariant || undefined
    });

    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      source: "product_page"
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

    if (!wishlisted) {
      trackEvent("wishlist_add", { product_id: product.id, product_name: product.name });
    }
  };

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
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
          <div
            className={`${product.is_wide ? 'aspect-[2.4/1] bg-slate-200/5 dark:bg-white/5 p-4 md:p-6' : 'aspect-square bg-slate-200/5 dark:bg-white/5'} rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-primary/10 flex items-center justify-center cursor-zoom-in relative group/zoom`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img
              src={mainImage}
              alt={`${product.name} - Premium Embroidery Art`}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZooming ? "scale(2)" : "scale(1)",
              }}
              className={`${product.is_wide ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'} transition-transform duration-300 ease-out pointer-events-none`}
              loading="lazy"
            />
            {/* Zoom Indicator Hint */}
            <div className="absolute bottom-6 right-6 size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl font-light">zoom_in</span>
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-4">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative size-20 rounded-2xl overflow-hidden border-2 transition-all ${product.is_wide ? 'p-1 bg-slate-200/5 dark:bg-white/5' : ''} ${mainImage === img
                    ? "border-primary ring-4 ring-primary/10"
                    : "border-slate-200 dark:border-white/5 hover:border-primary/50"
                    }`}
                >
                  <img src={img} alt={`${product.name} - Embroidery Detail View ${idx + 1}`} className={`${product.is_wide ? 'w-full h-full object-contain' : 'w-full h-full object-cover'}`} />
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
                        className="relative z-10 size-7 rounded-full border border-white/20 shadow-inner overflow-hidden"
                      >
                        {secondaryHex ? (
                          <>
                            <div className="absolute inset-y-0 left-0 w-[51%]" style={{ backgroundColor: colorHex }} />
                            <div className="absolute inset-y-0 right-0 w-[51%]" style={{ backgroundColor: secondaryHex }} />
                          </>
                        ) : (
                          <div className="absolute inset-0" style={{ backgroundColor: colorHex }} />
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
          {allHighlights && allHighlights.length > 0 && (
            <div className="pt-8 space-y-6">
              {allHighlights.map((h) => (
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

      {/* Frequently Bought Together / Complete the Look */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-800">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Complete Your Collection</h2>
            <p className="text-slate-500">Curated recommendations from the lab to complement your {product.name}.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/product/${rp.slug}`} className="group block">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden aspect-square relative mb-6">
                  <img src={rp.image_url} alt={rp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{rp.category}</p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize truncate">{rp.name}</h3>
                  <p className="font-mono text-slate-500 mt-1">{rp.price.toFixed(2)} MAD</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews */}
      <div className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Reviews List & Stats */}
          <div className="lg:col-span-8">
            <div className="flex items-end gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Laboratory Feedback</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined" style={{ fontVariationSettings: star <= Math.round(reviewStats?.averageRating || 0) ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-xl font-bold">{reviewStats?.averageRating || 0} / 5</p>
                  <p className="text-slate-500 font-medium">({reviewStats?.totalReviews || 0} Reviews)</p>
                </div>
              </div>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((r) => (
                  <div key={r.id} className="pb-8 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">
                          {r.customer_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{r.customer_name}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-widest">Verified Artisan</p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: star <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">rate_review</span>
                <h3 className="text-lg font-bold mb-2">No reviews yet</h3>
                <p className="text-slate-500">Be the first to share your thoughts on the {product.name}.</p>
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[32px] sticky top-32">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Write a Review</h3>
              {reviewSuccess ? (
                <div className="bg-emerald-500/10 text-emerald-600 p-6 rounded-2xl text-center">
                  <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                  <p className="font-bold mb-1">Thank you!</p>
                  <p className="text-sm">Your feedback helps refine the lab.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1 mb-2 block">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-colors ${reviewRating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: reviewRating >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1 mb-2 block">Your Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                      placeholder="Jane Doe"
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1 mb-2 block">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
                      placeholder="What do you think about this piece?"
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
