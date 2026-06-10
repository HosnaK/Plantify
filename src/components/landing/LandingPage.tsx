import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";
import { BuyerInquiryForm } from "@/components/landing/BuyerInquiryForm";
import { LandingNav } from "@/components/landing/LandingNav";
import { YouTubeEmbed } from "@/components/landing/YouTubeEmbed";
import { HoverTiltBox } from "@/components/landing/HoverTiltBox";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { OurTreesSection } from "@/components/landing/OurTreesSection";
import {
  LANDING_IMAGES,
  teamPhotoUrl,
  type TeamPhotoExtension,
} from "@/components/landing/landing-image-urls";

const teamMembers = [
  {
    name: "Hosna Kachooee",
    role: "Founder & Chief Executive Officer",
    slug: "hosna-kachooee",
    linkedInUrl: "https://www.linkedin.com/in/hosna-kachooee/",
  },
  {
    name: "John Darden",
    role: "Chief Technical Officer",
    slug: "john-darden",
    teamPhotoExt: "jpeg" satisfies TeamPhotoExtension,
    linkedInUrl: "https://www.linkedin.com/in/johndarden2022/",
  },
  {
    name: "Joanna Kurylo",
    role: "Advisor",
    slug: "joanna-kurylo",
    teamPhotoExt: "jpeg" satisfies TeamPhotoExtension,
    linkedInUrl: "https://www.linkedin.com/in/joannakurylo/",
  },
  {
    name: "Eva Molina",
    role: "Chief Performance Officer",
    slug: "eva-molina",
    linkedInUrl: "https://www.linkedin.com/in/eva-i-chan/",
  },
  {
    name: "Mohsen Kachooee",
    role: "Advisor",
    slug: "mohsen-kachooee",
    linkedInUrl: "https://www.linkedin.com/in/kachooee/",
  },
  {
    name: "Jacobo Echeverry",
    role: "Programmer",
    slug: "jacobo-echeverry",
    teamPhotoExt: "webp" satisfies TeamPhotoExtension,
    linkedInUrl: "https://www.linkedin.com/in/jacoboecheverry/",
  },
  {
    name: "Will Chan",
    role: "Chief Product Manager",
    slug: "will-chan",
    usePlaceholderPhoto: true,
    linkedInUrl: "https://www.linkedin.com/in/wc1766/",
  },
  {
    name: "Jonathan Sepulveda",
    role: "Programmer",
    slug: "jonathan-sepulveda",
    teamPhotoExt: "webp" satisfies TeamPhotoExtension,
    linkedInUrl: "https://www.linkedin.com/in/jonathan-s123/",
  },
] as const satisfies ReadonlyArray<{
  name: string;
  role: string;
  slug: string;
  linkedInUrl: string;
  teamPhotoExt?: TeamPhotoExtension;
  usePlaceholderPhoto?: true;
}>;

