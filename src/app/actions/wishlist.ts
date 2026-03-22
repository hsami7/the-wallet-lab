"use server";

import { createAdminClient } from "@/utils/supabase/server";

export async function createSharedWishlist(productIds: any[], sessionId: string) {
  const supabase = createAdminClient();
  try {
    const { data: newShare, error } = await supabase
      .from("shared_wishlists")
      .insert({ product_ids: productIds, session_id: sessionId })
      .select("id")
      .single();
      
    if (error) throw error;
    return { success: true, id: newShare.id };
  } catch (err: any) {
    console.error("Error creating shared wishlist:", err);
    return { success: false, error: err.message };
  }
}
