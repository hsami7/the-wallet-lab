import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./ProductDetailsClient";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getProductReviews } from "@/app/actions/reviews";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url, price")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description || `Premium ${product.name} with unique embroidery art by The Embroidery's Lab.`,
    openGraph: {
      title: `${product.name} | The Embroidery's Lab`,
      description: product.description || `Shop the ${product.name} featuring precision-engineered embroidery art.`,
      images: product.image_url ? [product.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | The Embroidery's Lab`,
      description: product.description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

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

  // Fetch Reviews
  const { reviews, stats } = await getProductReviews(product.id);

  // Fetch Related Products (Limit 3)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, category")
    .neq("id", product.id)
    .eq("status", "active")
    .limit(3);

  return (
    <>
      <JsonLd 
        product={{
          name: product.name,
          description: product.description || "",
          image: product.image_url || "",
          price: product.price,
          slug: product.slug,
          inStock: product.inventory_count > 0,
          sku: product.sku
        }}
      />
      <ProductDetailsClient 
        product={product} 
        highlights={highlights || []} 
        shippingRules={shippingRules || []}
        reviews={reviews}
        reviewStats={stats}
        relatedProducts={relatedProducts || []}
      />
    </>
  );
}
