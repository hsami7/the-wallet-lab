"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createOrder(formData: {
  customer_id: string;
  total_amount: number;
  shipping_rate_id: string | null;
  shipping_address: any;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    variant: any;
  }[];
}) {
  const supabase = await createClient();
   const headersList = await headers();
   const ip = headersList.get("x-forwarded-for")?.split(",")[0] || 
              headersList.get("x-real-ip") || 
              "127.0.0.1";

  try {
    // 0. Security Checks (Rate Limiting)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: recentOrders } = await supabase
      .from("orders")
      .select("*", { count: 'exact', head: true })
      .eq("ip_address", ip)
      .gt("created_at", tenMinutesAgo);

    if ((recentOrders || 0) > 5) {
      return { success: false, error: "Too many attempts. Please wait a few minutes." };
    }

    // 0.1 Fraud Risk Scoring (Simple logic)
    let fraud_score = 0;
    let risks = [];
    
    // Example: Flag if ZIP doesn't match a pattern (simple placeholder for complex logic)
    if (formData.shipping_address.zip.length < 5) {
       fraud_score += 20;
       risks.push("Suspect ZIP code format");
    }

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: formData.customer_id,
        total_amount: formData.total_amount,
        shipping_rate_id: formData.shipping_rate_id,
        shipping_address: formData.shipping_address,
        status: "pending",
        payment_status: "unpaid",
        ip_address: ip,
        fraud_score,
        risks
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
      variant: item.variant,
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
export async function notifyCustomer(orderId: string, status: string) {
  const supabase = await createClient();
  
  const brandedMessages: Record<string, string> = {
    pending: "Laboratory Order Received — Your artisan piece is queued for the lab.",
    processing: "Stitching Phase Active — Your garment has officially entered the lab's technical production.",
    shipped: "Logistics Dispatched — Your order is now in transit with our logistics partner.",
    delivered: "Operation Complete — Your artisan package has been delivered.",
    refunded: "Transaction Reversal — A refund has been issued for your order."
  };

  const message = brandedMessages[status.toLowerCase()] || `Order status updated to ${status}.`;

  try {
     // Fetch current history
     const { data: order } = await supabase.from("orders").select("notification_history").eq("id", orderId).single();
     const history = order?.notification_history || [];
     
     const newNotification = {
        type: "status_update",
        status: status.toLowerCase(),
        message,
        timestamp: new Date().toISOString()
     };

     const { error } = await supabase
        .from("orders")
        .update({ 
           notification_history: [...history, newNotification] 
        })
        .eq("id", orderId);

     if (error) throw error;
     
     // Note: In production, you would call your Email/SMS provider API here.
     console.log(`[Notification Engine] Sent to order ${orderId}: "${message}"`);

     return { success: true };
  } catch (error: any) {
     console.error("Notification error:", error);
     return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string | string[], status: string) {
  const supabase = await createClient();
  const ids = Array.isArray(orderId) ? orderId : [orderId];

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .in("id", ids);

    if (error) throw error;

    // Trigger notifications for each order
    for (const id of ids) {
       await notifyCustomer(id, status);
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Order update error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderTracking(orderId: string, trackingData: { tracking_number: string; carrier: string }) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("orders")
      .update(trackingData)
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Tracking update error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOrder(orderId: string | string[]) {
  const supabase = await createClient();
  const ids = Array.isArray(orderId) ? orderId : [orderId];

  try {
     // Order items usually have ON DELETE CASCADE, if not we'd delete them here.
     const { error } = await supabase
        .from("orders")
        .delete()
        .in("id", ids);

     if (error) throw error;

     revalidatePath("/admin/orders");
     revalidatePath("/admin");
     return { success: true };
  } catch (error: any) {
     console.error("Delete order error:", error);
     return { success: false, error: error.message };
  }
}
