import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-[40rem] px-4 py-16 text-center">
      <p className="text-sm font-bold text-brand">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">This page is not on GovGuide</h1>
      <p className="mx-auto mt-4 max-w-[32rem] text-lg text-muted">
        The address may be mistyped, or the page may have moved. You can ask a question from the homepage instead.
      </p>
      <p className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center bg-cta px-5 py-2.5 font-bold text-on-cta hover:bg-cta-hover"
        >
          Ask a question
        </Link>
      </p>
    </main>
  );
}
