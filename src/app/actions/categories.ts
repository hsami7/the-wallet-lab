"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return [];
    }
    return data as Category[];
  } catch (err) {
    return [];
  }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const description = formData.get("description") as string;

  try {
    const { error } = await supabase
      .from("categories")
      .insert([{ name, slug, description }]);

    if (error) {
      if (error.code === '42P01') {
        throw new Error("Categories table not found. Please run the SQL setup script provided in the Category page or Walkthrough.");
      }
      throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (err: any) {
    throw new Error(err.message || "Failed to create category");
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const description = formData.get("description") as string;

  try {
    const { error } = await supabase
      .from("categories")
      .update({ name, slug, description })
      .eq("id", id);

    if (error) {
      if (error.code === '42P01') {
        throw new Error("Categories table not found. Please run the SQL setup script provided in the Category page or Walkthrough.");
      }
      throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (err: any) {
    throw new Error(err.message || "Failed to update category");
  }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === '42P01') {
        throw new Error("Categories table not found. Please run the SQL setup script provided in the Category page or Walkthrough.");
      }
      throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (err: any) {
    throw new Error(err.message || "Failed to delete category");
  }
}
