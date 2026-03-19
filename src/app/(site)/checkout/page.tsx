"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ScrollReveal } from "@/components/ScrollReveal";
import { createOrder } from "@/app/actions/orders";
import { useToast } from "@/context/ToastContext";
import { updateProfile } from "@/app/actions/profile";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  
  const {
    cart,
    updateQuantity,
    subtotal,
    discount,
    total,
    applyPromoCode,
    promoCode,
    promoError,
    isApplying,
    shippingFee,
    isFreeShipping,
    shippingRates,
    selectedRateId,
    setSelectedRateId,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "" ,
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });

  const syncPhoneWithProfile = async () => {
    const moroccanPhoneRegex = /^[6-7]\d{8}$/;
    if (user && formData.phone && moroccanPhoneRegex.test(formData.phone)) {
      try {
        await updateProfile({ phone: `+212${formData.phone}` });
        showToast("Contact information synchronized with your profile.", "success");
      } catch (err) {
        console.warn("Failed to sync phone with profile:", err);
      }
    }
  };
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    const success = await applyPromoCode(promoInput);
    if (success) {
      setPromoStatus("success");
    } else {
      setPromoStatus("error");
      setTimeout(() => setPromoStatus("idle"), 3000);
    }
  };

  const handleCompletePurchase = async () => {
    const moroccanPhoneRegex = /^[6-7]\d{8}$/;
    const newFieldErrors: Record<string, string> = {};

    // Validate fields individually
    if (!formData.firstName) newFieldErrors.firstName = "First name is required";
    if (!formData.lastName) newFieldErrors.lastName = "Last name is required";
    if (!formData.address) newFieldErrors.address = "Street address is required";
    if (!formData.city) newFieldErrors.city = "City is required";
    if (!formData.zip) newFieldErrors.zip = "ZIP code is required";
    
    if (!formData.phone) {
      newFieldErrors.phone = "Phone number is required";
    } else if (!moroccanPhoneRegex.test(formData.phone)) {
      newFieldErrors.phone = "Please enter a valid Moroccan phone number (9 digits starting with 6 or 7).";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError("Please correct the errors in the delivery information.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      // Sync profile - Always update phone if logged in
      if (user) {
        await updateProfile({
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: `+212${formData.phone}`,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        });

        // Other fields direct sync
        await supabase.from("profiles").update({
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          updated_at: new Date().toISOString(),
        }).eq("id", user.id);
      }

      const result = await createOrder({
        customer_id: user.id,
        total_amount: total,
        shipping_rate_id: selectedRateId,
        shipping_address: { ...formData, phone: `+212${formData.phone}` },
        discount_amount: discount,
        promo_code: promoCode,
        shipping_amount: shippingFee,
        items: cart.map(item => ({
          product_id: item.id.toString(),
          quantity: item.quantity,
          unit_price: item.price,
          variant: item.variant,
        })),
      });

      if (result.success) {
        setIsSuccess(true);
        clearCart();
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        setError(result.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Pre-fill from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        
        if (profile) {
          const names = profile.full_name?.split(" ") || ["", ""];
          setFormData(prev => ({
            ...prev,
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || "",
            email: currentUser.email || "",
            phone: profile.phone ? profile.phone.replace("+212", "").trim() : "",
            address: profile.address || "",
            city: profile.city || "",
            zip: profile.zip || "",
          }));
        } else {
          setFormData(prev => ({ ...prev, email: currentUser.email || "" }));
        }
      }

      setLoading(false);

      if (!loading && cart.length === 0 && !isSubmitting && !isSuccess) {
        // Only redirect if we ARE NOT currently submitting or just finished
        router.push("/shop");
      }
    }
    checkAuth();
  }, [supabase, cart.length, router, loading, isSubmitting]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin border-4 border-primary/30 border-t-primary rounded-full size-12"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-24 text-center">
        <ScrollReveal animation="fade-up">
          <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-4xl">lock</span>
          </div>
          <h1 className="text-3xl font-black mb-4">Sign in to Checkout</h1>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">Please log in to your account to complete your purchase securely and track your order in the lab.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?redirect=/checkout" className="px-10 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              Sign In Now
            </Link>
            <Link href="/cart" className="px-10 py-4 bg-slate-100 dark:bg-slate-800 font-bold rounded-full hover:bg-slate-200 transition-all">
              Back to Cart
            </Link>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-8 md:py-12 w-full">
      <ScrollReveal className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link href="/cart" className="text-slate-500 hover:text-primary transition-colors">Cart</Link>
        <span className="text-slate-400">/</span>
        <button className="text-slate-500 hover:text-primary transition-colors">Delivery</button>
        <span className="text-slate-400">/</span>
        <button className="text-primary hover:text-primary/80 transition-colors">Payment</button>
      </ScrollReveal>
      <ScrollReveal className="mb-10">
        <h1 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-slate-500 dark:text-slate-400">Complete your secure transaction</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Delivery Information */}
          <section id="delivery">
            <ScrollReveal className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <h2 className="text-xl font-bold">Delivery Information</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">First Name</span>
                <input 
                  required 
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: "" }));
                  }}
                  className={`w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`} 
                  placeholder="John" 
                  type="text" 
                />
                {fieldErrors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{fieldErrors.firstName}</p>}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Last Name</span>
                <input 
                  required 
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: "" }));
                  }}
                  className={`w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`} 
                  placeholder="Doe" 
                  type="text" 
                />
                {fieldErrors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{fieldErrors.lastName}</p>}
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Street Address</span>
                <input 
                  required 
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (fieldErrors.address) setFieldErrors(prev => ({ ...prev, address: "" }));
                  }}
                  className={`w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.address ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`} 
                  placeholder="Hay Oued Fes, No 123" 
                  type="text" 
                />
                {fieldErrors.address && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{fieldErrors.address}</p>}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">City</span>
                <input 
                  required 
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: "" }));
                  }}
                  className={`w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`} 
                  placeholder="Fes" 
                  type="text" 
                />
                {fieldErrors.city && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{fieldErrors.city}</p>}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">ZIP Code</span>
                <input 
                  required 
                  value={formData.zip}
                  onChange={(e) => {
                    setFormData({ ...formData, zip: e.target.value });
                    if (fieldErrors.zip) setFieldErrors(prev => ({ ...prev, zip: "" }));
                  }}
                  className={`w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.zip ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`} 
                  placeholder="30000" 
                  type="text" 
                />
                {fieldErrors.zip && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{fieldErrors.zip}</p>}
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Phone Number</span>
                <div className={`flex w-full bg-slate-100 dark:bg-slate-900 border ${fieldErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all`}>
                  <div className="bg-slate-200 dark:bg-slate-800 px-4 flex items-center justify-center text-sm font-bold text-slate-500 border-r border-slate-200 dark:border-slate-700">
                    +212
                  </div>
                  <input 
                    required 
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 9) });
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: "" }));
                    }}
                    className="flex-1 bg-transparent p-4 outline-none text-slate-900 dark:text-white" 
                    placeholder="600000000" 
                    type="tel" 
                    onBlur={syncPhoneWithProfile}
                  />
                </div>
                {fieldErrors.phone && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.phone}</p>}
              </label>

              {user && (
                <label className="flex items-center gap-3 mt-4 md:col-span-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer" 
                  />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Save my information for next time</span>
                </label>
              )}
            </ScrollReveal>
          </section>

          {/* Payment Method */}
          <section id="payment">
            <ScrollReveal className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScrollReveal delay={100}>
                <div
                  className={`relative flex items-center gap-5 cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">credit_card</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">Credit Card</p>
                    <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="absolute top-3 right-3">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div
                  className={`relative flex items-center gap-5 cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">payments</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay when you receive</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="absolute top-3 right-3">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-8">
              {paymentMethod === 'card' ? (
                <ScrollReveal animation="fade-up" className="p-6 bg-slate-100 dark:bg-slate-900/40 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800">
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Card Number</span>
                    <div className="relative">
                      <input required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0000 0000 0000 0000" type="text" />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">credit_card</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Expiry Date</span>
                      <input required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="MM/YY" type="text" />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">CVC</span>
                      <input required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="123" type="text" />
                    </label>
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal animation="fade-up" className="p-10 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-3xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Laboratory Standard Process</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Pay comfortably in cash when your order arrives at your doorstep after meticulous preparation.</p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4">
          <ScrollReveal animation="slide-right" className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 sticky top-28 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h3>

            <div className="space-y-5 mb-8">
              {cart.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/5">
                    <img className="h-full w-full object-cover" src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <p className="font-bold text-sm line-clamp-2 leading-tight flex-1">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity as number) - 1)}
                        className="size-5 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[10px]">remove</span>
                      </button>
                      <span className="text-[10px] font-bold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity as number) + 1)}
                        className="size-5 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[10px]">add</span>
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-xs tabular-nums text-slate-900 dark:text-white">{(item.price * item.quantity).toFixed(2)} MAD</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 py-6 border-t border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">{subtotal.toFixed(2)} MAD</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500">
                  <span className="font-medium">Discount ({promoCode})</span>
                  <span className="font-bold tabular-nums">-{discount.toFixed(2)} MAD</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery</span>
                {isFreeShipping ? (
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
                ) : (
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">{shippingFee.toFixed(2)} MAD</span>
                )}
              </div>

            </div>

            {/* Promo Code Input */}
            <div className="relative mt-8 mb-8">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className={`w-full rounded-xl border-2 ${promoStatus === 'error' ? 'border-red-500/50' : 'border-transparent'} bg-white dark:bg-slate-950/50 py-3.5 pl-4 pr-24 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400`}
                placeholder="HAVE A PROMO CODE?"
                type="text"
              />
              <button
                onClick={handleApplyPromo}
                disabled={promoStatus === 'success' || isApplying}
                className={`absolute right-1.5 top-1.5 rounded-lg px-4 py-2 text-[10px] font-bold transition-all ${promoStatus === 'success'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-primary text-white hover:brightness-110 active:scale-95'
                  }`}
              >
                {isApplying ? (
                  <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
                ) : promoStatus === 'success' ? 'APPLIED' : 'APPLY'}
              </button>
            </div>

            {promoError && promoStatus === 'error' && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-4 animate-in fade-in slide-in-from-top-1">
                {promoError}
              </p>
            )}

            <div className="flex justify-between items-end mb-8 pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-black text-primary">{total.toFixed(2)} MAD</span>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={handleCompletePurchase}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">lock</span>
                  Complete Purchase
                </>
              )}
            </button>

            {error && (
              <p className="mt-4 text-center text-red-500 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-center">Engineered Security Protocol Active</span>
            </div>
          </ScrollReveal>
        </aside>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
          © 2026 The embroidery&apos;s Lab. Engineered for those who know better. build by <a href="https://github.com/hsami7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dotted">github.com/hsami7</a>
        </p>
      </div>
    </div>
  );
}
