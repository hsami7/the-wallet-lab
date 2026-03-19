import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "The Embroidery's Lab",
    template: "%s | The Embroidery's Lab",
  },
  description: "The Embroidery's Lab: Premium wallets, denims, jeans, and jackets featuring unique, precision-engineered art. Experience the fusion of traditional craftsmanship and modern technology.",
  keywords: ["embroidery", "art wallets", "custom denim", "art jeans", "embroidered jackets", "tech accessories", "digital frontier", "premium embroidery", "wearable art"],
  authors: [{ name: "The Embroidery's Lab Team" }],
  creator: "The Embroidery's Lab",
  publisher: "The Embroidery's Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "The Embroidery's Lab | Next Generation Embroidery Art",
    description: "Experience the fusion of traditional craftsmanship and modern technology.",
    url: "https://theembroideryslab.com",
    siteName: "The Embroidery's Lab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Embroidery's Lab - Next Generation Embroidery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Embroidery's Lab | Next Generation Embroidery Art",
    description: "Experience the fusion of traditional craftsmanship and modern technology.",
    images: ["/og-image.png"],
    creator: "@theembroideryslab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import JsonLd from "@/components/seo/JsonLd";
import TrackingProvider from "@/components/analytics/TrackingProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <JsonLd />
          <TrackingProvider />
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <ToastContainer />
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
