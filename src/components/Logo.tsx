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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: size, height: (size * 0.25) }} className={className} />;
  }

  const isDark = resolvedTheme === "dark";
  const logoSrc = isDark ? "/branding/logo-dark.png" : "/branding/logo-light.png";
  const mobileLogoSrc = isDark ? "/branding/logo-mobile-dark.png" : "/branding/logo-mobile-light.png";

  if (variant === "icon" || variant === "secondary" || variant === "solid") {
    return (
      <div className={`relative ${className}`} style={{ width: size / 4, height: size / 4 }}>
        <Image
          src={mobileLogoSrc}
          alt="The Embroidery's Lab Icon"
          fill
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`} style={{ height: size / 4 }}>
      {/* Mobile Icon */}
      <div className={`relative ${forceFull ? 'hidden' : 'flex sm:hidden'}`} style={{ width: size / 4, height: size / 4 }}>
        <Image
          src={mobileLogoSrc}
          alt="The Embroidery's Lab Icon"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Desktop Logo */}
      <div className={`relative ${forceFull ? 'flex' : 'hidden sm:flex'}`} style={{ width: size / 4, height: size / 4 }}>
        <Image
          src={logoSrc}
          alt="The Embroidery's Lab Logo"
          fill
          className="object-contain"
          priority
        />
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
