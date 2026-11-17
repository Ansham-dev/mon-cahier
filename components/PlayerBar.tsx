"use client";

import { useEffect, useRef, useState } from "react";
import { useLofi } from "@/lib/audio";
import { useProgress } from "@/lib/progress";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export default function PlayerBar() {
  const { musicOn, rainOn, volume, setVolume, toggleMusic, toggleRain } = useLofi();
  const { addMinutes, minutesToday, p } = useProgress();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const lastTickMinute = useRef(0);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (mode === "focus") {
            setMode("break");
            setRemaining(BREAK);
            addMinutes(25);
          } else {
            setMode("focus");
            setRemaining(FOCUS);
          }
          return mode === "focus" ? BREAK : FOCUS;
        }
        if (r % 60 === 0 && mode === "focus") {
          lastTickMinute.current += 1;
          if (lastTickMinute.current % 5 === 0) addMinutes(5);
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running, mode, addMinutes]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const goalPct = Math.min(100, Math.round((minutesToday / p.goalMinutes) * 100));

  return (
    <>
      {open && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md pixel-panel-dark p-4 enter-anim">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-[var(--gold)]">POMODORO</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--rose)] hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-pixel text-xl w-28">
              {mm}:{ss}
            </div>
            <button className="pixel-btn-sm px-3 py-2 text-sm" onClick={() => setRunning((r) => !r)}>
              {running ? (mode === "focus" ? "Pause ⏸" : "Breaking…") : "Start ▶"}
            </button>
            <button
              className="pixel-btn-sm px-3 py-2 text-sm"
              onClick={() => {
                setRunning(false);
                setMode("focus");
                setRemaining(FOCUS);
              }}
            >
              Reset
            </button>
            <span className="text-xs text-[var(--dusty-pink)]">
              {mode === "focus" ? "25 min focus" : "5 min break"}
            </span>
          </div>
          <div className="mt-4 text-xs text-[var(--rose)]">
            Daily goal: {minutesToday}/{p.goalMinutes} min ({goalPct}%)
          </div>
          <div className="h-3 mt-1 progress-track">
            <div className="h-full progress-fill" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-40 pixel-panel-dark !border-x-0 !border-b-0 py-2 px-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleMusic}
            className={`pixel-btn-sm px-3 py-2 text-xs sm:text-sm whitespace-nowrap ${musicOn ? "brightness-125" : ""}`}
            title="Lofi instrumental"
          >
            {musicOn ? "🎵 Lofi on" : "🎵 Lofi"}
          </button>
          <button
            onClick={toggleRain}
            className={`pixel-btn-sm px-3 py-2 text-xs sm:text-sm whitespace-nowrap ${rainOn ? "brightness-125" : ""}`}
            title="Rain sounds"
          >
            {rainOn ? "🌧️ Rain on" : "🌧️ Rain"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-[var(--gold)]"
            aria-label="Volume"
          />
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-[var(--rose)]">Study timer</span>
            <button
              onClick={() => setOpen((o) => !o)}
              className="pixel-btn-sm px-3 py-2 text-xs sm:text-sm"
            >
              ⏳ {mm}:{ss}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