export function LandingPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="overflow-x-hidden bg-white text-neutral-950">
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <YouTubeEmbed
            videoId="pJKSz4ieCjA"
            title="Plantify background"
            autoplay
            mute
            loop
            className="absolute left-1/2 top-1/2 h-[140%] w-[140%] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 sm:h-[120%] sm:w-[120%]"
          />
        </div>
        <div className="absolute inset-0 bg-white/85 sm:bg-white/80" />
        <LandingNav isAuthenticated={isAuthenticated} />
        <div className="relative z-10 flex h-screen w-full items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white/90 px-16 py-14 text-center shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <div className="flex justify-center">
              <PlantifyLogo
                href="/"
                className="!h-[5.5rem] sm:!h-[7rem] md:!h-[8rem]"
                priority
              />
            </div>
            <p className="mt-5 text-base leading-snug text-neutral-500 sm:mt-6 sm:text-lg">
              Green Investment Platform — One Seed at a Time
            </p>
            <a
              href="#pitch-video"
              className="mt-8 inline-block rounded-xl bg-[#1b3d3a] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#152f2c] sm:text-base"
            >
              What is Plantify?
            </a>
          </div>
        </div>
      </section>

      {/* Make Money + pitch video */}
      <section
        id="pitch-video"
        className="scroll-mt-24 mx-auto max-w-4xl px-4 py-14 sm:scroll-mt-28 sm:py-20 md:py-24"
      >
        <h2 className="text-center text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          <span className="block sm:inline">Make Money off your Houseplants.</span>{" "}
          <span className="mt-1 block sm:mt-0 sm:inline">A Few Cents into Big Return.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-neutral-500 sm:mt-6 sm:text-base md:text-lg">
          Plantify is a platform that empowers individuals to transform their savings into a
          thriving green asset portfolio. By cultivating high-demand seedlings, our growers can
          achieve substantial financial returns while contributing to a sustainable future.
        </p>
        <div className="mx-auto mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-neutral-200 shadow-sm sm:mt-10">
          <YouTubeEmbed
            videoId="MLgYE36WyWY"
            title="Plantify Pitch Video 2025"
            controls
            className="h-full w-full"
          />
        </div>
      </section>

      {/* Why Seeds? */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-16 lg:py-24">
        <HoverTiltBox className="md:justify-self-start">
          <div className="mx-auto box-border flex aspect-square w-full max-h-[min(50vh,400px)] max-w-md items-center justify-center overflow-hidden rounded-2xl border border-emerald-200/60 bg-white p-5 shadow-sm sm:p-7">
            <img
              src={LANDING_IMAGES.whySeedsPlant}
              alt="Plant and seedlings"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </HoverTiltBox>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Why Seeds?</h2>
          <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:mt-6 sm:text-base">
            Plantify gives people the opportunity to get compensated for growing high-demand
            seedlings in their homes.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Each seed is certified by official sellers, making the error-margin less than
            regular seeds.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Our chosen seeds for investments are inexpensive but can turn into, at least, up
            to 10x their value in less than a year.
          </p>
        </div>
      </section>

      <OurTreesSection />

      {/* Growing Made Easy */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-16 lg:py-24">
        <div className="order-2 text-center md:order-1 md:text-left">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Growing Made Easy with our App!
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:mt-6 sm:text-base">
            By providing an all-in-one platform for growers and buyers, we can make the process
            much easier for both parties. Communication, reports, logging, and purchase all
            takes place in one platform.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block w-full max-w-xs rounded-xl bg-[#1b3d3a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#152f2c] sm:mt-8 sm:w-auto sm:px-8 sm:text-base"
          >
            Open the grower app
          </Link>
        </div>
        <HoverTiltBox className="order-1 md:order-2 md:justify-self-end">
          <div className="mx-auto box-border flex aspect-[9/16] max-h-[min(70vh,520px)] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-emerald-200/60 bg-white p-4 shadow-sm sm:p-6">
            <img
              src={LANDING_IMAGES.growingMadeEasyApp}
              alt="Plantify grower app on a phone"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </HoverTiltBox>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-neutral-50 px-4 py-14 sm:scroll-mt-28 sm:py-20 md:py-24">
        <h2 className="mb-8 text-center text-3xl font-bold sm:mb-10 sm:text-4xl">FAQ</h2>
        <FAQAccordion />
      </section>

      {/* Team */}
      <section
        id="team"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:scroll-mt-28 sm:py-20 md:py-24"
      >
        <h2 className="mb-8 text-center text-3xl font-bold sm:mb-12 sm:text-4xl">
          Meet The Team
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                {"usePlaceholderPhoto" in member && member.usePlaceholderPhoto ? (
                  <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                    Photo
                  </div>
                ) : (
                  <img
                    src={teamPhotoUrl(
                      member.slug,
                      "teamPhotoExt" in member ? member.teamPhotoExt : "jpg",
                    )}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-bold text-neutral-950 sm:text-base">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{member.role}</p>
                <a
                  href={member.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-md bg-neutral-950 px-2.5 py-1 text-[10px] font-medium text-white transition hover:bg-neutral-800 sm:mt-3 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  LinkedIn
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Buyer inquiry */}
      <section className="border-t border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white px-4 py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl md:text-4xl">
            Interested in ordering trees?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-emerald-900/70 sm:text-base">
            Tell us what you need and we&apos;ll follow up with availability and next steps.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 sm:p-8">
          <BuyerInquiryForm />
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
        <PlantifyLogo href="/" className="mx-auto !h-14 sm:!h-16 opacity-80" />
        <p className="mt-3">
          <Link href="/login" className="underline hover:text-neutral-800">
            Sign in
          </Link>
          {" · "}
          <Link href="/signup" className="underline hover:text-neutral-800">
            Get started
          </Link>
        </p>
      </footer>
    </div>
  );
}
