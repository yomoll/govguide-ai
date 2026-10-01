"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  CaretLeft,
  CaretRight,
  Pause,
  Play,
} from "@phosphor-icons/react";
import { EXAMPLE_QUESTIONS } from "@/lib/examples";
import type { AskAnswer, StreamEvent } from "@/lib/types";
import { AnswerPanel } from "./AnswerPanel";

type Stage = "idle" | "interpret" | "search" | "retrieve" | "answer" | "error";

const STAGE_LABEL: Record<Exclude<Stage, "idle" | "answer">, string> = {
  interpret: "Understanding your question",
  search: "Searching GOV.UK content",
  retrieve: "Reading official pages",
  error: "Something went wrong",
};

const ROTATE_MS = 6000;

export function AskExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [question, setQuestion] = useState(initial);
  const [stage, setStage] = useState<Stage>(initial ? "interpret" : "idle");
  const [statusDetail, setStatusDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AskAnswer | null>(null);
  const askedRef = useRef<string | null>(null);

  const [exampleIndex, setExampleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [pinnedQuestion, setPinnedQuestion] = useState("");
  const [heroInView, setHeroInView] = useState(true);
  const [footerInView, setFooterInView] = useState(false);
  const heroFormRef = useRef<HTMLFormElement>(null);

  const example = EXAMPLE_QUESTIONS[exampleIndex];
  const autoplay = !paused && !engaged && question.trim() === "";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => {
      setExampleIndex((index) => (index + 1) % EXAMPLE_QUESTIONS.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, exampleIndex]);

  useEffect(() => {
    const form = heroFormRef.current;
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === form) setHeroInView(entry.isIntersecting);
        else setFooterInView(entry.isIntersecting);
      }
    });
    if (form) observer.observe(form);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function stepExample(delta: number) {
    setExampleIndex((index) => (index + delta + EXAMPLE_QUESTIONS.length) % EXAMPLE_QUESTIONS.length);
  }

  useEffect(() => {
    if (initial && askedRef.current !== initial) {
      void submitQuestion(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  useEffect(() => {
    if (!answer) return;
    const node = document.getElementById("answer");
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [answer]);

  async function submitQuestion(value: string) {
    const cleaned = value.replace(/\s+/g, " ").trim();
    if (cleaned.length < 8) {
      setError("Enter a question of at least a few words.");
      setStage("error");
      return;
    }

    askedRef.current = cleaned;
    setQuestion(cleaned);
    setError(null);
    setAnswer(null);
    setStage("interpret");
    setStatusDetail("");
    router.replace(`/?q=${encodeURIComponent(cleaned)}`);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cleaned }),
      });
      if (!response.ok || !response.body) {
        throw new Error("The search could not start. Try again in a moment.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.split("\n").find((item) => item.startsWith("data: "));
          if (!line) continue;
          const event = JSON.parse(line.slice(6)) as StreamEvent;
          if (event.stage === "interpret") {
            setStage("interpret");
            setStatusDetail(event.interpretation.interpretation);
          } else if (event.stage === "search") {
            setStage("search");
            setStatusDetail(`${event.hitCount} matching pages found across ${event.queries.length} searches.`);
          } else if (event.stage === "retrieve") {
            setStage("retrieve");
            setStatusDetail(event.titles.slice(0, 3).join("; "));
          } else if (event.stage === "answer") {
            setAnswer(event.answer);
            setStage("answer");
          } else if (event.stage === "error") {
            throw new Error(event.message);
          }
        }
      }
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "The question could not be answered.");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void submitQuestion(question);
  }

  function onPinnedSubmit(event: FormEvent) {
    event.preventDefault();
    const value = pinnedQuestion;
    setPinnedQuestion("");
    void submitQuestion(value);
  }

  const busy = stage === "interpret" || stage === "search" || stage === "retrieve";
  const showPinned = !heroInView && !footerInView;
  const controlClass =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0b0c0c] backdrop-blur hover:bg-white";

  return (
    <div>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 md:pb-20 md:pt-16">
          <div className="mx-auto max-w-[44rem] text-center">
            <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-tight md:text-[3.5rem]">
              Ask government information in normal English.
            </h1>
            <p className="mx-auto mt-4 max-w-[34rem] text-lg text-muted md:text-xl">
              Search official GOV.UK pages, then get a plain-English summary with links to check.
            </p>
          </div>

          <div
            className="relative mt-10 h-[33rem] overflow-hidden rounded-3xl bg-warn-bg sm:h-[30rem] md:h-[34rem]"
            role="group"
            aria-roledescription="carousel"
            aria-label="Example questions"
            onFocus={() => setEngaged(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
            }}
          >
            {EXAMPLE_QUESTIONS.map((item, index) => (
              <Image
                key={item.image}
                src={item.image}
                alt={index === exampleIndex ? item.alt : ""}
                aria-hidden={index === exampleIndex ? undefined : true}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 992px, 100vw"
                className={`object-cover transition-[opacity,transform] duration-[1200ms] ease-out ${
                  index === exampleIndex ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"
              aria-hidden="true"
            />

            <form
              ref={heroFormRef}
              onSubmit={onSubmit}
              className="absolute inset-x-3 top-3 rounded-2xl bg-surface p-3 text-left shadow-[0_18px_50px_-12px_rgb(11_12_12/0.45)] focus-within:ring-[3px] focus-within:ring-[var(--focus)] md:inset-x-12 md:top-12 md:p-4"
            >
              <label htmlFor="question" className="block px-1 text-base font-bold">
                Your question
              </label>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
                <textarea
                  id="question"
                  name="question"
                  rows={2}
                  required
                  minLength={8}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      void submitQuestion(question);
                    }
                  }}
                  aria-describedby="question-help"
                  className="min-h-[5.25rem] w-full resize-none sm:min-h-[3.5rem] border-0 bg-transparent px-1 py-1 text-[1.1875rem] leading-snug text-ink outline-none placeholder:text-muted focus-visible:shadow-none"
                  placeholder={`Try: “${example.text}”`}
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2 self-end rounded-full bg-cta px-5 py-3 font-bold text-on-cta hover:bg-cta-hover active:scale-[0.98] disabled:opacity-60"
                  disabled={busy}
                >
                  Ask
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="absolute inset-x-3 bottom-3 flex flex-col items-end gap-2 sm:flex-row sm:justify-between sm:gap-3 md:inset-x-12 md:bottom-8">
              <button
                type="button"
                onClick={() => void submitQuestion(example.text)}
                className="order-last inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white/90 px-4 py-2 text-base font-semibold text-[#0b0c0c] backdrop-blur hover:bg-white sm:order-none sm:w-auto"
              >
                Ask this example
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2">
                <span className="mr-1 text-sm font-semibold tabular-nums text-white" aria-hidden="true">
                  {exampleIndex + 1} / {EXAMPLE_QUESTIONS.length}
                </span>
                <button type="button" className={controlClass} onClick={() => stepExample(-1)} aria-label="Previous example">
                  <CaretLeft size={18} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={controlClass}
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? "Play the example questions" : "Pause the example questions"}
                >
                  {paused ? (
                    <Play size={18} weight="fill" aria-hidden="true" />
                  ) : (
                    <Pause size={18} weight="fill" aria-hidden="true" />
                  )}
                </button>
                <button type="button" className={controlClass} onClick={() => stepExample(1)} aria-label="Next example">
                  <CaretRight size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="sr-only" aria-live={autoplay ? "off" : "polite"}>
              Example {exampleIndex + 1} of {EXAMPLE_QUESTIONS.length}: {example.text}
            </p>
          </div>

          <p id="question-help" className="mx-auto mt-4 max-w-[44rem] text-center text-base text-muted">
            Write it the way you would ask a person. Do not include National Insurance numbers, passwords, or other personal details.
          </p>
        </div>
      </section>

      <form
        onSubmit={onPinnedSubmit}
        inert={!showPinned}
        className={`no-print fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-2xl px-4 transition-[opacity,transform] duration-300 ${
          showPinned ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface py-2 pl-5 pr-2 shadow-[0_18px_50px_-12px_rgb(11_12_12/0.35)] focus-within:ring-[3px] focus-within:ring-[var(--focus)]">
          <label htmlFor="pinned-question" className="sr-only">
            Ask another question
          </label>
          <input
            id="pinned-question"
            type="text"
            value={pinnedQuestion}
            onChange={(event) => setPinnedQuestion(event.target.value)}
            placeholder="Ask another question…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[1.0625rem] text-ink outline-none placeholder:text-muted focus-visible:shadow-none"
          />
          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cta text-on-cta hover:bg-cta-hover disabled:opacity-60"
            disabled={busy}
            aria-label="Ask"
          >
            <ArrowUp size={20} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </form>

      <div id="answer" className="mx-auto max-w-3xl scroll-mt-6 px-4 pb-12">
        {stage !== "idle" && stage !== "answer" ? (
          <div className="border border-line bg-surface p-6" aria-live="polite">
            <p className="text-base font-bold text-accent">{STAGE_LABEL[stage]}</p>
            <div className="mt-4 space-y-3" aria-hidden="true">
              <div className="h-5 w-2/3 animate-pulse bg-warn-bg" />
              <div className="h-5 w-full animate-pulse bg-warn-bg" />
              <div className="h-5 w-5/6 animate-pulse bg-warn-bg" />
            </div>
            {statusDetail ? <p className="mt-4 text-base text-muted">{statusDetail}</p> : null}
            {error ? (
              <p className="mt-4 text-base font-bold text-warn-ink" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}

        {answer && stage === "answer" ? <AnswerPanel answer={answer} /> : null}
      </div>
    </div>
  );
}
