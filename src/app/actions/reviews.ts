"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, customerName: string, rating: number, comment: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        customer_name: customerName,
        rating,
        comment,
      });

    if (error) throw error;

    revalidatePath(`/product/[slug]`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review." };
  }
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Calculate average rating
    const averageRating = data.length > 0
      ? data.reduce((acc, curr) => acc + curr.rating, 0) / data.length
      : 0;

    return { 
      success: true, 
      reviews: data || [],
      stats: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: data.length
      }
    };
  } catch (error: any) {
    console.error("Failed to get reviews:", error);
    return { success: false, reviews: [], stats: { averageRating: 0, totalReviews: 0 } };
  }
}
