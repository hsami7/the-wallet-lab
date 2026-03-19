import { createAdminClient } from "@/utils/supabase/server";
import { CustomersClient } from "./CustomersClient";

export default async function AdminCustomers() {
  const supabase = createAdminClient();
  
  // 1. Fetch ALL orders with items and products (Deep data source)
  const { data: allOrders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id, 
      total_amount, 
      shipping_address, 
      customer_id, 
      created_at,
      ip_address,
      order_items(
        quantity,
        unit_price,
        variant,
        products(name, image_url, colors)
      )
    `)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Orders Fetch Error:", ordersError);
  }

  // 2. Fetch profiles (Supplemental identity data)
  let profiles: any[] | null = null;
  const { data: initialProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, phone, status");

  if (profilesError) {
     console.warn("[Admin] Profiles fetch optimized fallback due to:", profilesError.message);
     const { data: fallbackProfiles } = await supabase
       .from("profiles")
       .select("id, email, full_name, role, created_at");
     profiles = fallbackProfiles;
  } else {
     profiles = initialProfiles;
  }

  console.log(`[Admin] Data Sync: ${allOrders?.length || 0} orders found. ${profiles?.length || 0} profiles found.`);

  const customerMap = new Map<string, any>();

  // Helper to aggregate items
  const aggregateItems = (existing: any[], newItems: any[]) => {
    const map = new Map();
    [...existing, ...newItems].forEach(item => {
      const key = `${item.products?.name}-${JSON.stringify(item.variant)}`;
      if (map.has(key)) {
        map.get(key).quantity += item.quantity;
      } else {
        map.set(key, { ...item });
      }
    });
    return Array.from(map.values());
  };

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
        phone: o.shipping_address.phone || "",
        orders: 0,
        spent: 0,
        joined: o.created_at,
        lastActive: o.created_at,
        lastIp: o.ip_address || "Unknown",
        status: o.customer_id ? "Active" : "Guest",
        isRegistered: !!o.customer_id,
        itemsBought: [],
        rawItems: []
      });
    }

    const customer = customerMap.get(email);
    customer.orders += 1;
    customer.spent += Number(o.total_amount);
    
    // Aggregating items bought
    if (o.order_items) {
      customer.rawItems = aggregateItems(customer.rawItems, o.order_items);
    }
    
    // Use earliest interaction as joined date
    if (new Date(o.created_at) < new Date(customer.joined)) {
      customer.joined = o.created_at;
    }
    // Use most recent as last active
    if (new Date(o.created_at) > new Date(customer.lastActive)) {
      customer.lastActive = o.created_at;
      customer.lastIp = o.ip_address || customer.lastIp;
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
      existing.phone = p.phone || existing.phone;
      existing.status = p.status || existing.status;
      if (existing.status === "Guest") existing.status = "Active";
    } else {
      // User who registered but hasn't ordered
      customerMap.set(email, {
        id: p.id,
        name: p.full_name || email.split("@")[0],
        email: p.email,
        phone: (p as any).phone || "",
        orders: 0,
        spent: 0,
        joined: p.created_at,
        lastActive: p.created_at,
        lastIp: "No History",
        status: (p as any).status || "New",
        isRegistered: true,
        itemsBought: [],
        rawItems: []
      });
    }
  });

  const formattedCustomers = Array.from(customerMap.values())
    .map(c => ({
      ...c,
      ltv: c.spent,
      spent: `${c.spent.toLocaleString()} MAD`,
      itemsCount: c.rawItems.reduce((acc: number, i: any) => acc + i.quantity, 0),
      itemsList: c.rawItems.map((i: any) => {
        const variantImageUrl = i.variant?.imageUrl || i.variant?.image;
        return {
          name: i.products?.name || "Unknown Product",
          quantity: i.quantity,
          unit_price: i.unit_price,
          variant: i.variant,
          productColors: i.products?.colors,
          image: variantImageUrl || i.products?.image_url
        };
      }),
      joinedFormatted: new Date(c.joined).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }),
      lastActiveFormatted: new Date(c.lastActive).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })
    }))
    .sort((a, b) => b.orders - a.orders);

  // If we have data, show it. If we have a critical error and no data, show an error state if possible
  // For now, we'll just pass empty list which shows the "Neural search found no matches" 
  // but with the console logs we'll know why.
  
  return <CustomersClient initialCustomers={formattedCustomers} />;
}
