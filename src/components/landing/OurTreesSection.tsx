import Link from "next/link";

type Difficulty = "Easy" | "Medium" | "Hard";

type TreeOffering = {
  id: string;
  commonName: string;
  scientificName: string;
  tagline: string;
  seedCost: string;
  buybackStarting: string;
  timeline: string;
  difficulty: Difficulty;
  environmentPreferences: string;
  careTips: string;
};

const trees: TreeOffering[] = [
  {
    id: "osage-orange",
    commonName: "Osage Orange",
    scientificName: "Maclura Pomifera",
    tagline: "One of North America's toughest native trees",
    seedCost: "$0.15",
    buybackStarting: "$10",
    timeline: "16–20 weeks",
    difficulty: "Easy",
    environmentPreferences: "Full sun, tolerates drought and poor soil.",
    careTips: "Water weekly when young.",
  },
  {
    id: "eucalyptus",
    commonName: "Eucalyptus",
    scientificName: "Eucalyptus spp.",
    tagline: "Fast-growing aromatic tree in high demand for wellness and carbon programs",
    seedCost: "$0.10",
    buybackStarting: "$12",
    timeline: "12–16 weeks",
    difficulty: "Easy",
    environmentPreferences: "Full sun, well-drained soil; grows well indoors in large pots.",
    careTips: "Moderate watering.",
  },
  {
    id: "mulberry",
    commonName: "Mulberry",
    scientificName: "Morus spp.",
    tagline: "Fast-growing fruit tree sought by food and textile industries",
    seedCost: "$0.20",
    buybackStarting: "$15",
    timeline: "14–18 weeks",
    difficulty: "Easy",
    environmentPreferences: "Full sun to partial shade, adaptable to most soils.",
    careTips: "Moderate water.",
  },
  {
    id: "paulownia",
    commonName: "Paulownia (Empress Tree)",
    scientificName: "Paulownia tomentosa",
    tagline: "The world's fastest-growing hardwood, prized for premium timber",
    seedCost: "$0.25",
    buybackStarting: "$25",
    timeline: "10–12 weeks",
    difficulty: "Medium",
    environmentPreferences: "Full sun, well-drained soil.",
    careTips: "Water regularly; protect from frost when young.",
  },
  {
    id: "black-locust",
    commonName: "Black Locust",
    scientificName: "Robinia pseudoacacia",
    tagline: "Rot-resistant hardwood in high demand for land restoration projects",
    seedCost: "$0.15",
    buybackStarting: "$12",
    timeline: "16–20 weeks",
    difficulty: "Medium",
    environmentPreferences: "Full sun, tolerates poor dry soil.",
    careTips: "Low maintenance once established.",
  },
  {
    id: "white-willow",
    commonName: "White Willow",
    scientificName: "Salix alba",
    tagline: "The fastest-growing tree we offer, ideal for biomass and erosion control",
    seedCost: "$0.10",
    buybackStarting: "$10",
    timeline: "8–10 weeks",
    difficulty: "Easy",
    environmentPreferences: "Full sun, loves moisture; thrives near natural light sources indoors.",
    careTips: "Keep soil consistently moist for best growth.",
  },
];

const difficultyClass: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80",
  Medium: "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80",
  Hard: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
};

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M32 8C18 8 8 20 8 34c0 12 10 22 22 22 2 0 4-.2 6-.6C48 52 56 44 56 34 56 18 44 8 32 8Z"
        className="fill-emerald-600/25 stroke-emerald-700/50"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 12v40M24 22c4-2 8-2 16 0M22 32c6-3 14-3 20 0M24 42c4 2 8 2 16 0"
        className="stroke-emerald-700/45"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TreePhotoPlaceholder() {
  return (
    <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center rounded-t-2xl bg-gradient-to-b from-emerald-100/90 to-emerald-50/95 ring-1 ring-emerald-200/60">
      <LeafIcon className="h-16 w-16 sm:h-20 sm:w-20" />
      <p className="mt-3 px-4 text-center text-xs font-medium tracking-wide text-emerald-800/70 uppercase">
        Photo coming soon
      </p>
    </div>
  );
}

function TreeCard({ tree }: { tree: TreeOffering }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-200/90 hover:shadow-lg hover:shadow-emerald-900/10">
      <TreePhotoPlaceholder />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-emerald-950 sm:text-xl">
              {tree.commonName}
            </h3>
            <p className="mt-0.5 font-serif text-sm italic text-emerald-800/85 sm:text-base">
              {tree.scientificName}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClass[tree.difficulty]}`}
          >
            {tree.difficulty}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-emerald-900/75">{tree.tagline}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-emerald-50/80 p-3 ring-1 ring-emerald-100 sm:gap-3 sm:p-4">
          <div className="min-w-0 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/70 sm:text-xs">
              Seed cost
            </p>
            <p className="mt-1 truncate text-lg font-bold tabular-nums text-emerald-950 sm:text-2xl">
              {tree.seedCost}
            </p>
          </div>
          <div className="min-w-0 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/70 sm:text-xs">
              Buyback
            </p>
            <p className="mt-1 truncate text-lg font-bold tabular-nums text-[#0f766e] sm:text-2xl">
              {tree.buybackStarting}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-emerald-800/70 sm:text-xs">Starting at</p>
          </div>
          <div className="min-w-0 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/70 sm:text-xs">
              Timeline
            </p>
            <p className="mt-1 text-sm font-bold leading-tight text-emerald-950 sm:text-lg">
              {tree.timeline}
            </p>
            <p className="mt-0.5 text-[9px] leading-snug text-emerald-800/60 sm:text-[10px]">
              Weeks until ready for transport
            </p>
          </div>
        </div>

        <details className="mt-4 border-t border-emerald-100 pt-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-emerald-800 transition hover:text-emerald-950 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              Learn more
              <span aria-hidden className="text-xs text-emerald-600">
                ▼
              </span>
            </span>
          </summary>
          <div className="mt-3 space-y-3 text-sm text-emerald-900/80">
            <p>
              <span className="font-semibold text-emerald-950">Environment preferences: </span>
              {tree.environmentPreferences}
            </p>
            <p>
              <span className="font-semibold text-emerald-950">Care tips: </span>
              {tree.careTips}
            </p>
          </div>
        </details>

        <div className="mt-auto pt-5">
          <Link
            href="/signup"
            className="flex w-full items-center justify-center rounded-xl bg-[#1b3d3a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#152f2c]"
          >
            Get started
          </Link>
        </div>
      </div>
    </article>
  );
}

export function OurTreesSection() {
  return (
    <section
      id="our-trees"
      className="scroll-mt-24 border-y border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-14 sm:scroll-mt-28 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl md:text-5xl">Our trees</h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-900/75 sm:text-base md:text-lg">
            Invest cents on a seed today — Plantify buys your mature seedling back at the prices
            below. Think{" "}
            <span className="font-semibold text-emerald-900">
              invest $0.25 today, we buy it back for $25+ in 10–12 weeks
            </span>{" "}
            on Paulownia: a real return that stops the scroll.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {trees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      </div>
    </section>
  );
}
