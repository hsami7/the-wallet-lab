import Link from "next/link";
import { getCollections } from "@/app/actions/homepage";

export default async function Home() {
  const collections = await getCollections();
  
  const defaultCollections = [
    { label: 'Everyday Essentials', heading: 'Classic style', image_url: '/collections/classic.png', button_text: 'Shop Now', button_link: '/shop' },
    { label: 'Winter Collection', heading: 'Cozy looks for any season', image_url: '/collections/winter.png', button_text: 'Discover more', button_link: '/shop' },
    { label: 'Premium Accessories', heading: 'Timeless accessory', image_url: '/collections/accessories.png', button_text: 'Shop Now', button_link: '/shop' },
  ];

  const gridData = collections.length > 0 ? collections : defaultCollections;

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 w-full h-auto min-h-[600px]">
        {gridData.map((col, idx) => (
          <div key={idx} className={`relative group overflow-hidden h-[600px] md:h-auto ${idx === 1 ? 'border-y md:border-y-0 md:border-x border-white/10' : ''}`}>
            <img 
              src={col.image_url} 
              alt={`${col.label} - ${col.heading}`} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{col.label}</p>
                <h2 className="text-white text-4xl font-bold tracking-tight">{col.heading}</h2>
              </div>
              <Link href={col.button_link || "/shop"} className="w-fit px-8 py-3 border border-white/50 text-white hover:bg-white hover:text-black transition-all rounded-sm text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
                {col.button_text}
              </Link>
            </div>
          </div>
        ))}
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
