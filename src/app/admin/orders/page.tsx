import { createClient } from "@/utils/supabase/server";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrders() {
  const supabase = await createClient();
  
  // Fetch orders with their related customer data and order items & products
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      order_items (
        quantity,
        unit_price,
        products (
          name,
          sku,
          image_url
        )
      )
    `)
    .order("created_at", { ascending: false });

  return <OrdersClient initialOrders={orders || []} />;
}
