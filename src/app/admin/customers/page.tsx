import { createClient } from "@/utils/supabase/server";
import { CustomersClient } from "./CustomersClient";

export default async function AdminCustomers() {
  const supabase = await createClient();
  
  // 1. Fetch ALL orders (Primary source of truth for customers)
  const { data: allOrders } = await supabase
    .from("orders")
    .select("id, total_amount, shipping_address, customer_id, created_at")
    .order("created_at", { ascending: false });

  // 2. Fetch profiles (Supplemental identity data)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at");

  const customerMap = new Map<string, any>();

  // Build customer list from all orders to ensure no one is missed
  allOrders?.forEach((o: any) => {
    const email = o.shipping_address?.email?.toLowerCase();
    if (!email) return;

    if (!customerMap.has(email)) {
      const name = o.shipping_address?.firstName 
        ? `${o.shipping_address.firstName} ${o.shipping_address.lastName}` 
        : email.split("@")[0];

      customerMap.set(email, {
        id: o.customer_id || `guest-${o.id}`,
        name: name,
        email: o.shipping_address.email,
        orders: 0,
        spent: 0,
        joined: o.created_at,
        status: o.customer_id ? "Active" : "Guest",
        isRegistered: !!o.customer_id
      });
    }

    const customer = customerMap.get(email);
    customer.orders += 1;
    customer.spent += Number(o.total_amount);
    
    // Use earliest interaction as joined date
    if (new Date(o.created_at) < new Date(customer.joined)) {
      customer.joined = o.created_at;
    }
  });

  // Supplement/Override with Profile data
  profiles?.forEach((p: any) => {
    const email = p.email?.toLowerCase();
    if (!email) return;

    // Filter out admins from the customer view
    if (p.role === 'admin' || p.role === 'Administrator') {
      if (customerMap.has(email)) customerMap.delete(email);
      return;
    }

    if (customerMap.has(email)) {
      const existing = customerMap.get(email);
      existing.isRegistered = true;
      existing.id = p.id;
      if (p.full_name && p.full_name !== "User") existing.name = p.full_name;
      existing.joined = p.created_at; // Real signup date
      if (existing.status === "Guest") existing.status = "Active";
    } else {
      // User who registered but hasn't ordered
      customerMap.set(email, {
        id: p.id,
        name: p.full_name || email.split("@")[0],
        email: p.email,
        orders: 0,
        spent: 0,
        joined: p.created_at,
        status: "New",
        isRegistered: true
      });
    }
  });

  const formattedCustomers = Array.from(customerMap.values())
    .map(c => ({
      ...c,
      spent: `${c.spent.toLocaleString()} MAD`,
      joined: new Date(c.joined).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })
    }))
    .sort((a, b) => b.orders - a.orders);

  return <CustomersClient initialCustomers={formattedCustomers} />;
}
