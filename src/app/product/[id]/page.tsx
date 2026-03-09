import React from "react";

export default function ProductDetail() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-24 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-primary/5 group relative">
            <img alt="Main Product Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAMP2Qttxs7Sm0YdkvEXa_oTjJSL1O0zQeASMhIgoYvw3Tyg4hMtjZ-muGdvV12SfK53V0bMvrCpfyIcxqGvY2YAevJzbV8xvSGopkHvckqWTZaGOiHZZ-HGzOaL_NHuRW8vt-XrPb1VZnK6a70qSLOeP1_5F00cUXQPZKobGn8Ups7H2b1YqedhYl4_YlXdeCEk5H3PfiQfVGSJ_AuJh5Id8bH2ANgzV5QPSuSaiThv6l1UwrnZXgt2h9-8PWh67TB-OStI_jhH8"/>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="size-2 rounded-full bg-primary"></div>
              <div className="size-2 rounded-full bg-primary/30"></div>
              <div className="size-2 rounded-full bg-primary/30"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-primary/5 cursor-pointer">
              <img alt="Wallet interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTGuAfUmDk_j2JS6rrLaXjx5p6E9X8d8Jf-bFH8SNxbQWJLpe7_GWYAKj3rSYRyEbvU2gQ_8TUVsEiK7VHonQFdIf6WiADVSXh-iaDuwvkEyj-58yu87F2XlgVJznkPjISLrYQidwS66Ond9u6_ms5n2vqZQOATWjEl8gfnRfgZCe9PStnXB5DHHoG7RaW3ASTV6SL_j_bt_ger_zFHoposFWN3Q3ygpRBRkPfQfL2Ld7_4Bq0DvvUk2lkN8dCsi0wr-aoGYA6Ois"/>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-primary/5 cursor-pointer border-2 border-primary">
              <img alt="Wallet hand feel" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwqIX1JaU0jgVUYCd4BRfft1Mq3f0ZmbtY-jz0hFIveWUO4zHDONyY7WaUoKwtfYzoCEAa1ytGvKtsGiA6q1m9GAesXRA2PYL0-rWbe3cXaxEHYI7D6dbcJnqU11pl2wOgBxaVRX6E1QSa7OMIWWGspCnmKu5CheSny77p1gBPN3kTjiB8mdUSq3sB7jD7slyhBeWIV-YFQ6oIlC_Gz7-tjKu5nEUpwt32-iRpOFxkVgEly4G-1Kx02IVs9CR0ti8GMUwz_qGK6sM"/>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-primary/5 cursor-pointer">
              <img alt="Leather detail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFsmk5IZVj4OMOH72hY_9F8NRh6xgKqYl0oUnV7fpxSiWVsUbTZB7X8u5Je8YHb_VMqsA0q-os5uJ_rZoW8rekDq13ZxDqmLKb3HpfLN9MVn7vsPP_spa79z98P2vyoeI0_3xcTJESwRihtf_RTmYtpKW1QbRL5hq9IcPmsFhWkzrPk-1ab3NLXbHjGM52gs8B3Ppli-Fy2fEovt4SkUXrATgp4gCQBBqa0xWAJV9YPPAim-SJQJwv3Q4ZgJJW4TyL0C_1ySC6fwM"/>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">New Drop</span>
              <div className="flex items-center text-primary">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-xs font-bold ml-1">4.9 (128 Reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-4">Aura Bifold <br/>Wallet</h1>
            <p className="text-3xl font-light text-primary">$120.00</p>
          </div>
          
          <div className="space-y-6 mb-10">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Designed for the digital nomad. The Aura Bifold combines traditional Italian craftsmanship with modern RFID-blocking tech. Slim, sleek, and sustainably sourced.
            </p>
            <div className="flex gap-4 items-center">
              <span className="text-sm font-bold uppercase tracking-wider">Color: Onyx Black</span>
              <div className="flex gap-2">
                <div className="size-6 rounded-full bg-slate-900 border-2 border-primary ring-2 ring-slate-900 ring-offset-2 ring-offset-background-dark"></div>
                <div className="size-6 rounded-full bg-amber-900 border border-slate-700"></div>
                <div className="size-6 rounded-full bg-emerald-900 border border-slate-700"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-2 bg-primary text-white py-5 rounded-xl font-bold text-lg hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">shopping_cart</span>
              Add to Cart
            </button>
            <button className="flex items-center justify-center gap-2 bg-primary/10 text-slate-900 dark:text-slate-100 py-5 rounded-xl font-bold text-lg hover:bg-primary/20 transition-all border border-primary/20">
              <span className="material-symbols-outlined">favorite</span>
              Wishlist
            </button>
          </div>
          
          <div className="border-t border-primary/10 pt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Material Specs</h4>
                <p className="text-sm text-slate-500">100% Vegetable-tanned Italian leather. Non-toxic dyes. Recycled polyester stitching.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Digital Security</h4>
                <p className="text-sm text-slate-500">Integrated RFID-blocking mesh protects your cards from unauthorized scans.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Global Shipping</h4>
                <p className="text-sm text-slate-500">Carbon-neutral shipping worldwide. Free returns within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h3 className="text-4xl font-black mb-2">Community Feedback</h3>
            <p className="text-slate-500">Real talk from our worldwide collective.</p>
          </div>
          <button className="bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
            Write a Review
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/10 flex flex-col h-full">
            <div className="flex gap-1 text-primary mb-4">
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
            </div>
            <p className="text-lg font-medium italic mb-6">"The slim profile is insane. I barely feel it in my front pocket. Quality is unmatched for the price point."</p>
            <div className="mt-auto flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrHbodcIDuxj0JJR0ivFkvxnKLn9-QQj_yuCoqGxoUryq4WkrL224NxqIJAkDyk9HIunclBVphtSvHEnR8d3y4e8XjLZnQzQgAQrs1X393tnazTlI4a3V8lPLAGGrOOb9pUk5h448FOueDR54EyV1SfcZ0Xp55lm3I2C8kke8yBUuIi-4kvSGNJUj2xJn5onf1UAslg7Wd6Mj13L7hHNa1IzQNschgcOrv8xEJmZgHQ7AUYfrhXxMw8gAbbanHwCUpZMNuxQSBm2M"/>
              </div>
              <div>
                <p className="font-bold text-sm">Marcus V.</p>
                <p className="text-xs text-slate-500">Verified Buyer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/10 flex flex-col h-full">
            <div className="flex gap-1 text-primary mb-4">
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
            </div>
            <p className="text-lg font-medium italic mb-6">"Finally a wallet that doesn't look like my dad's. The packaging was top tier too. Major aesthetic vibes."</p>
            <div className="mt-auto flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKOqp0e0mFunNe6UQJR_KUUbqwzEi3ApMvtWiltudEfuje9kTzUZHS_XNXcHRDjBC6JZ5zLd9XEyr136Qmt0N375CBIaZ9tYqyOOiObIzNYhZOSu9oQvYGkWvCrMXdN2xCX0Hwccnvxc3b4-Gk6Vg9ahPnd0FctRIdWZJQd3AgB1D7Y6H4nMa8lE7W0VPj6rS9RmiGy1ZjtjDWzTVJGtErXq128mOwijTdMMahFRW5LwcBLQBFwegATUrepJ4MSSYKGzJl6DE_s5o"/>
              </div>
              <div>
                <p className="font-bold text-sm">Elena K.</p>
                <p className="text-xs text-slate-500">Verified Buyer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/10 flex flex-col h-full">
            <div className="flex gap-1 text-primary mb-4">
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs text-slate-600">star</span>
            </div>
            <p className="text-lg font-medium italic mb-6">"Beautiful leather. Smells great. The card slots are a bit tight at first but they break in nicely."</p>
            <div className="mt-auto flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVjnERT03R5VCrGFjKb7xAPeAxcFMWzGurTQvMWsTt-8IbMd1U3m0anpuirRBNP-3UaUtZ6TBv8pNs0sNhOkLKE81EmZdTSzendNjyq6NXxYWAPZGBkkAj4sOhWyano9IJpimJ0ScNhnKxiOEtYXmZDMi4fcV94wFX4mYga2f6ns-7xQK_PyXIvuVRstKFyiAy0lad74ht-lDvY6tjvvIb91AfjUw85LhzBpG_9i1CENRwx46gYa0lAtsrDjGjb707ZfbcIqvmUIg"/>
              </div>
              <div>
                <p className="font-bold text-sm">Jordan S.</p>
                <p className="text-xs text-slate-500">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
