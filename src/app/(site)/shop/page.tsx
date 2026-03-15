import React from "react";
import { createClient } from "@/utils/supabase/server";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Fallback to empty array if error or no data
  const safeProducts = products || [];

  return <ShopClient products={safeProducts} />;
}
