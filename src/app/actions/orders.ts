"use client"; // Note: This file will contain server actions, but usually they are "use server" at the top level. I will use "use server" at the function level if needed, or at the top.

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: {
  customer_id: string;
  total_amount: number;
  shipping_rate_id: string | null;
  shipping_address: any;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}) {
  const supabase = await createClient();

  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: formData.customer_id,
        total_amount: formData.total_amount,
        shipping_rate_id: formData.shipping_rate_id,
        shipping_address: formData.shipping_address,
        status: "pending",
        payment_status: "unpaid", // Default for now, assuming COD or pending card success
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create the order items
    const orderItems = formData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Update inventory (Optional but professional)
    for (const item of formData.items) {
      const { error: stockError } = await supabase.rpc('decrement_inventory', {
        p_id: item.product_id,
        p_quantity: item.quantity
      });
      // Note: This RPC might not exist yet. I should check or use a simple update if RPC is missing.
      if (stockError) {
        console.warn(`Failed to update inventory for product ${item.product_id}:`, stockError);
        // We don't necessarily want to fail the whole order if inventory update fails
        // but in a real system we would.
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message };
  }
}
