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
          <svg viewBox="0 0 120 120" className={className} style={{ width: size, height: size }} fill="none">
            <g transform="translate(10, 15)">
              <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="4" fill="none" />
              <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(4, 4) scale(0.92)">
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeOpacity="0.15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#f1f5f9" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30,65 L70,65 M36,75 L64,75" stroke="#0d59f2" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
                <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="#0d59f2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M72,5 L35,80" stroke="#0d59f2" strokeWidth="4" strokeLinecap="round" />
                <path d="M73,3 L76,9" stroke="#101622" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        );
      case "secondary":
        return (
          <svg viewBox="0 0 120 120" className={className} style={{ width: size, height: size }} fill="none">
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
      case "solid":
        return (
          <svg viewBox="0 0 120 120" className={className} style={{ width: size, height: size }} fill="none">
            <g transform="translate(10, 15)">
              <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeWidth="4" fill="none" />
              <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(4, 4) scale(0.92)">
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#ffffff" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30,65 L70,65 M36,75 L64,75" stroke="#ffffff" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
                <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M72,5 L35,80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <path d="M73,3 L76,9" stroke="#0d59f2" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        );
      case "light":
      default:
        return (
          <svg viewBox="0 0 120 120" className={className} style={{ width: size, height: size }} fill="none">
            <g transform="translate(10, 15)">
              <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="4" fill="none" />
              <path d="M40,5 L60,5 M45,0 L55,0 M50,-4 L50,5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(4, 4) scale(0.92)">
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40,15 L60,15 M45,15 L45,40 L25,75 A6,6 0 0,0 30,85 L70,85 A6,6 0 0,0 75,75 L55,40 L55,15" stroke="#1e293b" strokeWidth="4" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30,65 L70,65 M36,75 L64,75" stroke="#0d59f2" strokeWidth="5" strokeDasharray="6,6" strokeLinecap="round" />
                <path d="M74,6 C 90,-4 95,16 80,26 C 65,36 60,16 75,11" stroke="#0d59f2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M72,5 L35,80" stroke="#0d59f2" strokeWidth="4" strokeLinecap="round" />
                <path d="M73,3 L76,9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        );
    }
  };

  return <>{renderIcon()}</>;
};
