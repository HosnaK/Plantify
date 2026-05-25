import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
        For commercial growers
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
        Track every seed from sprout to harvest
      </h1>
      <p className="mt-4 max-w-xl text-lg text-emerald-900/75">
        Plantify helps growers register seed codes, log biweekly growth with photos, and
        stay on schedule with automatic missed-form alerts.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-emerald-300 px-6 py-3 font-semibold text-emerald-900 hover:bg-emerald-50"
        >
          Sign in
        </Link>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          ["Register seeds", "Link official seed codes to your plants."],
          ["Biweekly forms", "Height, notes, and photos every two weeks."],
          ["Smart alerts", "Get notified when a growth form is overdue."],
        ].map(([title, desc]) => (
          <li
            key={title}
            className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold text-emerald-950">{title}</h2>
            <p className="mt-1 text-sm text-emerald-900/70">{desc}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
