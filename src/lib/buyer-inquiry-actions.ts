"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { isBuyerInquiryStatus } from "@/lib/buyer-inquiry-constants";
import type { BuyerInquiryStatus } from "@/lib/types";

export type BuyerInquiryFormState = { ok?: boolean; error?: string } | null;

export async function submitBuyerInquiry(
  _prevState: BuyerInquiryFormState,
  formData: FormData
): Promise<BuyerInquiryFormState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const order_details = String(formData.get("order_details") ?? "").trim();

  if (!full_name) return { error: "Full name is required." };
  if (!email) return { error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!order_details) return { error: "Order details are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("buyer_inquiries").insert({
    full_name,
    email,
    order_details,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}

export async function updateBuyerInquiryStatus(inquiryId: string, status: string) {
  const { supabase } = await requireAdmin();

  if (!isBuyerInquiryStatus(status)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("buyer_inquiries")
    .update({ status: status as BuyerInquiryStatus })
    .eq("id", inquiryId);

  if (error) return { error: error.message };

  revalidatePath("/admin/buyer-inquiries");
  return { success: true };
}
