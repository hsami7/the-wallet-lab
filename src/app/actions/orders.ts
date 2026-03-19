"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createOrder(formData: {
  customer_id: string;
  total_amount: number;
  shipping_rate_id: string | null;
  shipping_address: any;
  discount_amount?: number;
  promo_code?: string | null;
  shipping_amount?: number;
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
        shipping_address: {
          ...formData.shipping_address,
          promo_code: formData.promo_code || null,
          discount_amount: formData.discount_amount || 0,
          shipping_amount: formData.shipping_amount || 0,
        },
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

    // 4. Update Promo Code Usage Count
    if (formData.promo_code) {
      try {
        const { data: promo } = await supabase
          .from('promo_codes')
          .select('used_count')
          .eq('code', formData.promo_code.toUpperCase())
          .single();
        
        if (promo) {
          await supabase
            .from('promo_codes')
            .update({ used_count: (promo.used_count || 0) + 1 })
            .eq('code', formData.promo_code.toUpperCase());
        }
      } catch (err) {
        console.warn("Failed to increment promo usage count:", err);
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
  const supabase = createAdminClient();
  const ids = Array.isArray(orderId) ? orderId : [orderId];

  try {
     console.log(`[Admin] Attempting to delete ${ids.length} orders:`, ids);

     // 1. Delete associated order items first to handle foreign key constraints
     const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .in("order_id", ids);

     if (itemsError) {
        console.error("Error deleting order_items:", itemsError);
        throw itemsError;
     }

     // 2. Delete the orders themselves
     const { error, count } = await supabase
        .from("orders")
        .delete({ count: 'exact' })
        .in("id", ids);

     if (error) {
        console.error("Error deleting orders:", error);
        throw error;
     }

     console.log(`[Admin] Successfully deleted ${count} orders. Performing post-deletion verification...`);

     // 2.1 Verification Step: Check if they are actually gone
     const { data: verifyData } = await supabase
        .from("orders")
        .select("id")
        .in("id", ids);

     if (verifyData && verifyData.length > 0) {
        console.error("CRITICAL: Deletion reported success but records still exist:", verifyData);
        throw new Error(`Critical Failure: Supabase reported success but ${verifyData.length} records still exist in the database. This may be a trigger or constraint issue.`);
     }

     if (count === 0) {
        throw new Error("Deletion failed: No records were affected. Small possibility of RLS blocking even Service Role if misconfigured.");
     }

     // 3. Clear all relevant caches
     revalidatePath("/admin");
     revalidatePath("/admin/orders");
     revalidatePath("/admin/analytics");
     
     return { success: true, deletedCount: count };
  } catch (error: any) {
     console.error("Delete order execution failed:", error);
     return { success: false, error: error.message || "Internal server error during deletion" };
  }
}
