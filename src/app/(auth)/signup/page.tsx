import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-emerald-950">Create your account</h2>
      <AuthForm mode="signup" />
    </>
  );
}
