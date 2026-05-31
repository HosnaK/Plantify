import { AuthForm } from "@/components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-emerald-950">Sign in</h2>
      <AuthForm mode="login" redirectAfterLogin={next} />
    </>
  );
}
