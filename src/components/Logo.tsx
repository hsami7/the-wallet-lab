"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
  size?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "auto" }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering the SVG after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: size, height: "auto" }} className={className} />;
  }

  if (resolvedTheme === "dark") {
    return (
      <svg
        id="svg-dark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 450 120"
        className={className}
        style={{ width: size, height: "auto" }}
        fill="none"
      >
        <g transform="translate(10, 10)">
          {/* Beaker */}
          <path
            d="M40,20 L60,20 M45,20 L45,45 L25,80 A6,6 0 0,0 30,90 L70,90 A6,6 0 0,0 75,80 L55,45 L55,20"
            stroke="#f1f5f9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stitches (Liquid) */}
          <path
            d="M30,70 L70,70"
            stroke="#0d59f2"
            strokeWidth="5"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
          <path
            d="M36,80 L64,80"
            stroke="#0d59f2"
            strokeWidth="5"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
          {/* Needle */}
          <path
            d="M72,10 L35,85"
            stroke="#0d59f2"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Needle Eye */}
          <path
            d="M73,8 L76,14"
            stroke="#101622"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Text */}
          <g transform="translate(110, 60)" fontFamily="var(--font-space-grotesk), sans-serif">
            <text x="0" y="-15" fontSize="24" fontWeight="300" fill="#666666">
              The
            </text>
            <text x="0" y="20" fontSize="36" fontWeight="700" fill="#0d59f2" letterSpacing="-0.5">
              embroidery's
            </text>
            <text x="235" y="20" fontSize="36" fontWeight="500" fill="#f1f5f9" letterSpacing="-0.5">
              Lab
            </text>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      id="svg-light"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 450 120"
      className={className}
      style={{ width: size, height: "auto" }}
      fill="none"
    >
      <g transform="translate(10, 10)">
        {/* Beaker */}
        <path
          d="M40,20 L60,20 M45,20 L45,45 L25,80 A6,6 0 0,0 30,90 L70,90 A6,6 0 0,0 75,80 L55,45 L55,20"
          stroke="#1e293b"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stitches (Liquid) */}
        <path
          d="M30,70 L70,70"
          stroke="#0d59f2"
          strokeWidth="5"
          strokeDasharray="6,6"
          strokeLinecap="round"
        />
        <path
          d="M36,80 L64,80"
          stroke="#0d59f2"
          strokeWidth="5"
          strokeDasharray="6,6"
          strokeLinecap="round"
        />
        {/* Needle */}
        <path
          d="M72,10 L35,85"
          stroke="#0d59f2"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Needle Eye */}
        <path
          d="M73,8 L76,14"
          stroke="#f5f6f8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Text */}
        <g transform="translate(110, 60)" fontFamily="var(--font-space-grotesk), sans-serif">
          <text x="0" y="-15" fontSize="24" fontWeight="300" fill="#666666">
            The
          </text>
          <text x="0" y="20" fontSize="36" fontWeight="700" fill="#0d59f2" letterSpacing="-0.5">
            embroidery's
          </text>
          <text x="235" y="20" fontSize="36" fontWeight="500" fill="#1e293b" letterSpacing="-0.5">
            Lab
          </text>
        </g>
      </g>
    </svg>
  );
};
