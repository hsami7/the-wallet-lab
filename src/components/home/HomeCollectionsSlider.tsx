"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";

interface Collection {
  label: ReactNode;
  heading: ReactNode;
  image_url: string;
  button_text: ReactNode;
  button_link: string;
}

export function HomeCollectionsSlider({ data }: { data: Collection[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  }, [data.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  }, [data.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div 
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {data.map((col, idx) => (
          <div key={idx} className="relative min-w-full h-full">
            <img
              src={col.image_url}
              alt={`${col.label} - ${col.heading}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center px-10 lg:px-24">
              <div className="max-w-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div>
                  <p className="text-primary text-sm font-black uppercase tracking-[0.2em] mb-4 drop-shadow-md">
                    {col.label}
                  </p>
                  <h2 className="text-white text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl">
                    {typeof col.heading === 'string' ? (
                      col.heading.split(' ').map((word, i) => (
                        <span key={i} className={i % 2 === 1 ? 'text-primary italic block' : 'block'}>
                          {word}
                        </span>
                      ))
                    ) : col.heading}
                  </h2>
                </div>
                <Link 
                  href={col.button_link || "/shop"} 
                  className="w-fit px-10 py-4 bg-white text-black hover:bg-primary hover:text-white transition-all rounded-full text-sm font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                >
                  {col.button_text}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto size-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md transition-all flex items-center justify-center group/btn active:scale-90 opacity-0 group-hover/slider:opacity-100"
        >
          <span className="material-symbols-outlined text-3xl">chevron_left</span>
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto size-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md transition-all flex items-center justify-center group/btn active:scale-90 opacity-0 group-hover/slider:opacity-100"
        >
          <span className="material-symbols-outlined text-3xl">chevron_right</span>
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
        {data.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full h-1.5 ${currentIndex === idx ? 'w-12 bg-primary' : 'w-3 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}
