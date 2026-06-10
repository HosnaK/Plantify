"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateBuyerInquiryStatus } from "@/lib/buyer-inquiry-actions";
import { BUYER_INQUIRY_STATUS_OPTIONS } from "@/lib/buyer-inquiry-constants";
import type { BuyerInquiryStatus } from "@/lib/types";

export function BuyerInquiryStatusSelect({
  inquiryId,
  currentStatus,
}: {
  inquiryId: string;
  currentStatus: BuyerInquiryStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={(e) => {
        startTransition(async () => {
          await updateBuyerInquiryStatus(inquiryId, e.target.value);
          router.refresh();
        });
      }}
      className="w-full min-w-[9rem] rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-sm font-medium text-emerald-950 outline-none ring-[#10b981] focus:ring-2 disabled:opacity-60"
      aria-label="Inquiry status"
    >
      {BUYER_INQUIRY_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
