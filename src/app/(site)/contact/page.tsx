"use client";

import React from "react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-12 pb-24 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tight mb-6">Contact the Lab.</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Have a question about a custom order? Or perhaps a technical inquiry about our stitching process? Our lead engineers are ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">General Inquiries</span>
              <p className="font-bold">hello@embroideryslab.com</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Custom Lab Orders</span>
              <p className="font-bold">custom@embroideryslab.com</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">The Lab HQ</span>
              <p className="text-sm">123 Lab St, Suite 101<br />Brooklyn, NY 11201</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Laboratory Hours</span>
              <p className="text-sm">Mon — Fri: 09:00 - 18:00 EST</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">photo_camera</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8">Send a Transmission</h2>
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none">
                <option>Custom Order Inquiry</option>
                <option>Product Question</option>
                <option>Shipping / Returns</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
              <textarea 
                rows={5}
                placeholder="How can we help you?" 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button className="bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
