import React from "react";

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
            The Wallet Lab started in a small workshop in Brooklyn. Our founder, a former architect, found himself frustrated with bulky, traditional bifolds that didn't fit the streamlined lifestyle of the modern city dweller.
          </p>
          <p>
            What started as a personal project to create the "perfect" wallet—one that disappeared into a pocket but felt substantial in the hand—quickly grew. Friends asked for them, then friends of friends, and soon we were shipping worldwide.
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
              <img alt="Leather selection process" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwDpwnnfvhWg2R9nWGppJDmIMRiQ_iNZMEar60cx1JiDt5ojeIruzjQgjEF6BcFdW09OvFsgMRKOQGB0YTGAyaUI4D060D90RdfyojjZXpY_kSAuES-adBzjbPlO8UmDIc3wQHLnvIxCiYFA0LhF64uyNhKkhV45cGm5KY6wNtWroSPY6hRaZ8uylG2x0ZD8nyj41E1tGheKY9p5H1-a2HmbE89E3XAwQG8wKcnyYnRCdNvpWbxZ8hoQq6SEapc5PAFLqr2UM67e4" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">01. Material Selection</h3>
            <p className="text-slate-600 dark:text-slate-400">We source only full-grain vegetable-tanned leathers from world-renowned tanneries in Italy and Chicago.</p>
          </div>
          <div className="group">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img alt="Precision cutting" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLPGzCyuR3FAkMoBIUI5J5RmLsrUOANk4qx7Bgzgd_IIC3CHnX0ieVjFnzmzPRTKPlCX9eYRiV1vuNxEPX26Nm9x-lm5NqRFEYa-jPiYan6YH84P5ir1PxPmuf6ze77ht70A8owGbXs3SfIxwaL_RzDXfQIJD2kfUTIvSclJdrxN5AA_JV9bT_gH5wQk2b6tpx7RhHMCR-gJsVs7Hwu2CdwOktmbmDM594gK9gIBruVooDBInjvtLPH98Bk1Urs_AucUTpD3Lbhu4" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">02. Precision Cutting</h3>
            <p className="text-slate-600 dark:text-slate-400">Every panel is laser-cut for absolute precision, then hand-skived to reduce bulk without sacrificing strength.</p>
          </div>
          <div className="group">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <img alt="Hand burnishing edges" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX3F36OG1g1zywgxv0H5TyvNrHFbnsdD0lFX2AKonZppJ3G9bh92-QhUfEnU-s-sApVyUNXmGY-kbhQjPEiucPmheqHYkgTfQIMF7wHYlD4FaPPoopIKvEgdALZwCV5dl26BZrk6mC8LnA2Q8HTtjIaPMSm1OxnI3y83weqQE90ER4SnbSB69XjB8dbYua3enBTC946xVCToil5gfkwPtR39aeFwxH-f77u7zYRm6_UfGYH3Hf7JJsprOD_8Gt1d4soV0czn8jveo" loading="lazy" />
            </div>
            <h3 className="text-xl font-bold mb-2">03. Edge Finishing</h3>
            <p className="text-slate-600 dark:text-slate-400">Our edges are hand-burnished with natural beeswax, a process that takes hours but creates a lifetime finish.</p>
          </div>
        </div>
      </section>

      <section className="bg-primary/10 rounded-xl p-8 md:p-16 mb-24">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
          <h2 className="text-4xl font-bold">Built for the long haul.</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            We don't believe in fast fashion. We believe in objects that acquire character over time, developing a unique patina that tells your story.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">eco</span>
              <span className="font-bold">Sustainable</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              <span className="font-bold">Lifetime Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">inventory_2</span>
              <span className="font-bold">Recyclable</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">public</span>
              <span className="font-bold">Global Shipping</span>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-12 mb-24">
        <h2 className="text-3xl font-bold mb-6">Ready to upgrade your carry?</h2>
        <div className="flex justify-center gap-4">
          <button className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">Shop All Products</button>
          <button className="border border-slate-300 dark:border-slate-700 px-10 py-4 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Join the Lab</button>
        </div>
      </section>
    </div>
  );
}
