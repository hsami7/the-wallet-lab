"use server";

import { createAdminClient } from "@/utils/supabase/server";

export async function getOrderTracking(orderId: string, email: string) {
  const supabase = createAdminClient();

  try {
    // 1. Get the order using an admin client to bypass RLS initially,
    //    so we can check the email manually.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found. Please check your Order ID." };
    }

    // 2. Get the customer's email from the profile or auth to verify
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id") // In this app, profiles may not store email directly.
      .eq("id", order.customer_id)
      .single();

    // Since profiles might not store email if it's handled by Auth, let's check Auth users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.customer_id);

    if (userError || !userData?.user) {
      return { success: false, error: "Could not verify order details." };
    }

    const orderEmail = userData.user.email;

    if (orderEmail?.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: "The email provided does not match the order." };
    }

    // 3. Return the sanitized tracking data
    return { 
      success: true, 
      order: {
        id: order.id,
        created_at: order.created_at,
        status: order.status,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        tracking_number: order.tracking_number,
        carrier: order.carrier,
        notification_history: order.notification_history,
        items: order.order_items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          image_url: item.product.image_url,
        }))
      } 
    };

  } catch (error: any) {
    console.error("Tracking retrieval error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
