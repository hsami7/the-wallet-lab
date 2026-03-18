import { createClient } from "@/utils/supabase/server";
import { CustomersClient } from "./CustomersClient";

export default async function AdminCustomers() {
  const supabase = await createClient();
  
  // Fetch profiles with their orders to calculate spent/count
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      role,
      created_at,
      orders (
        total_amount
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch customers:", error);
  }

  const formattedCustomers = (profiles || []).map((p: any) => {
    const totalSpent = p.orders?.reduce((acc: number, o: any) => acc + Number(o.total_amount), 0) || 0;
    const orderCount = p.orders?.length || 0;
    const joinedDate = new Date(p.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    // Simple heuristic for status
    let status = "Active";
    if (orderCount === 0) status = "New";
    // If joined more than 30 days ago and 0 orders, maybe inactive? 
    // For now keep it simple.

    return {
      id: p.id,
      name: p.full_name || p.email?.split("@")[0] || "Unknown",
      email: p.email || "No Email",
      orders: orderCount,
      spent: `${totalSpent.toLocaleString()} MAD`,
      joined: joinedDate,
      status: status
    };
  });

  return <CustomersClient initialCustomers={formattedCustomers} />;
}
