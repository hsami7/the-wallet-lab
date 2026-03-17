"use client";

import React from "react";
import { useScrollAnimation, AnimationType } from "@/hooks/useScrollAnimation";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  as: Component = "div",
}: ScrollRevealProps) {
  const { ref, className: animationClass, style } = useScrollAnimation(animation, delay);

  return (
    <Component
      ref={ref as any}
      className={`${animationClass} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}
