"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "full" | "icon" | "secondary" | "solid";
  forceFull?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 180,
  variant = "full",
  forceFull = false
}) => {
  const sizeClass = variant === "icon" || variant === "secondary" || variant === "solid" ? size / 4 : size / 4;

  const LogoImage = ({ src, alt, extraClass = "" }: { src: string, alt: string, extraClass?: string }) => (
    <div className={`relative ${extraClass}`} style={{ width: sizeClass, height: sizeClass }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  );

  if (variant === "icon" || variant === "secondary" || variant === "solid") {
    return (
      <div className={`relative ${className}`}>
        <div className="show-light">
          <LogoImage src="/branding/logo-mobile-light.png" alt="The Embroidery's Lab Icon (Light)" />
        </div>
        <div className="show-dark">
          <LogoImage src="/branding/logo-mobile-dark.png" alt="The Embroidery's Lab Icon (Dark)" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`} style={{ height: size / 4 }}>
      {/* Mobile Icon - rendered immediately, theme handled by CSS */}
      <div className={forceFull ? 'hidden' : 'flex sm:hidden'}>
        <div className="show-light">
          <LogoImage src="/branding/logo-mobile-light.png" alt="The Embroidery's Lab Icon (Light)" />
        </div>
        <div className="show-dark">
          <LogoImage src="/branding/logo-mobile-dark.png" alt="The Embroidery's Lab Icon (Dark)" />
        </div>
      </div>
      
      {/* Desktop Logo - rendered immediately, theme handled by CSS */}
      <div className={forceFull ? 'flex' : 'hidden sm:flex'}>
        <div className="show-light">
          <LogoImage src="/branding/logo-light.png" alt="The Embroidery's Lab Logo (Light)" />
        </div>
        <div className="show-dark">
          <LogoImage src="/branding/logo-dark.png" alt="The Embroidery's Lab Logo (Dark)" />
        </div>
      </div>

      <div className={`${forceFull ? 'flex' : 'hidden sm:flex'} flex-col leading-none`}>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-light">The</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-primary tracking-tighter">Embroidery&apos;s</span>
          <span className="text-xl font-medium text-slate-900 dark:text-white tracking-tighter">Lab</span>
        </div>
      </div>
    </div>
  );
};
