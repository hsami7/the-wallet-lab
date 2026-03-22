"use server";

import { createAdminClient } from "@/utils/supabase/server";

export async function logTrafficEvent(eventData: any) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase.from("traffic_logs").insert(eventData);
    if (error) console.error("Traffic log error:", error);
  } catch (err) {
    console.error("Traffic log exception:", err);
  }
}
