"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, subtotal, discount, total, applyPromoCode, promoCode } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      setPromoStatus("success");
    } else {
      setPromoStatus("error");
      setTimeout(() => setPromoStatus("idle"), 2000);
    }
  };

  const tax = subtotal * 0.08;
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-0 pb-24 w-full">
      <div className="mb-10 mt-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Your Cart</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {cart.length > 0 
            ? `You have ${cart.length} premium items reserved in your basket` 
            : "Your laboratory basket is currently empty"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="bg-slate-200 dark:bg-slate-800 aspect-square rounded-lg size-24 sm:size-32 overflow-hidden relative border border-slate-200 dark:border-primary/10">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    {item.variant && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="size-3 rounded-full border border-white/20" style={{ backgroundColor: item.variant }}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Selected Finish</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{item.description}</p>
                <div className="flex justify-between items-end mt-auto">
                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-primary hover:opacity-70 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-primary hover:opacity-70 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <p className="text-xl font-bold text-primary">{(item.price * item.quantity).toFixed(2)} MAD</p>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">shopping_cart</span>
              <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
              <Link href="/shop" className="inline-flex bg-primary text-white font-bold px-8 py-3 rounded-full">
                Go to Shop
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{subtotal.toFixed(2)} MAD</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount ({promoCode})</span>
                  <span className="font-medium">-{discount.toFixed(2)} MAD</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-green-500">FREE</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{tax.toFixed(2)} MAD</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-black text-primary">{total.toFixed(2)} MAD</span>
              </div>
            </div>

            <div className="relative mb-6">
                <input 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className={`w-full rounded-full border ${promoStatus === 'error' ? 'border-red-500' : 'border-slate-200'} dark:border-none bg-slate-50 dark:bg-slate-800/50 py-3 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary/20 outline-none`} 
                  placeholder="Promo code" 
                  type="text"
                />
                <button 
                  onClick={handleApplyPromo}
                  disabled={promoStatus === 'success'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    promoStatus === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {promoStatus === 'success' ? 'Applied' : 'Apply'}
                </button>
            </div>
            
            <div className="space-y-4">
              <Link href="/checkout" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30">
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/shop" className="w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-4 rounded-full transition-all">
                Continue Shopping
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <p>Secure SSL encrypted checkout</p>
              </div>
              <div className="flex gap-2 mt-4 justify-center grayscale opacity-60">
                <span className="material-symbols-outlined text-3xl">credit_card</span>
                <span className="material-symbols-outlined text-3xl">payments</span>
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
