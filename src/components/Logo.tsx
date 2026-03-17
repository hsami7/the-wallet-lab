"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: "full" | "icon" | "secondary" | "solid";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "auto",
  variant = "full"
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: size, height: "auto" }} className={className} />;
  }

  const isDark = resolvedTheme === "dark";

  // FULL LOGO WITH TEXT
  if (variant === "full") {
    if (isDark) {
      return (
        <svg id="svg-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 120" className={className} style={{ width: size, height: "auto" }} fill="none">
          <g transform="translate(10, 15)">
            <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="4" fill="none" />
            <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <g transform="translate(4, 4) scale(0.92)">
              <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeOpacity="0.15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30,65 L70,65 M36,75 L64,75" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
              <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M72,5 L35,80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              <path d="M73,3 L76,9" stroke="#101622" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(110, 45)" fontFamily="Space Grotesk, sans-serif">
              <text x="0" y="-15" fontSize="24" fontWeight="300" fill="#666666">The</text>
              <text x="0" y="20" fontSize="36" fontWeight="700" fill="var(--color-primary)" letterSpacing="-0.5">embroidery&apos;s</text>
              <text x="235" y="20" fontSize="36" fontWeight="500" fill="#f1f5f9" letterSpacing="-0.5">Lab</text>
            </g>
          </g>
        </svg>
      );
    }
    return (
      <svg id="svg-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 120" className={className} style={{ width: size, height: "auto" }} fill="none">
        <g transform="translate(10, 15)">
          <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="4" fill="none" />
          <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(4, 4) scale(0.92)">
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#f5f6f8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g transform="translate(110, 45)" fontFamily="Space Grotesk, sans-serif">
            <text x="0" y="-15" fontSize="24" fontWeight="300" fill="#666666">The</text>
            <text x="0" y="20" fontSize="36" fontWeight="700" fill="var(--color-primary)" letterSpacing="-0.5">embroidery&apos;s</text>
            <text x="235" y="20" fontSize="36" fontWeight="500" fill="#1e293b" letterSpacing="-0.5">Lab</text>
          </g>
        </g>
      </svg>
    );
  }

  // ICON VARIANTS
  if (variant === "secondary") {
    return (
      <svg id="icon-sec" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className} style={{ width: size, height: "auto" }} fill="none">
        <g transform="translate(10, 15)">
          <circle cx="50" cy="50" r="45" stroke="#666666" strokeWidth="4" fill="none" />
          <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#666666" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(4, 4) scale(0.92)">
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#666666" strokeOpacity="0.15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#666666" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#666666" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="#666666" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#666666" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#f5f6f8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  if (variant === "solid") {
    return (
      <svg id="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className} style={{ width: size, height: "auto" }} fill="none">
        <g transform="translate(10, 15)">
          <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeWidth="4" fill="none" />
          <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(4, 4) scale(0.92)">
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#ffffff" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#ffffff" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // DEFAULT ICON MARK (THEME-AWARE)
  if (isDark) {
    return (
      <svg id="icon-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className} style={{ width: size, height: "auto" }} fill="none">
        <g transform="translate(10, 15)">
          <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="4" fill="none" />
          <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(4, 4) scale(0.92)">
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeOpacity="0.15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#101622" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg id="icon-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className} style={{ width: size, height: "auto" }} fill="none">
      <g transform="translate(10, 15)">
        <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="4" fill="none" />
        <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(4, 4) scale(0.92)">
          <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30,65 L70,65 M36,75 L64,75" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
          <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M72,5 L35,80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
          <path d="M73,3 L76,9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
