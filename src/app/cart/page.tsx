import Link from "next/link";
import React from "react";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-24 w-full">
      <div className="mb-10 mt-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Your Cart</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">You have 3 premium items reserved in your basket</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-lg size-24 sm:size-32" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGXXMyVcz3JqQ4mmsXdmePgZkxod774lqV3sc31yt05JGq6DNQn1mb3cjtFilkQ7xZ8Hi8R0HvX81F3rY7wLcQlgEGpGTk7zoS6FXWnL1BDCeD61plQmHQJN2ZM_ro07MdDqoX0oITRD4071jHnURYX35swGXJ9bO3vgjwe83EAwyoSDh9mgjmqWuXXFS3GOreOSwe54TOBHw8tQkZerSs_pKh7PIrJBoCF3Cqqc-1vOmNwbfF_rkwuTEEstSPO_VE2rK1a-rHk2U')" }}></div>
            <div className="flex flex-1 flex-col gap-1 w-full">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Slim Leather Wallet</h3>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Midnight Black • Genuine Leather</p>
              <div className="flex justify-between items-end mt-auto">
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="font-bold w-4 text-center">1</span>
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
                <p className="text-xl font-bold text-primary">$45.00</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-lg size-24 sm:size-32" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQ4-rSIrspYYdJoXCsuHsHmPHB5Snl7YBINyvCtdDqV1rMOKxcXG20MHy4McW71aM7y69YJEkEqsJERfHOZdilLr3KEbPi3cPvYGajuBm5N_jCu5Vbd6SUq1p_W8eoGZPDzDt2gW0jj6ggw_E5uNn5aFBmIC_w6k1USH-Wz67_jMY5rsxOJk61-R-lFgHNEpU-TzupzF4MF1xwDsM5X5mFKWd_keT708CKQPuxO640MkzfZ8zDw0WyX-H3eZR4vjn9WpZAVjtc5Bk')" }}></div>
            <div className="flex flex-1 flex-col gap-1 w-full">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Carbon Fiber Cardholder</h3>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Aerospace Grade • RFID Protection</p>
              <div className="flex justify-between items-end mt-auto">
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="font-bold w-4 text-center">2</span>
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
                <p className="text-xl font-bold text-primary">$120.00</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-lg size-24 sm:size-32" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwSGs3-uej0t-8jYC5fQHLn_di15yRKSzwHAJhcy2wSADAMLDxnV5kHaPJ1GCaaZWR6k__zPI6kydWljYsAdwyqm3EFwaA4Mj3NKFTy0smb_n_5dywXqYIA_kgpJSFnqsOp80OlaouG9cClYngXwikXy3uk06c4kKlPT14rbcve0X-3ZRT58LhMjOJc2Tf3zZPay4oByIYjpD8zZvij5TG8kTxbzzRax5Su8nd0Lmg8wHLp5YKeXdYvc5DKQCzvZaG0HMJwGOX5lM')" }}></div>
            <div className="flex flex-1 flex-col gap-1 w-full">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">RFID Blocking Sleeve</h3>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Ultra-thin • Universal Fit</p>
              <div className="flex justify-between items-end mt-auto">
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="font-bold w-4 text-center">1</span>
                  <button className="text-primary hover:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
                <p className="text-xl font-bold text-primary">$15.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">$180.00</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-green-500">FREE</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">$14.40</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-black text-primary">$194.40</span>
              </div>
            </div>

            <div className="relative mb-6">
                <input className="w-full rounded-full border border-slate-200 dark:border-none bg-slate-50 dark:bg-slate-800/50 py-3 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Promo code" type="text"/>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                    Apply
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
