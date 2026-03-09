import Link from "next/link";
import React from "react";

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-24 w-full">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-primary/60">
          PREMIUM CARRY
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
          Meticulously crafted for the modern minimalist. Engineering precision meets timeless craftsmanship.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-primary/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Material <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Price Range <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-semibold transition-all">
            Color <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
          <div className="h-6 w-px bg-slate-300 dark:bg-primary/20 mx-2 hidden sm:block"></div>
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">All</span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/20 cursor-pointer">Leather</span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/20 cursor-pointer">Carbon</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-slate-500">24 products</p>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-primary/20 rounded-xl text-sm font-medium">
            Sort by: Featured <span className="material-symbols-outlined text-sm">swap_vert</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <Link href="/product/1" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="The Minimalist Bi-fold" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9RvcwGQCpfZW2A2Lwzdw70bSu60gjyRnH5m2tkH9Be9fquxWi6B_pD2pzcqh3WpJNHkJvRX3JLeZoso8NLC6BpFBkRvqF_5golhMzsBEyKu6wmTH53UPN2F6-2KbbaJeiCigxzstZOV3RFCrtgXSZYJw1bJ-OEHPoBHohi71wwvleT3fYBuDHlqfraOscvnHVxtw58Pvl_-FzDdwqJrp9Kg1Z8mdhMhJEev6HleA7O-5dS5jZjCpWlcy0WA6eYkFvacjWyM-6I4A"/>
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase">New Drop</span>
            </div>
            <button className="absolute bottom-4 right-4 size-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">The Apex Slim</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Italian Full-Grain</p>
              </div>
              <span className="text-primary font-bold">89.00 MAD</span>
            </div>
            <div className="flex gap-1">
              <div className="size-3 rounded-full bg-orange-900 border border-white/20"></div>
              <div className="size-3 rounded-full bg-slate-900 border border-white/20"></div>
              <div className="size-3 rounded-full bg-emerald-900 border border-white/20"></div>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>

        <Link href="/product/2" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="Carbon Shield Pro" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFk2GP4Ksj5CqZuw88k-9o5Se8ui9te7LH7hgYIlgmnIZUiTIymyYfxRhqnuDf1Ct75dJszCWn-ORhUjr5SKofdIKHae36thg4qi3MsCoaQ8YUaZtCti1e0I6_-FdJMMDiCqhPXOvy3ClXui-yNaCwEvuac3nn52T7TyB0Komns7kWRdhyXxQ5GjFOlSSyTvEgBXrFsFAiY9Ww9XEMt21gC5kzGusM2S28JVQ3UY3SIi6KhnsHSpFgmEeh071PkQvn9B-K2nuZtRg"/>
            <div className="absolute top-4 right-4">
              <span className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm text-slate-900 dark:text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase">RFID Secure</span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Carbon Shield Pro</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Aero Carbon Fiber</p>
              </div>
              <span className="text-primary font-bold">125.00 MAD</span>
            </div>
            <div className="flex gap-1">
              <div className="size-3 rounded-full bg-zinc-900 border border-white/20"></div>
              <div className="size-3 rounded-full bg-zinc-400 border border-white/20"></div>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>
        
        <Link href="/product/3" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="The Nomad Zip" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGuwKI0RQXWnmcUrDsCHjuW-Zl1HzfEz-H0AiT-uNC_rbuHllYVjLgJe1g3SN53Y4AMuEo-CNtdEmZW07_kr2c-a4LoCGTm2Ul1lPaL02YBARRzw83rlQdEqysjz4VJRsD4YHjx-WzbEr2JgbvkiVQlyh_aLMcZNel1wgPMJI_UI8HRT83-8N92MKVRLlKVSSBSl71a-eoJgO-bFxz_layfyXjTe6YkTObOs5uV3X76umFdPr0AU4czQ8j30B0Ogwp3muEag2wwz0"/>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">The Nomad Zip</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Tumbled Calfskin</p>
              </div>
              <span className="text-primary font-bold">75.00 MAD</span>
            </div>
            <div className="flex gap-1">
              <div className="size-3 rounded-full bg-blue-900 border border-white/20"></div>
              <div className="size-3 rounded-full bg-slate-900 border border-white/20"></div>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>
        <Link href="/product/4" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="Titanium Grid" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA93uVpKRGZkH0YiSu2k7wDhB5q89YsLKZk7Jyjl_sXYU9tBaWP5n3MsP4kBDVKAUCc5U76YfJCQxRRYdJ1HaoKnzNu8zXcOYLGFHg-9baD4x2v285-U0yNUUcoJxDnUGhabRES-gwRWyrCufePYKEkONZ2QNsgm-1NZj0nskhMSj1NKwbvE6-ZKq09Gq_PEgrneMjBppp4Yx-HKu-vQm6a1KGsncMCPHNs5NxcKIDwc6_tg-4TSvzsiybaRIm3RnENvc1aIVkteNQ"/>
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase">Limited Ed.</span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Titanium Grid</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Aerospace Grade</p>
              </div>
              <span className="text-primary font-bold">199.00 MAD</span>
            </div>
            <div className="flex gap-1">
              <div className="size-3 rounded-full bg-slate-400 border border-white/20"></div>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>
        <Link href="/product/5" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="The Passport" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiEZ3j8D55WimJUwcQz4fj5X-CnyK3eMHwm88jgKbKid_Bq1Q5RCWxqimDpvpTTS7hAa5b6SjZ0bwt-n5OLYfYKMOT6tQ7z8l_1KCLSsMILUNyBooOG0YaOWAJwHBicI6tqa5VmsqyBmlCSZdhDzpg_s4YpaFvFpO3LYWkkICjVSdKvcIFXpUIO9jfxMWlLTbHTnVEnmvaF1bO9TR7_PwOpTeTONeuwQwOSIZAgLH_xdIAqt1In8hlf5XwmBQyii5PdTnXEItwcI4"/>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">The Voyager</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Travel Companion</p>
              </div>
              <span className="text-primary font-bold">140.00 MAD</span>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>
        <Link href="/product/6" className="group relative flex flex-col bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img alt="Matrix Card" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Gh_N6WEtN8s0HFeMxVXmVyJ0hj9AQg94Iz316CDYaDi7ewdlhKxha2OdE-4o893dWYC9LkVFcmEUyzcIAxtCKDn3oXSibDh_-U-2Aeyc_vm3KDG-zus3ugRCOiPAvLb6vqFXe8cHvMXApQpyjjGgIF-WCoPngCEHHuihLFT8QcoyawK22uY6klpL_4SrLrQbGGS1q-WHRXj0_LM3eLgO0yy8kjIK17PN5U195OxokX-zZFn_HKqZMh_5s_Tq_-ODD02lPwEIIeY"/>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Matrix Slim</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Technical Fabric</p>
              </div>
              <span className="text-primary font-bold">55.00 MAD</span>
            </div>
            <button className="mt-2 w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
              Add to Cart <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          </div>
        </Link>
      </div>

      <div className="mt-24 p-8 md:p-12 rounded-3xl bg-primary relative overflow-hidden border border-primary/50 shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] -mr-32 -mt-32 rounded-full mix-blend-overlay"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-white">Join the inner circle.</h2>
            <p className="text-white/80 mb-6">Be the first to know about limited drops, engineering insights, and exclusive community events.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all outline-none placeholder:text-white/60" placeholder="Enter your email" type="email"/>
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-slate-50 transition-all" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
