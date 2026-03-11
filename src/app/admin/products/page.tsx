import { createClient } from "@/utils/supabase/server";
import { ProductsClient } from "./ProductsClient";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductsClient initialProducts={products || []} />;
}
