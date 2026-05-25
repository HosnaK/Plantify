import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";
import { LandingNav } from "@/components/landing/LandingNav";
import { YouTubeEmbed } from "@/components/landing/YouTubeEmbed";
import { HoverTiltVisual } from "@/components/landing/HoverTiltVisual";
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
    <div className="bg-white text-neutral-950">
      {/* Screenshot 1 — Hero with YouTube background */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <YouTubeEmbed
            videoId="pJKSz4ieCjA"
            title="Plantify background"
            autoplay
            mute
            loop
            className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="absolute inset-0 bg-white/80" />
        <LandingNav />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl items-center justify-center px-4 pb-16 pt-24">
          <div className="w-full max-w-xl rounded-sm bg-white px-8 py-12 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)] sm:px-14 sm:py-14">
            <div className="flex justify-center">
              <PlantifyLogo className="!h-14 sm:!h-16" priority />
            </div>
            <p className="mt-6 text-lg text-neutral-500 sm:text-xl">
              Green Investment Platform One Seed at a Time
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-[#f97316] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#ea580c]"
            >
              What is Plantify?
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot 2 — Make Money + pitch video */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
        <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Make Money off your Houseplants.
          <br />
          A Few Cents into Big Return.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg">
          Plantify is a platform that empowers individuals to transform their savings into a
          thriving green asset portfolio. By cultivating high-demand seedlings, our growers can
          achieve substantial financial returns while contributing to a sustainable future.
        </p>
        <div className="mx-auto mt-10 aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-neutral-200 shadow-sm">
          <YouTubeEmbed
            videoId="MLgYE36WyWY"
            title="Plantify Pitch Video 2025"
            autoplay
            mute={false}
            controls
            className="h-full w-full"
          />
        </div>
      </section>

      {/* Screenshot 3 — Why Seeds? */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:grid-cols-2 sm:gap-16 sm:py-24">
        <HoverTiltVisual
          src="/landing/plant-visual.png"
          alt="Plant in a pot"
          className="mx-auto sm:mx-0"
        />
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Why Seeds?</h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">
            Plantify gives people the opportunity to get compensated for growing high-demand
            seedlings in their homes.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Each seed is certified by official sellers, making the error-margin less than
            regular seeds.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Our chosen seeds for investments are inexpensive but can turn into, at least, up
            to 10x their value in less than a year.
          </p>
        </div>
      </section>

      {/* Screenshot 4 — Growing Made Easy */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:grid-cols-2 sm:gap-16 sm:py-24">
        <div className="order-2 sm:order-1">
          <h2 className="text-3xl font-bold sm:text-4xl">Growing Made Easy with our App!</h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">
            By providing an all-in-one platform for growers and buyers, we can make the process
            much easier for both parties. Communication, reports, logging, and purchase all
            takes place in one platform.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-[#1b3d3a] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#152f2c]"
          >
            Open the grower app
          </Link>
        </div>
        <div className="order-1 flex justify-center sm:order-2">
          <HoverTiltVisual
            src="/landing/phone-mockup.png"
            alt="Plantify app on a phone"
            className="max-w-sm sm:max-w-md"
          />
        </div>
      </section>

      {/* Screenshot 5 — FAQ */}
      <section id="faq" className="bg-neutral-50 px-4 py-20 sm:py-24">
        <h2 className="mb-10 text-center text-4xl font-bold">FAQ</h2>
        <FAQAccordion />
      </section>

      {/* Screenshot 6 — Team */}
      <section id="team" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">Meet The Team</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="flex aspect-square items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                Photo
              </div>
              <div className="p-4">
                <h3 className="font-bold text-neutral-950">{member.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{member.role}</p>
                <div className="mt-3 inline-block rounded-md bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white">
                  LinkedIn
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
        <PlantifyLogo className="mx-auto !h-8 opacity-80" />
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
