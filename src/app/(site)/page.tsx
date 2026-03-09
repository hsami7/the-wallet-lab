import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative px-6 lg:px-20 py-16 lg:py-24 @container">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 flex-1">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New Carbon Drop V.2
            </div>
            <h1 className="text-slate-900 dark:text-slate-100 text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Wallet <span className="text-primary italic">Engineering</span> for the Digital Native
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed">
              Experience the future of carry. Engineered with aerospace-grade carbon fiber and full-grain leather textures. Built for the modern nomad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/25 cursor-pointer">
                Shop Collection
              </Link>
              <Link href="/about" className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer">
                Explore Tech
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-square lg:aspect-auto">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="relative w-full h-[400px] lg:h-[600px] bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 carbon-pattern opacity-40"></div>
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRrn7KxPfgAAMj7QURg3SEuJ5XGj0mvJtzji-lpqKzqFzVPzxQvE3f1JFAZw_ddO943jAoOm5ED99UXFpXLWNnn6jtIPL9guXK_qzm1lom5R96zuOhDwTEnAAUu3noO0RZQsvBhTyDKDwdXq51KKSTHeA_elID1dmkJl5HIjf8emFP2tTehQUlqOmBG9QKNeAZ9u2rmbHGK3OMP0w3PlmXbrUv-67OXRYugJbYslzmkouFscnbgjU8-t9c0l4expr119FpYoIcftc')" }}
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/80 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">Premium Edition</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Carbon-X Phantom</h3>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">129 MAD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">The Lab Selection</h2>
              <p className="text-slate-500 dark:text-slate-400">Precision machined for maximum utility.</p>
            </div>
            <Link href="/shop" className="text-primary font-bold flex items-center gap-2 hover:underline">
              View All Series <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-all">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Minimalist slim black leather wallet" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5eNMB_FZkN6IP_lWAjqB9_O0cUe2AFlijwqg44--YQlC3ENO5JUU1YxxUlmMa4hfyt0OWuMJzK-VqP1I8TQQGCu70ENiu_ODwBkrRWmkloyekzbGR1nr_8symDkfwK5J2MSrC6tPAFhqgVchIZAA8NjhJY6WF6SEWKdKUuhdlSHppEhsQZu5zWp6Hj0T1kgIt_vPIbRgk7LoOr4KZi_a_3m_sEaMb3IZ7A-L4yiP4aqgZt8H0wEWnOubZhudKXTI1b-kDY1C78wA" 
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Leather Pro Slim</h4>
                    <p className="text-sm text-slate-500">Italian Full Grain</p>
                  </div>
                  <span className="text-lg font-bold text-primary">85 MAD</span>
                </div>
                <button className="w-full mt-auto py-3 bg-slate-100 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white font-bold rounded-full transition-colors text-sm font-display">
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="group flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-all">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Carbon fiber tactical minimalist wallet" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeaf7xc7bH7Lo5Ex5WOPItgR1KIQqspXLmr15oc7QNTjtL7L09EbnHt1_iCjWjDjHDyWzCsZH-15k9OhHJ_LPUOAZqkZFRFq4A5FkXBTRGlV1iinbt7m8SPHMidigX0RAxbk7fBBNDQsSz80BdKdgQCo6pMu6VCqSWiVi2NE2RD_-PiHS8wO_ov-OYnmKrcFZU_IGqmeNWmUvAKbobpONKk_qpmf6QXidK2lSb2iwimvKcaZTXY7UQ4LTLTQ7GWqL2xYVIBYpXKhE" 
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Nomad Carbon</h4>
                    <p className="text-sm text-slate-500">RFID Shielded</p>
                  </div>
                  <span className="text-lg font-bold text-primary">110 MAD</span>
                </div>
                <button className="w-full mt-auto py-3 bg-slate-100 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white font-bold rounded-full transition-colors text-sm font-display">
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="group flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-all">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Metal bifold wallet with modern aesthetic" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq_5g3DHaNpypDbAVz9KXJ8a4EqZAVmagOcGDtyqVPjGt5qL5z_OEQpXoaPiRo6gT5sp2wdji5GiO4CwCr9TKtsk4VZVkbWmcXI-w2RtPXfLm5-qOebwcKR0CwVvXmvMr7-UEI_xbfjkLKA5v6p168noErEBNhHP1LGz3qkVMFB19N2kNo4_203hlMUHRqcdkeTRSWy8yq0uK_PW9M6nvnB7p9_2am5vv2EtXtaI_UhpDX7zuhZsZQHc8U-mvQGb9KVEoy6j80zIw" 
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Titan Bifold</h4>
                    <p className="text-sm text-slate-500">Aerospace Aluminum</p>
                  </div>
                  <span className="text-lg font-bold text-primary">95 MAD</span>
                </div>
                <button className="w-full mt-auto py-3 bg-slate-100 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white font-bold rounded-full transition-colors text-sm font-display">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">shield</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Military Grade Shielding</h3>
              <p className="text-sm text-slate-500">Full RFID/NFC protection for your data.</p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">speed</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Quick Access Trigger</h3>
              <p className="text-sm text-slate-500">Cards fan out at the touch of a button.</p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">light_mode</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Ultra Slim Profile</h3>
              <p className="text-sm text-slate-500">Eliminate bulk with 0.4 inch thickness.</p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">all_inclusive</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Lifetime Warranty</h3>
              <p className="text-sm text-slate-500">Engineered to last through generations.</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">Built for the <br /><span className="text-primary italic">Digital Frontier</span></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Every component is tested under extreme conditions. Our carbon fiber isn&apos;t just for looks—it&apos;s high-modulus, impact-resistant material used in supercars and spacecraft.
            </p>
            <button className="px-8 py-4 bg-primary text-white rounded-full font-bold w-fit hover:bg-primary/80 transition-all">
              Learn About the Tech
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-5xl mx-auto rounded-xl p-10 lg:p-20 bg-primary relative overflow-hidden text-center flex flex-col items-center gap-8 border border-primary/50 shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 carbon-pattern opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col gap-4 items-center">
            <span className="material-symbols-outlined text-white/90 text-5xl">alternate_email</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">Join the Inner Circle</h2>
            <p className="text-white/80 max-w-lg text-lg">
              Get early access to limited drops and exclusive lab reports on carry tech.
            </p>
          </div>
          <form className="relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input className="flex-1 bg-white/10 border-white/20 rounded-full px-6 py-4 focus:border-white focus:ring-1 focus:ring-white text-white outline-none placeholder:text-white/60" placeholder="Enter your email" required type="email" />
            <button className="bg-white hover:bg-slate-50 text-primary font-bold px-8 py-4 rounded-full transition-all" type="submit">
              Subscribe
            </button>
          </form>
          <p className="relative z-10 text-xs text-white/60">By joining, you agree to our Terms and Privacy Policy. No spam, just tech.</p>
        </div>
      </section>
    </>
  );
}
