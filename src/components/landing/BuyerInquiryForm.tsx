"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitBuyerInquiry, type BuyerInquiryFormState } from "@/lib/buyer-inquiry-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[#1b3d3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#152f2c] disabled:opacity-50 sm:w-auto sm:px-8"
    >
      {pending ? "Sending…" : "Submit inquiry"}
    </button>
  );
}

export function BuyerInquiryForm() {
  const [state, formAction] = useActionState(submitBuyerInquiry, null as BuyerInquiryFormState);

  if (state?.ok) {
    return (
      <p
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-sm font-medium text-emerald-900"
        role="status"
      >
        Thank you! We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-4">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="buyer_full_name" className="mb-1 block text-sm font-medium text-emerald-950">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          id="buyer_full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-[#10b981] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="buyer_email" className="mb-1 block text-sm font-medium text-emerald-950">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="buyer_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-[#10b981] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="buyer_order_details" className="mb-1 block text-sm font-medium text-emerald-950">
          Order details <span className="text-red-600">*</span>
        </label>
        <textarea
          id="buyer_order_details"
          name="order_details"
          required
          rows={4}
          placeholder="e.g. 500 Oak Trees, 200 Maple Trees"
          className="w-full resize-y rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-[#10b981] focus:ring-2"
        />
      </div>
      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
