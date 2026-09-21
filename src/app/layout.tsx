import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://govguide.civicailabs.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GovGuide AI | Ask UK government information in normal English",
    template: "%s | GovGuide AI",
  },
  description:
    "Ask UK government questions in normal English. GovGuide searches official GOV.UK pages and returns a plain-English summary with links to check. Independent tool. Not affiliated with GOV.UK.",
  applicationName: "GovGuide AI",
  authors: [{ name: "CivicAI Labs" }],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "GovGuide AI",
    title: "GovGuide AI | Ask UK government information in normal English",
    description:
      "Ask UK government questions in normal English. Independent tool. Not affiliated with GOV.UK.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovGuide AI | Ask UK government information in normal English",
    description:
      "Ask UK government questions in normal English. Independent tool. Not affiliated with GOV.UK.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={sourceSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("govguide.theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-[100dvh] flex-col bg-paper font-sans text-ink antialiased">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <DisclaimerBanner />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
