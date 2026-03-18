import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Logo } from "@/components/Logo";

export default function AboutPage() {
  return (
    <div className="dark bg-[#101622] text-[#f1f5f9] font-['Space_Grotesk'] min-h-screen overflow-x-hidden pt-0 transition-colors duration-500">
      {/* 1. The Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/home/ngl/.gemini/antigravity/brain/3d7f97d1-a8f1-4fa4-ba4d-008ac5acede3/about_hero_bg_1773786217427.png"
            alt="Engineered Art Background"
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow active:scale-100 transition-transform duration-[10s]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101622]/40 via-transparent to-[#101622]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center px-6">
          <ScrollReveal animation="fade-up">
            <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter leading-none mb-4 italic">
              ENGINEERED<br />
              <span className="text-[#0d59f2] bg-clip-text text-transparent bg-gradient-to-r from-[#0d59f2] to-purple-500">ART.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xl md:text-2xl font-light tracking-widest uppercase opacity-80">
              Where laboratory precision meets timeless needlework.
            </p>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.3em]">Enter The Lab</span>
          <span className="material-symbols-outlined text-3xl">keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* 2. The Manifesto (Our Story) */}
      <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
            <ScrollReveal animation="slide-right">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight uppercase">
                WE ENGINEER <br />
                <span className="text-[#0d59f2]">WEARABLE ARCHITECTURE.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="slide-right" delay={200}>
              <div className="space-y-6 text-lg text-[#666666] leading-relaxed max-w-xl">
                <p>
                  Born from a desire to merge ancient craftsmanship with modern streetwear aesthetics,
                  <span className="text-[#f1f5f9] font-medium ml-1">The Embroidery&apos;s Lab</span> was never just a clothing brand. It was a technical challenge.
                </p>
                <p>
                  Every garment is a calculated experiment in thread density, color gradients, and structural integrity.
                  We draw inspiration from the traditional weaves of Fes and translate them into algorithms that feed our high-precision machinery.
                </p>
                <p>
                  To us, a jacket isn&apos;t just apparel; it&apos;s a blueprint. Each stitch path is modeled with surgical intent to interact perfectly with the grain of premium denim.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <ScrollReveal animation="slide-left">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#0d59f2]/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-50 transition-opacity" />
                <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                  <img
                    src="/home/ngl/.gemini/antigravity/brain/3d7f97d1-a8f1-4fa4-ba4d-008ac5acede3/about_manifesto_img_v3_1773786503517.png"
                    alt="Precision Embroidery Machine"
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. The Blueprint (Our Core Pillars) */}
      <section className="py-24 bg-[#0d59f2]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0d59f2]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="mb-16">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4 italic">The <span className="text-[#0d59f2]">Blueprint</span></h2>
              <div className="w-20 h-1 bg-[#0d59f2]" />
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={100} className="h-full">
              <div className="p-10 rounded-[32px] bg-[#1e293b] border border-white/5 h-full hover:border-[#0d59f2]/50 transition-all group">
                <div className="size-16 rounded-2xl bg-[#0d59f2]/10 flex items-center justify-center mb-8 border border-[#0d59f2]/20 text-[#0d59f2] transition-colors group-hover:bg-[#0d59f2] group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">architecture</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase italic">Surgical Precision</h3>
                <p className="text-[#666666] leading-relaxed group-hover:text-slate-300 transition-colors">
                  Over 150,000 stitches per garment. Calibrated to interact perfectly with the denim&apos;s grain for a finish that rivals high-end architecture.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} className="h-full">
              <div className="p-10 rounded-[32px] bg-[#1e293b] border border-white/5 h-full hover:border-[#0d59f2]/50 transition-all group">
                <div className="size-16 rounded-2xl bg-[#0d59f2]/10 flex items-center justify-center mb-8 border border-[#0d59f2]/20 text-[#0d59f2] transition-colors group-hover:bg-[#0d59f2] group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">layers</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase italic">Structural Integrity</h3>
                <p className="text-[#666666] leading-relaxed group-hover:text-slate-300 transition-colors">
                  High-density pigment stitching that crosses functional seams without warping the fabric, ensuring your experiment lasts a lifetime.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300} className="h-full">
              <div className="p-10 rounded-[32px] bg-[#1e293b] border border-white/5 h-full hover:border-[#0d59f2]/50 transition-all group">
                <div className="size-16 rounded-2xl bg-[#0d59f2]/10 flex items-center justify-center mb-8 border border-[#0d59f2]/20 text-[#0d59f2] transition-colors group-hover:bg-[#0d59f2] group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">science</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase italic">Limited Experiments</h3>
                <p className="text-[#666666] leading-relaxed group-hover:text-slate-300 transition-colors">
                  We reject mass production. Each drop is a limited-run, meticulously tested prototype, numbered and archived in our database.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. The Technicians (Behind the Needle) */}
      <section className="py-32 relative overflow-hidden group">
        <div className="absolute inset-0 carbon-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-20 text-center relative z-10">
          <ScrollReveal animation="fade-up">
            <span className="text-[#0d59f2] font-bold tracking-[0.4em] uppercase text-sm block mb-8">The Technicians</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none mb-12 italic">
              TRANSFORMING ALGORITHMS <br />
              <span className="opacity-40">INTO THREAD.</span>
            </h2>
            <div className="max-w-2xl mx-auto text-lg text-[#666666] leading-relaxed">
              Our digitizers and designers aren&apos;t just artists; they are visionaries who translate complex geometry into physical form.
              The lab is where human intuition meets robotic precision.
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Call to Action (The Final Hook) */}
      <section className="py-24 px-6 md:px-20 relative">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-24 bg-gradient-to-tr from-[#0d59f2] to-purple-600 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

          <ScrollReveal animation="fade-up">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 italic">ENTER THE LAB.</h2>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-12 max-w-xl mx-auto">
              Secure your unit from the archive or collaborate on a unique architectural project.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-[#0d59f2] px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20"
              >
                Shop the Archive
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white/40 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
              >
                Commission an Experiment
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Simple Dark Footer for About Page */}
      <footer className="py-12 border-t border-white/5 text-center mt-12 bg-[#0a0f1a]">
        <div className="flex flex-col items-center gap-6">
          <Logo size={120} forceFull className="opacity-80" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#666666]">
            &copy; {new Date().getFullYear()} The Embroidery&apos;s Lab. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
