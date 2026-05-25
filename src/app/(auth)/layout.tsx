import { PlantifyLogo } from "@/components/PlantifyLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <PlantifyLogo priority />
        <p className="mt-3 text-sm text-emerald-900/70">Grower growth platform</p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/5">
        {children}
      </div>
    </main>
  );
}
