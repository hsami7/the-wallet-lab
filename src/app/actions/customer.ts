"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function banUser(userId: string, isBanned: boolean) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ status: isBanned ? "Banned" : "Active" })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    console.error("Ban user error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUserAccount(userId: string) {
  const supabase = createAdminClient();
  
  try {
    // 1. Delete from Auth (Admin API)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Profile deletion should happen via Cascade or RLS, but we'll be explicit if needed
    // In many Supabase setups, auth.users deletion cascades to public.profiles
    
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { success: false, error: error.message };
  }
}
