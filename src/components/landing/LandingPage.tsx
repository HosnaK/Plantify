import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";
import { LandingNav } from "@/components/landing/LandingNav";
import { YouTubeEmbed } from "@/components/landing/YouTubeEmbed";
import { HoverTiltBox, ImagePlaceholder } from "@/components/landing/HoverTiltBox";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

const teamMembers = [
  { name: "Hosna Kachooei", role: "Founder & Chief Executive Officer" },
  { name: "John Darden", role: "Chief Technical Officer" },
  { name: "Joanna Kurylo", role: "Advisor" },
  { name: "Eva Molina", role: "Chief Performance Officer" },
  { name: "Mohsen Kachooei", role: "Advisor" },
  { name: "Jacobo Echeverry", role: "Programmer" },
  { name: "Will Chan", role: "Chief Product Manager" },
  { name: "Jonathan Sepulveda", role: "Programmer" },
];

export function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-white text-neutral-950">
      {/* Hero */}
      <section className="relative min-h-[100dvh] overflow-hidden sm:min-h-[92vh]">
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
        <LandingNav />
        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl items-center justify-center px-4 pb-12 pt-28 sm:min-h-[92vh] sm:pb-16 sm:pt-32">
          <div className="w-full max-w-xl rounded-sm bg-white px-5 py-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12 md:px-14 md:py-14">
            <div className="flex justify-center">
              <PlantifyLogo className="!h-[5.5rem] sm:!h-[7rem] md:!h-[8rem]" priority />
            </div>
            <p className="mt-4 text-base leading-snug text-neutral-500 sm:mt-6 sm:text-lg md:text-xl">
              Green Investment Platform One Seed at a Time
            </p>
            <a
              href="#pitch-video"
              className="mt-6 inline-block w-full max-w-xs rounded-xl bg-[#f97316] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#ea580c] sm:mt-8 sm:w-auto sm:px-8 sm:text-base"
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
          <ImagePlaceholder aspect="square" caption="Plant visual" />
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
          <ImagePlaceholder aspect="phone" caption="App mockup" />
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
              <div className="flex aspect-square items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                Photo
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-bold text-neutral-950 sm:text-base">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{member.role}</p>
                <div className="mt-2 inline-block rounded-md bg-neutral-950 px-2.5 py-1 text-[10px] font-medium text-white sm:mt-3 sm:px-3 sm:py-1.5 sm:text-xs">
                  LinkedIn
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
        <PlantifyLogo className="mx-auto !h-14 sm:!h-16 opacity-80" />
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
