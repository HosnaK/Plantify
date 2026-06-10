import { requireAdmin } from "@/lib/admin";
import { BuyerInquiriesTable } from "@/components/admin/BuyerInquiriesTable";
import type { BuyerInquiry } from "@/lib/types";

export default async function AdminBuyerInquiriesPage() {
  const { supabase } = await requireAdmin();

  const { data: rows, error } = await supabase
    .from("buyer_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
        Could not load buyer inquiries: {error.message}. Run migration{" "}
        <code className="rounded bg-red-100 px-1">005_buyer_inquiries.sql</code> in Supabase.
      </div>
    );
  }

  const inquiries = (rows ?? []) as BuyerInquiry[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Buyer inquiries</h1>
        <p className="mt-1 text-emerald-900/70">
          Submissions from the homepage order form. Update status as you work each lead.
        </p>
      </div>
      <BuyerInquiriesTable inquiries={inquiries} />
    </div>
  );
}
