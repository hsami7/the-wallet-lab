import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ProductDetailsClient } from "./ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-4 text-slate-500">Slug: {slug}</p>
        <Link href="/shop" className="mt-8 inline-block text-primary underline">Back to Shop</Link>
      </div>
    );
  }

  return <ProductDetailsClient product={product} />;
}
