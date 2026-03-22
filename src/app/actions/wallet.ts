"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type UserCard = {
  id: string;
  user_id: string;
  card_holder: string;
  last_four: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
  cvc?: string;
};

export async function getCards(): Promise<UserCard[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cards:", error.message);
    return [];
  }

  return data as UserCard[];
}

export async function saveCard(cardData: {
  card_holder: string;
  card_number: string;
  exp_month: number;
  exp_year: number;
  is_default?: boolean;
  cvc?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const lastFour = cardData.card_number.slice(-4);
  const brand = cardData.card_number.startsWith('4') ? 'visa' : 'mastercard';

  // Duplicate Check
  const { data: existing } = await supabase
    .from("user_cards")
    .select("id")
    .eq("user_id", user.id)
    .eq("last_four", lastFour)
    .eq("exp_month", cardData.exp_month)
    .eq("exp_year", cardData.exp_year)
    .maybeSingle();

  if (existing) {
    throw new Error("This card is already in your wallet.");
  }

  // If setting as default, unset others first
  if (cardData.is_default) {
    await supabase
      .from("user_cards")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { data, error } = await supabase
    .from("user_cards")
    .insert({
      user_id: user.id,
      card_holder: cardData.card_holder,
      last_four: lastFour,
      brand: brand,
      exp_month: cardData.exp_month,
      exp_year: cardData.exp_year,
      is_default: cardData.is_default || false,
      cvc: cardData.cvc
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account");
  revalidatePath("/checkout");
  return { success: true, card: data as UserCard };
}

export async function deleteCard(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error, count } = await supabase
    .from("user_cards")
    .delete({ count: 'exact' })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account");
  revalidatePath("/checkout");
  return { success: true };
}

export async function setDefaultCard(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Unset all as default
  await supabase
    .from("user_cards")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set the chosen one as default
  const { error } = await supabase
    .from("user_cards")
    .update({ is_default: true })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account");
  revalidatePath("/checkout");
  return { success: true };
}
