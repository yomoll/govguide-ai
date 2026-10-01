"use client";

import { useEffect, useRef, useState } from "react";
import { MusicNotes, Pause, Play, SkipForward } from "@phosphor-icons/react";
import { TRACKS } from "@/lib/music";

const VOLUME = 0.25;
const FADE_MS = 2500;
const FADE_STEP_MS = 100;

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);
  const playNextRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const track = TRACKS[index];

  function stopFade() {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeIn(audio: HTMLAudioElement) {
    stopFade();
    audio.volume = 0;
    const step = VOLUME / (FADE_MS / FADE_STEP_MS);
    fadeRef.current = window.setInterval(() => {
      const next = Math.min(VOLUME, audio.volume + step);
      audio.volume = next;
      if (next >= VOLUME) stopFade();
    }, FADE_STEP_MS);
  }

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    fadeIn(audio);
    try {
      await audio.play();
      setStarted(true);
    } catch {
      stopFade();
    }
  }

  function pause() {
    stopFade();
    audioRef.current?.pause();
  }

  function next() {
    playNextRef.current = true;
    setIndex((value) => (value + 1) % TRACKS.length);
  }

  useEffect(() => {
    if (!playNextRef.current) return;
    playNextRef.current = false;
    void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => stopFade, []);

  return (
    <div className="no-print fixed bottom-20 left-4 z-40 md:bottom-4">
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
      />
      <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 text-ink shadow-[0_12px_32px_-12px_rgb(11_12_12/0.4)]">
        <button
          type="button"
          onClick={() => (playing ? pause() : void play())}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            started ? "bg-brand text-white hover:bg-brand-hover" : "text-brand hover:bg-warn-bg"
          }`}
          aria-label={playing ? "Pause background music" : "Play background music"}
          title={started ? undefined : "Play background music"}
        >
          {playing ? (
            <Pause size={18} weight="fill" aria-hidden="true" />
          ) : started ? (
            <Play size={18} weight="fill" aria-hidden="true" />
          ) : (
            <MusicNotes size={22} weight="bold" aria-hidden="true" />
          )}
        </button>
        {started ? (
          <>
            <p className="max-w-[9.5rem] truncate px-1.5 text-sm sm:max-w-[15rem]">
              <span className="font-semibold">{track.title}</span> <span className="text-muted">{track.year}</span>
            </p>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-warn-bg"
              aria-label="Next song"
            >
              <SkipForward size={18} weight="fill" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
