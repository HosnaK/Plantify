import type { BuyerInquiryStatus } from "@/lib/types";

export const BUYER_INQUIRY_STATUS_OPTIONS: {
  value: BuyerInquiryStatus;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "contacted", label: "Contacted" },
];

export function isBuyerInquiryStatus(v: string): v is BuyerInquiryStatus {
  return v === "new" || v === "in_review" || v === "contacted";
}
