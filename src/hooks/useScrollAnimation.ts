"use client";

import { useEffect, useRef, useState } from "react";

export type AnimationType = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";

export function useScrollAnimation(animation: AnimationType = "fade-up", delay: number = 0) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const className = `${animation} ${isVisible ? "animate-in" : ""}`;
  const style = delay ? { transitionDelay: `${delay}ms` } : {};

  return { ref, className, style };
}
