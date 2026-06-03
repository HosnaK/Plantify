import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="mb-2 text-xl font-semibold text-emerald-950">Reset password</h2>
      <p className="mb-6 text-sm text-emerald-900/70">
        Enter your account email. We&apos;ll send you a link to set a new password.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
