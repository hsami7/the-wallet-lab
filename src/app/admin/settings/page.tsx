import { createClient } from "@/utils/supabase/server";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch profiles for the staff section
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  // Currently we don't have a settings table, so we'll pass mocked settings
  // for the store profile and shipping rates for now, but use real staff data
  return <SettingsClient currentUserId={user?.id} profiles={profiles || []} />;
}
