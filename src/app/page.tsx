import type { Metadata } from "next";
import { Suspense } from "react";
import { AskExperience } from "@/components/AskExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GovGuide AI | Ask UK government information in normal English",
  description:
    "Ask UK government questions in normal English. GovGuide searches official GOV.UK pages and returns a plain-English summary with links to check.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

function AskFallback() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[40rem] px-4 pb-24 pt-16 text-center md:pb-28 md:pt-20">
        <h1 className="text-[2.15rem] font-bold leading-[1.15] tracking-tight md:text-5xl">
          Ask government information in normal English.
        </h1>
        <p className="mx-auto mt-4 max-w-[32rem] text-lg text-muted">
          Search official GOV.UK pages, then get a plain-English summary with links to check.
        </p>
        <p className="mt-8 text-base text-muted">Loading the question form…</p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main id="main">
      <Suspense fallback={<AskFallback />}>
        <AskExperience />
      </Suspense>
    </main>
  );
}
