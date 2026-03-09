import Link from "next/link";
import React from "react";

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-24 w-full">
      <div className="flex items-center gap-2 mb-8 text-sm font-medium mt-12">
        <Link href="/cart" className="text-slate-500 hover:text-primary">Cart</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500">Shipping</span>
        <span className="text-slate-400">/</span>
        <span className="text-primary">Payment</span>
      </div>
      <div className="mb-10">
        <h1 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-slate-500 dark:text-slate-400">Complete your secure transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <h2 className="text-xl font-bold">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">First Name</span>
                <input className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">Last Name</span>
                <input className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Doe" type="text"/>
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold opacity-80">Street Address</span>
                <input className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="123 Innovation Drive" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">City</span>
                <input className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="San Francisco" type="text"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">ZIP Code</span>
                <input className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="94103" type="text"/>
              </label>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative flex cursor-pointer rounded-lg border-2 border-primary bg-primary/5 p-4 focus:outline-none">
                <input defaultChecked className="sr-only" name="payment" type="radio" value="card"/>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-bold">Credit Card</span>
                    <span className="mt-1 flex items-center text-xs opacity-60">Visa, Mastercard, Amex</span>
                  </span>
                </span>
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </label>
              
              <label className="relative flex cursor-pointer rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent p-4 focus:outline-none hover:border-slate-400 dark:hover:border-slate-600 transition-all">
                <input className="sr-only" name="payment" type="radio" value="cod"/>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-bold">Cash on Delivery</span>
                    <span className="mt-1 flex items-center text-xs opacity-60">Pay when you receive</span>
                  </span>
                </span>
                <span className="material-symbols-outlined opacity-0">check_circle</span>
              </label>
            </div>
            
            <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold opacity-80">Card Number</span>
                <div className="relative">
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0000 0000 0000 0000" type="text"/>
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">credit_card</span>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold opacity-80">Expiry Date</span>
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="MM/YY" type="text"/>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold opacity-80">CVC</span>
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="123" type="text"/>
                </label>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-8 sticky top-28 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden flex-shrink-0">
                  <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL8Ztuusoi-rXsc51XPekSMueIO9nY1bZUDn2_5sYl9OG3eIG87DEta52jHlQB_69m5bS7KwEyQIzQRqU_1YA6Bz6bUTDdYfXHN626TKsy-kQICOH62g7FMLFaInGiEdHyOd2sOaz8M4UNF8dyUgjd_S__zgAEXR8qlkGRSs_W2c01abzYieoynB6mjauv7j7LHgQ-1I-rtbZ7S4_52xdPnMTyrfn6xExpLSyyMBp9GHkEIhL5jXWeZEzuHdoA8wqIbtQKrvAGNcM"/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Carbon Fiber Slim Wallet</p>
                  <p className="text-xs opacity-60">Matte Black / RFID Secure</p>
                </div>
                <p className="font-bold">$89.00</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden flex-shrink-0">
                  <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS0m3cOfC0CqbzU12-wgkJYIjiXPWgvcB7N_h84n-itBfReNjsXPl1_rPh1rHO3zyGWzMPSE7MWUTGukTsmnRn37aZFc4Hsg27cLQ44Lu8leitnPVlDrsG6P_ox1djjBHBwCYj1d19maPVKcJwSkbwHZSZg5dMpO3uScY5CHSfbs8HDACk4liefJmPKGJwyakyLrDg_c-iIeGU85z8DWyegnBEivDsDvIiCblXztLLU0pZ3wW0fw-tbHzavFu7lOQBQfrj0xYHYyo"/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Leather Key Organizer</p>
                  <p className="text-xs opacity-60">Saddle Brown</p>
                </div>
                <p className="font-bold">$34.00</p>
              </div>
            </div>

            <div className="space-y-3 py-6 border-t border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span>$123.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Shipping</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Tax (8%)</span>
                <span>$9.84</span>
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
              <span className="text-2xl font-bold text-primary">$132.84</span>
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
