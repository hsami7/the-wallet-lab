"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Carbon Fiber Slim Wallet",
      description: "Matte Black / RFID Secure",
      price: 89.0,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL8Ztuusoi-rXsc51XPekSMueIO9nY1bZUDn2_5sYl9OG3eIG87DEta52jHlQB_69m5bS7KwEyQIzQRqU_1YA6Bz6bUTDdYfXHN626TKsy-kQICOH62g7FMLFaInGiEdHyOd2sOaz8M4UNF8dyUgjd_S__zgAEXR8qlkGRSs_W2c01abzYieoynB6mjauv7j7LHgQ-1I-rtbZ7S4_52xdPnMTyrfn6xExpLSyyMBp9GHkEIhL5jXWeZEzuHdoA8wqIbtQKrvAGNcM"
    },
    {
      id: 2,
      name: "Leather Key Organizer",
      description: "Saddle Brown",
      price: 34.0,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0m3cOfC0CqbzU12-wgkJYIjiXPWgvcB7N_h84n-itBfReNjsXPl1_rPh1rHO3zyGWzMPSE7MWUTGukTsmnRn37aZFc4Hsg27cLQ44Lu8leitnPVlDrsG6P_ox1djjBHBwCYj1d19maPVKcJwSkbwHZSZg5dMpO3uScY5CHSfbs8HDACk4liefJmPKGJwyakyLrDg_c-iIeGU85z8DWyegnBEivDsDvIiCblXztLLU0pZ3wW0fw-tbHzavFu7lOQBQfrj0xYHYyo"
    }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-8 md:py-12 w-full">
      <div className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link href="/cart" className="text-slate-500 hover:text-primary transition-colors">Cart</Link>
        <span className="text-slate-400">/</span>
        <Link href="#shipping" className="text-slate-500 hover:text-primary transition-colors">Shipping</Link>
        <span className="text-slate-400">/</span>
        <Link href="#payment" className="text-primary hover:text-primary/80 transition-colors">Payment</Link>
      </div>
      <div className="mb-10">
        <h1 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-slate-500 dark:text-slate-400">Complete your secure transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section id="shipping">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <h2 className="text-xl font-bold">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">First Name</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">Last Name</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Doe" type="text"/>
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold opacity-80">Street Address</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="123 Innovation Drive" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">City</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Fes" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">ZIP Code</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="94103" type="text"/>
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold opacity-80">Phone Number</span>
                <input required className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="+212 600-000000" type="tel"/>
              </label>
            </div>
          </section>

          <section id="payment">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`relative flex items-center gap-5 cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
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
              
              <div 
                className={`relative flex items-center gap-5 cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
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
            </div>
            
            <div className="mt-8">
              {paymentMethod === 'card' ? (
                <div className="p-6 bg-slate-100 dark:bg-slate-900/40 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 border border-slate-200 dark:border-slate-800">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Card Number</span>
                    <div className="relative">
                      <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0000 0000 0000 0000" type="text"/>
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">credit_card</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Expiry Date</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="MM/YY" type="text"/>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">CVC</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="123" type="text"/>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-10 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center gap-4 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-3xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Cash on delivery only</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Pay comfortably in cash when your order arrives at your doorstep.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-8 sticky top-28 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden flex-shrink-0">
                    <img className="h-full w-full object-cover" src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="size-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="size-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} MAD</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-6 border-t border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span>{subtotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Shipping</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Tax (8%)</span>
                <span>{tax.toFixed(2)} MAD</span>
              </div>
            </div>

            <div className="relative mt-6">
                <input className="w-full rounded-full border border-slate-200 dark:border-none bg-white dark:bg-slate-800/50 py-3 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Promo code" type="text"/>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                    Apply
                </button>
            </div>

            <div className="flex justify-between items-center mt-6 mb-8">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">{total.toFixed(2)} MAD</span>
            </div>

            <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">lock</span>
              Complete Purchase
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-4 opacity-40 grayscale">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Secure SSL Encrypted Connection</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
