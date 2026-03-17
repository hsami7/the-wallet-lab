import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 pt-4 md:pt-8 pb-24 w-full">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 mt-12">
        <div className="flex flex-col gap-6">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm">Established 2012</span>
          <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tight">Modern utility meets timeless soul.</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
            We believe the objects you carry every day should be as functional as they are beautiful. Our journey began with a single goal: to redefine the classic wallet for the modern era.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">Explore Collections</button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
            <img alt="Craftsman working on premium leather" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIuuEZqpcsnfJBVtqxRRlmvoCsOINW7RUZOhUNz5WOjBKGqqIWDC9kBzG-ZiYfu_Jt9MRq87V0Nqn9k-ELNUnm1NkSaSDJm9iBJYfDniHNG_7uha74YnJFXNiHIXboaMZE-OtKB2rfWZbFbXU3Mwjl2eN5lzVenZlSmp_RWyvpi7uys8Vp53rnE5Qwu92s8ugsAzCfTV2tSpjU7N8vYMdn9avPLqERpYYYWQtN3MBy1kB9L10DX57HQrj1Hv3YVRFiOt_nwwMeE4M" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-xl hidden md:block">
            <p className="text-white text-3xl font-bold italic">"Crafted, not manufactured."</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold">The Beginning</h2>
        </div>
        <div className="md:col-span-2 flex flex-col gap-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          <p>
            The Embroidery&apos;s Lab started in a small workshop in Brooklyn. Our founder, a former architect, found himself frustrated with mass-produced embroidery that lacked the precision and soul of architectural design.
          </p>
          <p>
            What started as a personal project to create the "perfect" stitch—one that combined structural integrity with intricate beauty—quickly grew. Friends asked for them, then friends of friends, and soon we were shipping worldwide.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">The Craftsmanship Process</h2>
          <p className="text-slate-600 dark:text-slate-400">Every piece goes through a rigorous 24-step process before it earns the Lab stamp.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img alt="Thread selection process" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">01. Material Selection</h3>
            <p className="text-slate-600 dark:text-slate-400">We source only high-tensile embroidery threads and premium base fabrics from world-renowned mills.</p>
          </div>
          <div className="group">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img alt="Digital digitizing" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">02. Architectural Digitizing</h3>
            <p className="text-slate-600 dark:text-slate-400">Designs are meticulously digitized, treating every stitch path as a structural element for absolute precision.</p>
          </div>
          <div className="group">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img alt="High speed embroidery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=800" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">03. Lab-Tested Finishing</h3>
            <p className="text-slate-600 dark:text-slate-400">Our pieces are hand-finished and stress-tested, ensuring the embroidery remains vibrant for a lifetime.</p>
          </div>
        </div>
      </section>

      <section className="bg-primary/10 rounded-xl p-8 md:p-16 mb-24">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
          <h2 className="text-4xl font-bold">Built for the long haul.</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            We don&apos;t believe in fast fashion. We believe in objects that acquire character over time, engineered with precision to last through every adventure.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">eco</span>
              <span className="font-bold">Sustainable</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">inventory_2</span>
              <span className="font-bold">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">architecture</span>
              <span className="font-bold">Precision Design</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">public</span>
              <span className="font-bold">Global Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-12 mb-24">
        <h2 className="text-3xl font-bold mb-6">Need a custom design?</h2>
        <div className="flex justify-center gap-4">
          <Link href="/shop" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center">Shop Collections</Link>
          <Link href="/contact" className="border border-slate-300 dark:border-slate-700 px-10 py-4 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">Contact the Lab</Link>
        </div>
      </section>
    </div>
  );
}
