"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Who buys these seedlings?",
    answer:
      "Companies with large carbon footprints have to offset them by ways of contributing to the environment. Planting trees is one of the many ways they can get carbon credits. The market for carbon credits in the agriculture, forestry, and land use sectors was valued at around $6.3 billion in 2023 and is projected to reach $97.1 billion by 2033.",
  },
  {
    question: "What are high-demand seedlings?",
    answer:
      "High-demand seedlings are young plants that are particularly sought after due to their environmental benefits, economic value, or adaptability to various climates. Some examples of these trees include: Maclura Pomifera, Paulownia, Dalbergia melanoxylon, and many more.",
  },
  {
    question: "How much can I earn with Plantify?",
    answer:
      "Depending on the type of seedling you grow and the number that you manage, your revenue would alter. For example, if you choose to grow the Agarwood seed, you would be buying the seeds at $3/per seed and selling them back at $20-100/per seedling. Our average growth period for this plant is 9 months. Therefore, if you grew 10 of these seedlings, you would be making $200-1000 from these temporary houseplants.",
  },
  {
    question: "Are these seedlings hard to grow?",
    answer:
      "Each seed comes with carefully packaged instructions for growers. We have plant doctors at hand and 24/7 customer support if any problem arises. The reports you would be sending each month will also be monitored by professionals and you will be reached out to if something looks off. We've worked to make the process as easy as possible for our growers, plants are supposed to be stress-relievers after all.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-neutral-100/90 px-2 py-2 sm:px-4 sm:py-4">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-b border-neutral-200/80 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start gap-3 px-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="mt-0.5 shrink-0 text-lg leading-none text-neutral-400">
                {isOpen ? "×" : "+"}
              </span>
              <span className="text-base font-semibold text-neutral-950 sm:text-lg">
                {item.question}
              </span>
            </button>
            {isOpen && (
              <p className="px-4 pb-5 pl-10 text-sm leading-relaxed text-neutral-600 sm:text-base">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
