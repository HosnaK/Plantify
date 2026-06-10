"use client";

import { format } from "date-fns";
import { BuyerInquiryStatusSelect } from "@/components/admin/BuyerInquiryStatusSelect";
import type { BuyerInquiry } from "@/lib/types";

export function BuyerInquiriesTable({ inquiries }: { inquiries: BuyerInquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center text-emerald-900/70">
        No buyer inquiries yet.
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-emerald-100 bg-white shadow-sm md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-emerald-100 bg-emerald-50/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-emerald-950">Full name</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Email</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Order details</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Date submitted</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {inquiries.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-3 font-medium text-emerald-950">{row.full_name}</td>
                <td className="px-4 py-3 break-all text-emerald-900/90">{row.email}</td>
                <td className="max-w-xs px-4 py-3 whitespace-pre-wrap text-emerald-900/80">
                  {row.order_details}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-emerald-900/80">
                  {format(new Date(row.created_at), "MMM d, yyyy h:mm a")}
                </td>
                <td className="px-4 py-3">
                  <BuyerInquiryStatusSelect inquiryId={row.id} currentStatus={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {inquiries.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-emerald-950">{row.full_name}</p>
            <p className="mt-1 break-all text-sm text-emerald-800">{row.email}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-emerald-900/80">{row.order_details}</p>
            <p className="mt-2 text-xs text-emerald-900/55">
              {format(new Date(row.created_at), "MMM d, yyyy h:mm a")}
            </p>
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-emerald-900/60">Status</p>
              <BuyerInquiryStatusSelect inquiryId={row.id} currentStatus={row.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
