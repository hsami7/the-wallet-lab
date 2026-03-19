import { createAdminClient } from "@/utils/supabase/server";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettings() {
  const supabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch profiles for the staff section
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  // Fetch real shipping rates
  const { data: shippingRates } = await supabase
    .from("shipping_rates")
    .select("*")
    .order("price", { ascending: true });

  // Fetch shipping rules
  const { data: shippingRules } = await supabase
    .from("shipping_rules")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <SettingsClient 
      currentUserId={user?.id} 
      profiles={profiles || []} 
      initialShippingRates={shippingRates || []}
      initialShippingRules={shippingRules || []}
    />
  );
}
