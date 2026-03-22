import React from "react";
import { createClient } from "@/utils/supabase/server";
import { ShopClient } from "./ShopClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Leather Wallets | The Wallet Lab",
  description: "Browse our exclusive collection of handcrafted premium leather wallets. Find the perfect minimalist carry for your lifestyle.",
  openGraph: {
    title: "Shop Premium Leather Wallets | The Wallet Lab",
    description: "Browse our exclusive collection of handcrafted premium leather wallets. Find the perfect minimalist carry for your lifestyle.",
    type: "website",
  }
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Fallback to empty array if error or no data
  const safeProducts = products || [];

  return <ShopClient products={safeProducts} />;
}
