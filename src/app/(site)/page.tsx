import Link from "next/link";
import { getCollections } from "@/app/actions/homepage";
import { createClient } from "@/utils/supabase/server";
import { FeaturedProductsClient } from "@/components/home/FeaturedProductsClient";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Shop premium wallets, denims, jeans, and jackets with precision-engineered art. Experience the future of wearable art at The Embroidery's Lab.",
  openGraph: {
    title: "The Embroidery's Lab | Next Generation Embroidery Art",
    description: "Shop premium wallets, denims, jeans, and jackets with precision-engineered art.",
    images: ["/og-image.png"],
  },
};

export const dynamic = "force-dynamic";

import { HomeCollectionsSlider } from "@/components/home/HomeCollectionsSlider";

export default async function Home() {
  const collections = await getCollections();
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("status", "active")
    .limit(3);

  const defaultCollections = [
    { label: 'Everyday Essentials', heading: 'Classic style', image_url: '', button_text: 'Shop Now', button_link: '/shop', is_slider: false },
    { label: 'Winter Collection', heading: 'Cozy looks for any season', image_url: '', button_text: 'Discover more', button_link: '/shop', is_slider: false },
    { label: 'Premium Accessories', heading: 'Timeless accessory', image_url: '', button_text: 'Shop Now', button_link: '/shop', is_slider: false },
  ];

  const gridData = collections.length > 0 ? collections : defaultCollections;
  const isSlider = gridData[0]?.is_slider || false;

  return (
    <>
      {isSlider ? (
        <HomeCollectionsSlider data={gridData} />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 w-full h-auto min-h-[600px]">
          {gridData.map((col, idx) => (
            <div key={idx} className={`relative group overflow-hidden h-[600px] md:h-auto ${idx === 1 ? 'border-y md:border-y-0 md:border-x border-white/10' : ''}`}>
              {col.image_url ? (
                <img
                  src={col.image_url}
                  alt={`${col.label} - ${col.heading}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-slate-900 transition-transform duration-700 group-hover:scale-105"></div>
              )}
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
      )}

      <section className="px-6 lg:px-20 py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                <TranslatedText tKey="home.heroTitle" />
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                <TranslatedText tKey="home.heroSubtitle" />
              </p>
            </div>
            <Link href="/shop" className="text-primary font-bold flex items-center gap-2 hover:underline">
              <TranslatedText tKey="home.viewAll" /> <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <FeaturedProductsClient featuredProducts={featuredProducts || []} />
        </div>
      </section>

      <section className="px-6 lg:px-20 py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">shield</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight"><TranslatedText tKey="home.features.shieldTitle" /></h3>
              <p className="text-sm text-slate-500"><TranslatedText tKey="home.features.shieldDesc" /></p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">speed</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight"><TranslatedText tKey="home.features.speedTitle" /></h3>
              <p className="text-sm text-slate-500"><TranslatedText tKey="home.features.speedDesc" /></p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">light_mode</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight"><TranslatedText tKey="home.features.slimTitle" /></h3>
              <p className="text-sm text-slate-500"><TranslatedText tKey="home.features.slimDesc" /></p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">all_inclusive</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight"><TranslatedText tKey="home.features.warrantyTitle" /></h3>
              <p className="text-sm text-slate-500"><TranslatedText tKey="home.features.warrantyDesc" /></p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight"><TranslatedText tKey="home.storyTitle" /></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              <TranslatedText tKey="home.storyDesc" />
            </p>
            <button className="px-8 py-4 bg-primary text-white rounded-full font-bold w-fit hover:bg-primary/80 transition-all">
              <TranslatedText tKey="home.learnMore" />
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-5xl mx-auto rounded-xl p-10 lg:p-20 bg-primary relative overflow-hidden text-center flex flex-col items-center gap-8 border border-primary/50 shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 carbon-pattern opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col gap-4 items-center">
            <span className="material-symbols-outlined text-white/90 text-5xl">alternate_email</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight"><TranslatedText tKey="home.newsletter.title" /></h2>
            <p className="text-white/80 max-w-lg text-lg">
              <TranslatedText tKey="home.newsletter.desc" />
            </p>
          </div>
          <form className="relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input className="flex-1 bg-white/10 border-white/20 rounded-full px-6 py-4 focus:border-white focus:ring-1 focus:ring-white text-white outline-none placeholder:text-white/60" placeholder="Enter your email" required type="email" />
            <button className="bg-white hover:bg-slate-50 text-primary font-bold px-8 py-4 rounded-full transition-all" type="submit">
              <TranslatedText tKey="home.newsletter.button" />
            </button>
          </form>
          <p className="relative z-10 text-xs text-white/60"><TranslatedText tKey="home.newsletter.disclaimer" /></p>
        </div>
      </section>
    </>
  );
}
