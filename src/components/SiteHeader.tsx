"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Ask" },
  { href: "/saved", label: "Saved" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="no-print bg-header text-header-ink">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-header-ink sm:gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-brand">
            <Compass size={20} weight="bold" aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap text-[1.1rem] font-bold tracking-tight sm:text-[1.2rem]">GovGuide AI</span>
          <UnionFlag />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[1.05rem] font-semibold ${
                  active ? "bg-white text-brand" : "text-header-ink hover:bg-black/10"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function UnionFlag() {
  return (
    <svg
      viewBox="0 0 60 30"
      className="h-3.5 w-7 shrink-0 ring-1 ring-white/80 sm:h-4 sm:w-8"
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id="union-flag-frame">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="union-flag-diagonals">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#union-flag-frame)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#union-flag-diagonals)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <details className="relative md:hidden">
      <summary className="cursor-pointer list-none border border-white/70 px-3 py-1.5 text-sm font-semibold">
        Menu
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-44 border border-line bg-surface p-2 text-ink">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 text-sm ${pathname === link.href ? "bg-accent-soft font-semibold" : "hover:bg-warn-bg"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
