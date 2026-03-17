import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) {
    notFound();
  }

  const { data: highlights } = await supabase
    .from("product_highlights")
    .select("*")
    .eq("product_id", product.id)
    .order("order_index", { ascending: true });

  const { data: shippingRules } = await supabase
    .from("shipping_rules")
    .select("*")
    .eq("active", true);

  return <ProductDetailsClient 
    product={product} 
    highlights={highlights || []} 
    shippingRules={shippingRules || []}
  />;
}
