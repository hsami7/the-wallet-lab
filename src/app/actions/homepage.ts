"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type HomepageCollection = {
  id: string;
  slot_index: number;
  label: string;
  heading: string;
  image_url: string;
  button_text: string;
  button_link: string;
};

export async function getCollections(): Promise<HomepageCollection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_collections")
    .select("*")
    .order("slot_index", { ascending: true });

  if (error) {
    console.error("Error fetching homepage collections:", error);
    return [];
  }

  return data as HomepageCollection[];
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const label = formData.get("label") as string;
  const heading = formData.get("heading") as string;
  const image_url = formData.get("image_url") as string;
  const button_text = formData.get("button_text") as string;
  const button_link = formData.get("button_link") as string;

  const { error } = await supabase
    .from("homepage_collections")
    .update({
      label,
      heading,
      image_url,
      button_text,
      button_link,
      updated_at: new Promise(resolve => resolve(new Date().toISOString()))
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/collections");
  return { success: true };
}
