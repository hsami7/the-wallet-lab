"use client";

import React from "react";
import { useTheme } from "next-themes";

type IconVariant = "light" | "dark" | "secondary" | "solid" | "themed";

interface IconMarkProps {
  variant?: IconVariant;
  className?: string;
  size?: number | string;
}

export const IconMark: React.FC<IconMarkProps> = ({
  variant = "themed",
  className = "",
  size = 40,
}) => {
  const { resolvedTheme } = useTheme();

  const getActiveVariant = (): Exclude<IconVariant, "themed"> => {
    if (variant !== "themed") return variant;
    return resolvedTheme === "dark" ? "dark" : "light";
  };

  const activeVariant = getActiveVariant();

  const renderIcon = () => {
    switch (activeVariant) {
      case "dark":
        return (
          <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
            <path
              d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15"
              stroke="#f1f5f9"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#0d59f2" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#0d59f2" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#101622" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "secondary":
        return (
          <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
            <path
              d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15"
              stroke="#666666"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#666666" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#666666" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#f5f6f8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "solid":
        return (
          <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
            <path
              d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#ffffff" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#0d59f2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "light":
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
            <path
              d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15"
              stroke="#1e293b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30,65 L70,65 M36,75 L64,75" stroke="#0d59f2" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
            <path d="M72,5 L35,80" stroke="#0d59f2" strokeWidth="4" strokeLinecap="round" />
            <path d="M73,3 L76,9" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
    }
  };

  return <>{renderIcon()}</>;
};
