"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useProgress, levelOf } from "@/lib/progress";
import { useLofi } from "@/lib/audio";

/* deterministic pseudo-random */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Phase = "night" | "dawn" | "day" | "dusk";

const SKIES: Record<Phase, string> = {
  night: "linear-gradient(180deg, #120c22 0%, #1a1230 35%, #2c1a3e 65%, #3b2550 100%)",
  dawn: "linear-gradient(180deg, #3a2a5e 0%, #6b4a7e 30%, #b06a8a 55%, #d98a6a 78%, #eab06a 100%)",
  day: "linear-gradient(180deg, #6bb6d9 0%, #8fcbe3 40%, #b8dff0 70%, #d8ecf7 100%)",
  dusk: "linear-gradient(180deg, #241438 0%, #3b1e4e 30%, #7a3550 58%, #b0573f 78%, #d9773a 92%, #e89a4a 100%)",
};

const WASH: Record<Phase, string> = {
  night: "transparent",
  dawn: "rgba(232,154,106,0.08)",
  day: "rgba(255,244,214,0.13)",
  dusk: "rgba(217,119,58,0.06)",
};

function useDayPhase(): Phase {
  const [phase, setPhase] = useState<Phase>("night");
  useEffect(() => {
    const calc = (): Phase => {
      const h = new Date().getHours();
      if (h >= 6 && h < 9) return "dawn";
      if (h >= 9 && h < 17) return "day";
      if (h >= 17 && h < 20) return "dusk";
      return "night";
    };
    setPhase(calc());
    const iv = setInterval(() => setPhase(calc()), 60000);
    return () => clearInterval(iv);
  }, []);
  return phase;
}

function StarField({ faint }: { faint: boolean }) {
  const stars = useMemo(() => {
    const rnd = seeded(42);
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: rnd() * 98,
      top: rnd() * 60,
      size: rnd() > 0.8 ? 3 : 2,
      dur: 1.5 + rnd() * 3,
      delay: rnd() * 3,
    }));
  }, []);
  return (
    <div className="absolute inset-0 transition-opacity duration-[2000ms]" style={{ opacity: faint ? 0.35 : 1 }}>
      {stars.map((s) => (
        <span
          key={s.id}
          className="twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Clouds() {
  const clouds = useMemo(() => {
    const rnd = seeded(11);
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: 4 + rnd() * 26,
      scale: 0.7 + rnd() * 0.8,
      dur: 70 + rnd() * 90,
      delay: -rnd() * 120,
    }));
  }, []);
  return (
    <>
      {clouds.map((c) => (
        <div
          key={c.id}
          className="cloud"
          style={{
            top: `${c.top}%`,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <svg viewBox="0 0 80 26" width="80" height="26" className="pixel-art opacity-80" style={{ transform: `scale(${c.scale})` }}>
            <rect x="18" y="8" width="44" height="12" rx="6" fill="#ffffff" />
            <rect x="8" y="14" width="60" height="8" rx="4" fill="#f4faff" />
            <rect x="28" y="2" width="22" height="10" rx="5" fill="#ffffff" />
          </svg>
        </div>
      ))}
    </>
  );
}

function Rain() {
  const drops = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      height: 12 + rnd() * 16,
      dur: 0.9 + rnd() * 1.1,
      delay: rnd() * 2,
      op: 0.25 + rnd() * 0.3,
    }));
  }, []);
  return (
    <>
      {drops.map((d) => (
        <span
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            height: d.height,
            opacity: d.op,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function EiffelTower() {
  return (
    <svg viewBox="0 0 60 110" className="pixel-art absolute right-[9%] bottom-[16%] h-[34%]" aria-hidden>
      <g fill="#20142e">
        <rect x="28" y="2" width="4" height="14" />
        <polygon points="24,16 36,16 34,26 26,26" />
        <polygon points="8,96 52,96 46,70 34,28 30,28 26,28 14,70" opacity="0.35" />
        <path
          d="M26 28 C 22 46, 14 66, 6 92 L 12 92 C 18 70, 24 52, 28 38 Z"
          fill="#20142e"
        />
        <path
          d="M34 28 C 38 46, 46 66, 54 92 L 48 92 C 42 70, 36 52, 32 38 Z"
          fill="#20142e"
        />
        <rect x="20" y="44" width="20" height="4" />
        <rect x="16" y="66" width="28" height="5" />
        <rect x="26" y="26" width="8" height="8" />
        <rect x="14" y="64" width="32" height="3" />
        <rect x="4" y="90" width="52" height="4" />
        <rect x="10" y="94" width="40" height="3" />
        <rect x="28" y="0" width="4" height="3" fill="#ffd98a" />
        <rect x="25" y="30" width="10" height="2" fill="#3b2550" />
      </g>
      <g fill="#ffd98a">
        <rect x="29" y="6" width="2" height="2" />
        <rect x="22" y="45" width="2" height="2" />
        <rect x="36" y="45" width="2" height="2" />
        <rect x="18" y="67" width="2" height="2" />
        <rect x="40" y="67" width="2" height="2" />
      </g>
    </svg>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);
  const h = now ? now.getHours() : 21;
  const m = now ? now.getMinutes() : 0;
  const hourAngle = (h % 12) * 30 + m * 0.5;
  const minAngle = m * 6;
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 pixel-art" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#4a3226" />
      <circle cx="12" cy="12" r="9" fill="#fdf3e3" />
      <line x1="12" y1="12" x2="12" y2="6" stroke="#4a3226" strokeWidth="1.6" transform={`rotate(${hourAngle} 12 12)`} />
      <line x1="12" y1="12" x2="12" y2="4" stroke="#6d2e46" strokeWidth="1" transform={`rotate(${minAngle} 12 12)`} />
      <circle cx="12" cy="12" r="1" fill="#4a3226" />
    </svg>
  );
}

function Bookshelf() {
  const bookColors = ["#a5484d", "#4f6d8f", "#7a5c8f", "#b0793a", "#5d7a4f", "#8f4f6d", "#9c6b4f"];
  return (
    <div className="absolute left-[2%] bottom-0 h-[46%] w-[15%] min-w-[90px]">
      <div className="w-full h-full border-4 border-[#4a3226] bg-[#7a5c4e] rounded-t-sm relative">
        {[0, 1, 2].map((shelf) => (
          <div key={shelf} className="absolute inset-x-1" style={{ top: `${8 + shelf * 31}%`, bottom: `${38 - shelf * 31}%` }}>
            <div className="flex items-end gap-[3px] h-full pb-[3px] px-[3px]">
              {bookColors.map((c, i) => {
                const skip = (shelf + i) % 5 === 0;
                if (skip) return null;
                return (
                  <div
                    key={i}
                    className="w-[9%] h-[88%] rounded-t-[2px]"
                    style={{ background: c, minHeight: 14 }}
                  />
                );
              })}
            </div>
            <div className="absolute left-0 right-0 bottom-[-3px] h-[4px] bg-[#4a3226]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Student() {
  return (
    <svg viewBox="0 0 34 34" className="pixel-art w-full h-full breathe" aria-hidden>
      <rect x="12" y="4" width="10" height="4" fill="#3a2a20" />
      <rect x="10" y="7" width="14" height="6" fill="#3a2a20" />
      <rect x="10" y="7" width="3" height="10" fill="#3a2a20" />
      <rect x="21" y="7" width="3" height="8" fill="#3a2a20" />
      <rect x="13" y="9" width="8" height="7" fill="#e8b48c" />
      <rect x="9" y="7" width="2" height="5" fill="#20142e" />
      <rect x="23" y="7" width="2" height="5" fill="#20142e" />
      <rect x="9" y="4" width="16" height="2" fill="#20142e" />
      <rect x="10" y="5" width="14" height="1" fill="#6d2e46" />
      <rect x="14" y="12" width="2" height="2" fill="#20142e" />
      <rect x="19" y="12" width="2" height="2" fill="#20142e" />
      <rect x="16" y="15" width="2" height="1" fill="#c97b6a" />
      <rect x="13" y="14" width="1" height="1" fill="#e09a8a" />
      <rect x="21" y="14" width="1" height="1" fill="#e09a8a" />
      <rect x="11" y="16" width="12" height="10" fill="#6d2e46" />
      <rect x="9" y="17" width="2" height="7" fill="#6d2e46" />
      <rect x="23" y="17" width="2" height="7" fill="#6d2e46" />
      <rect x="13" y="17" width="8" height="2" fill="#d9a441" opacity="0.85" />
      <rect x="24" y="14" width="4" height="14" fill="#4a3226" />
      <rect x="25" y="15" width="2" height="12" fill="#7a5c4e" />
    </svg>
  );
}

function SleepingCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 22" className={`pixel-art ${className}`} aria-hidden>
      <g>
        <path
          className="cat-tail"
          d="M36 16 C38 14, 38 10, 36 9 L35 11 C36 12, 36 14, 34 16 Z"
          fill="#c98a5a"
        />
        <rect x="4" y="9" width="26" height="9" rx="1" fill="#c98a5a" />
        <rect x="4" y="9" width="26" height="2" fill="#dfa876" />
        <rect x="26" y="5" width="10" height="10" rx="1" fill="#c98a5a" />
        <rect x="26" y="3" width="3" height="3" fill="#c98a5a" />
        <rect x="33" y="3" width="3" height="3" fill="#c98a5a" />
        <rect x="27" y="4" width="1" height="1" fill="#8a5a3b" />
        <rect x="34" y="4" width="1" height="1" fill="#8a5a3b" />
        <rect x="28" y="9" width="2" height="1" fill="#5c3a26" />
        <rect x="33" y="9" width="2" height="1" fill="#5c3a26" />
        <rect x="31" y="11" width="1" height="1" fill="#8a4f5c" />
        <rect x="10" y="9" width="1" height="9" fill="#a86e44" />
        <rect x="16" y="9" width="1" height="9" fill="#a86e44" />
        <rect x="36" y="1" width="3" height="1" fill="#f5e6d3" className="bob" />
      </g>
    </svg>
  );
}

function DeskObjects() {
  return (
    <svg viewBox="0 0 220 60" className="w-full pixel-art" aria-hidden>
      <g>
        <rect x="6" y="44" width="30" height="7" fill="#a5484d" />
        <rect x="8" y="46" width="26" height="2" fill="#fdf3e3" opacity="0.6" />
        <rect x="10" y="37" width="28" height="7" fill="#4f6d8f" />
        <rect x="12" y="39" width="24" height="2" fill="#fdf3e3" opacity="0.6" />
        <rect x="8" y="30" width="26" height="7" fill="#7a5c8f" />
      </g>
      <g>
        <rect x="58" y="42" width="30" height="10" fill="#fdf3e3" />
        <rect x="59" y="43" width="14" height="8" fill="#fff8ec" stroke="#c9b28f" strokeWidth="0.5" />
        <rect x="74" y="43" width="13" height="8" fill="#fff8ec" stroke="#c9b28f" strokeWidth="0.5" />
        <g stroke="#b7a6d9" strokeWidth="0.7">
          <line x1="62" y1="46" x2="70" y2="46" />
          <line x1="62" y1="48" x2="69" y2="48" />
          <line x1="77" y1="46" x2="84" y2="46" />
        </g>
      </g>
      <rect x="92" y="44" width="12" height="2" fill="#20142e" transform="rotate(-20 92 44)" />
      <g>
        <rect x="118" y="40" width="10" height="14" fill="#fdf3e3" />
        <rect x="118" y="40" width="10" height="3" fill="#6d2e46" />
        <path d="M128 44 h3 a3 3 0 0 1 0 6 h-3" fill="none" stroke="#fdf3e3" strokeWidth="1.5" />
        <rect x="120" y="35" width="2" height="2" fill="#f5e6d3" className="steam-puff" />
        <rect x="124" y="34" width="2" height="2" fill="#f5e6d3" className="steam-puff" style={{ animationDelay: "1.2s" }} />
      </g>
      <g>
        <rect x="142" y="36" width="4" height="18" fill="#e8b4b8" />
        <rect x="143" y="32" width="2" height="4" fill="#4a3226" />
        <ellipse cx="144" cy="30" rx="3" ry="4" fill="#f5c76e" className="candle-flame" />
        <ellipse cx="144" cy="30" rx="1.4" ry="2" fill="#fff1c4" className="candle-flame" />
      </g>
      <g>
        <rect x="160" y="40" width="14" height="14" fill="#b0793a" />
        <rect x="160" y="40" width="14" height="3" fill="#8a5a3b" />
        <g className="plant-sway">
          <path d="M167 40 C 165 28, 160 26, 158 24 C 164 26, 168 32, 168 40 Z" fill="#5d7a4f" />
          <path d="M167 40 C 169 26, 172 24, 175 22 C 172 28, 169 32, 168 40 Z" fill="#6f8f5c" />
          <path d="M167 40 C 167 28, 167 24, 167 20 C 168 26, 168 33, 168 40 Z" fill="#576e47" />
        </g>
      </g>
      <g>
        <rect x="190" y="36" width="20" height="18" fill="#4f6d8f" />
        <rect x="192" y="38" width="10" height="8" fill="#c9d9e8" />
        <rect x="193" y="39" width="8" height="2" fill="#6d2e46" />
        <rect x="193" y="42" width="5" height="2" fill="#8a5a3b" />
        <circle cx="205" cy="48" r="2.5" fill="#fdf3e3" />
        <circle cx="198" cy="50" r="2" fill="#fdf3e3" />
      </g>
    </svg>
  );
}

function FairyLights({ on }: { on: boolean }) {
  if (!on) return null;
  const colors = ["#f5c76e", "#e8b4b8", "#b7a6d9", "#a8d8b9"];
  return (
    <div className="absolute top-[6%] inset-x-0 z-30 pointer-events-none">
      <svg viewBox="0 0 400 30" className="w-full h-8">
        <path d="M0 6 Q 100 26 200 6 T 400 6" fill="none" stroke="#5a4a3a" strokeWidth="1.2" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i + 0.5) / 12;
          const x = t * 400;
          const y2 = t <= 0.5 ? 6 + 20 * Math.sin(Math.PI * (t * 2)) * 0.5 : 6 + 20 * Math.sin(Math.PI * (t * 2));
          return (
            <g key={i}>
              <circle cx={x} cy={Math.min(26, y2 + 4)} r="3" fill={colors[i % 4]} className="warm-glow" style={{ animationDelay: `${i * 0.3}s` }} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const SKY_LABEL: Record<Phase, string> = {
  night: "A cozy Parisian study room at night",
  dawn: "A cozy Parisian study room at dawn",
  day: "A cozy Parisian study room during the day",
  dusk: "A cozy Parisian study room at dusk",
};

export default function StudyRoom() {
  const { p, level, xpInLevel, xpForLevel, minutesToday } = useProgress();
  const { rainOn } = useLofi();
  const phase = useDayPhase();
  const [menuOpen, setMenuOpen] = useState(false);
  const [decorOn, setDecorOn] = useState<Record<string, boolean>>({});

  const navItems = [
    { href: "/vocabulaire", label: "Vocabulaire", icon: "📚" },
    { href: "/grammaire", label: "Grammaire", icon: "✒️" },
    { href: "/conjugaison", label: "Conjugaison", icon: "⏳" },
    { href: "/conversations", label: "Conversations", icon: "☕" },
    { href: "/ecriture", label: "Écriture", icon: "🪶" },
    { href: "/comprehension", label: "Compréhension", icon: "📰" },
    { href: "/delf", label: "DELF B1", icon: "🎓" },
    { href: "/progression", label: "Progression", icon: "🏆" },
  ];

  const hasDecor = (id: string, lvl: number) => levelOf(p.xp) >= lvl && decorOn[id] !== false;
  const toggleDecor = (id: string) =>
    setDecorOn((d) => ({ ...d, [id]: !(d[id] ?? true) }));

  const goalPct = Math.min(100, Math.round((minutesToday / p.goalMinutes) * 100));
  const isDay = phase === "day";

  return (
    <div className="relative min-h-dvh">
      {/* ============ FULLSCREEN SCENE (background layer) ============ */}
      <div className="fixed inset-0 z-0 overflow-hidden" role="img" aria-label={SKY_LABEL[phase]}>
        {/* sky: crossfading phase gradients */}
        {(Object.keys(SKIES) as Phase[]).map((k) => (
          <div
            key={k}
            className="absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
            style={{ background: SKIES[k], opacity: phase === k ? 1 : 0 }}
          />
        ))}

        <div className="absolute inset-0">
          {phase !== "day" && <StarField faint={phase !== "night"} />}
          {!isDay && <Clouds />}
        </div>

        {/* sun (day) / moon (night) */}
        {isDay ? (
          <div className="absolute right-[14%] top-[8%] w-14 h-14 rounded-full bg-[#fff3c4] shadow-[0_0_44px_rgba(255,240,180,0.85)]" />
        ) : (
          <div className="absolute right-[16%] top-[6%] w-10 h-10 rounded-full bg-[#f5e6d3] shadow-[0_0_18px_rgba(245,230,211,0.5)]">
            <div className="absolute right-1 top-1.5 w-4 h-4 rounded-full bg-[#e2d0b6]" />
          </div>
        )}

        {/* rooftops */}
        <svg viewBox="0 0 400 60" className="absolute bottom-[16%] w-full h-[16%] pixel-art" preserveAspectRatio="none" aria-hidden>
          <path d="M0 60 V38 h40 V30 h20 V38 h50 V32 h24 l8 -8 8 8 V38 h36 V28 h18 V38 h44 V33 h26 V38 h40 V26 h14 l6-8 6 8 V38 h30 V60 Z" fill="#1a0f24" opacity="0.9" />
          <g fill="#f5c76e" opacity="0.8">
            <rect x="12" y="40" width="3" height="3" />
            <rect x="70" y="42" width="3" height="3" />
            <rect x="150" y="41" width="3" height="3" />
            <rect x="230" y="40" width="3" height="3" />
            <rect x="300" y="42" width="3" height="3" />
            <rect x="350" y="39" width="3" height="3" />
          </g>
        </svg>
        <EiffelTower />

        {/* rain (only when rain sounds are on) */}
        {rainOn && (
          <div className="absolute left-0 right-0 top-0 bottom-[16%] overflow-hidden">
            <Rain />
          </div>
        )}

        {/* ---- window frame ---- */}
        <div className="absolute left-[16%] right-[16%] top-[3%] bottom-[16%] pointer-events-none z-10">
          <div className="absolute inset-0 border-[10px] border-[#7a5c4e] shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]" style={{ borderRadius: 2 }} />
          <div className="absolute left-1/2 top-0 bottom-0 w-[8px] -translate-x-1/2 bg-[#7a5c4e]" />
          <div className="absolute top-1/2 left-0 right-0 h-[6px] -translate-y-1/2 bg-[#7a5c4e]" />
          <div className="absolute -left-1 -right-1 -bottom-2 h-3 bg-[#5d4436]" />
        </div>

        {/* ---- interior ---- */}
        <div className="absolute left-0 right-0 bottom-0 h-[46%] bg-[#6d4a56]" />
        <div className="absolute left-0 right-0 bottom-[46%] h-[2%] bg-[#5d3f4a]" />
        <div
          className="absolute left-0 right-0 bottom-0 h-[46%] opacity-30"
          style={{
            backgroundImage: "radial-gradient(#e8b4b8 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute left-0 right-0 bottom-0 h-[10%] bg-[#4a3226] border-t-4 border-[#7a5c4e]" />
        <div className="absolute inset-x-0 top-0 h-[3%] bg-[#8a5a3b]" />
        <div className="absolute left-0 top-0 bottom-[16%] w-[16%] z-10"
          style={{
            background: "repeating-linear-gradient(90deg, #b26479 0 14px, #a15568 14px 22px)",
            borderRight: "4px solid #6d2e46",
          }}
        />
        <div className="absolute right-0 top-0 bottom-[16%] w-[16%] z-10"
          style={{
            background: "repeating-linear-gradient(90deg, #a15568 0 14px, #b26479 14px 22px)",
            borderLeft: "4px solid #6d2e46",
          }}
        />

        {/* ---- decor unlockables ---- */}
        <FairyLights on={hasDecor("fairy", 2)} />
        {hasDecor("poster", 3) && (
          <div className="hotspot left-[17.5%] top-[6%] w-[7%] aspect-[3/4] bg-[#f5e6d3] border-4 border-[#8a5a3b] flex items-center justify-center">
            <span className="text-[8px] sm:text-[10px] text-[var(--burgundy)] font-bold text-center leading-tight font-pixel">PARIS</span>
          </div>
        )}
        {hasDecor("vinyl", 4) && (
          <div className="absolute left-[86%] top-[62%] w-8 h-8 rounded-full bg-[#20142e] border-2 border-[#4a3226] flex items-center justify-center pixel-art">
            <div className="w-3 h-3 rounded-full bg-[var(--gold)]" />
          </div>
        )}
        {hasDecor("globes", 6) && (
          <>
            <div className="absolute left-[30%] top-[12%] w-4 h-5 rounded-b-full bg-[#e8b4b8] warm-glow z-10" />
            <div className="absolute left-[65%] top-[12%] w-4 h-5 rounded-b-full bg-[#b7a6d9] warm-glow z-10" style={{ animationDelay: "1s" }} />
          </>
        )}

        {/* clock */}
        <div className="absolute left-[44%] top-[13%] z-20">
          <Clock />
        </div>

        {/* bookshelf */}
        <Bookshelf />

        {/* lamp glow on wall */}
        <div className="absolute left-[6%] top-[24%] w-24 h-24 rounded-full blur-xl bg-[#f5c76e] opacity-15" />

        {/* cat sleeping on the right */}
        <div className="absolute right-[4%] bottom-[13%] w-[10%] min-w-[70px] z-20">
          <SleepingCat />
          <div className="h-2 bg-[#8a5a3b] border-2 border-[#4a3226] w-full" />
        </div>

        {/* ---- desk area ---- */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[58%] min-w-[300px] z-10">
          <div className="h-[5.5%] min-h-[14px]" />
          <div className="relative h-0">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[92px] h-[110px] -translate-y-[54px]">
              <Student />
            </div>
          </div>
          <div className="relative h-[64px]">
            <div className="absolute top-0 inset-x-0 h-3 bg-[#8a5a3b] border-y-4 border-[#4a3226]" />
            <div className="absolute top-3 inset-x-[6%] bottom-0 bg-[#6d4a2f] border-x-4 border-[#4a3226]" />
            <div className="absolute top-3 inset-x-0 z-10">
              <DeskObjects />
            </div>
          </div>
        </div>

        {/* warm lamp light across the scene bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,199,110,0.18),transparent_60%)]" />

        {/* ambient day-phase wash over the whole scene */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-[2500ms]"
          style={{ background: WASH[phase] }}
        />
      </div>

      {/* ============ OVERLAY UI ============ */}
      <div className="relative z-10 min-h-dvh flex flex-col px-4 py-4 pointer-events-none">
        {/* header: title + stats + menu */}
        <header className="pointer-events-auto flex flex-wrap items-start justify-between gap-3 enter-anim">
          <div>
            <h1 className="font-pixel text-xs sm:text-sm text-[var(--gold)] drop-shadow-[0_3px_0_rgba(0,0,0,0.6)]">
              Mon Cahier de Français
            </h1>
            <p className="hidden sm:block text-xs text-[var(--rose)] mt-1 italic">Apprendre. Réviser. Réussir.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="pixel-badge px-3 py-1.5 text-[10px] font-pixel flex items-center gap-2">
                <span>🧑‍🎓</span> Lv {level}
                <span className="progress-track h-2.5 w-16">
                  <span className="block h-full progress-fill" style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} />
                </span>
              </div>
              <div className="pixel-badge px-3 py-1.5 text-[10px] font-pixel flex items-center gap-2">
                <span>🔥</span> {p.streak} j
              </div>
              <div className="pixel-badge px-3 py-1.5 text-[10px] font-pixel flex items-center gap-2">
                <span>🎯</span> {minutesToday}/{p.goalMinutes} min
                <span className="progress-track h-2.5 w-14">
                  <span className="block h-full progress-fill" style={{ width: `${goalPct}%` }} />
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="pixel-btn px-3 py-2.5 font-pixel text-[10px]"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕ Fermer" : "☰ Étudier"}
          </button>
        </header>

        {/* nav panel */}
        {menuOpen && (
          <div className="pointer-events-auto self-end mt-3 w-full max-w-md pixel-panel-dark p-4 enter-anim">
            <p className="font-pixel text-[10px] text-[var(--dusty-pink)] mb-3 text-center">─ Où veux-tu étudier ? ─</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="pixel-btn pixel-btn-wood !text-[var(--cream)] px-2 py-2.5 flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-lg">{n.icon}</span>
                  <span className="font-pixel text-[7px] sm:text-[8px] leading-tight">{n.label}</span>
                </Link>
              ))}
            </div>

            {levelOf(p.xp) >= 2 && (
              <>
                <p className="font-pixel text-[9px] text-[var(--gold)] mt-4 mb-2 text-center">DÉCOR</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { id: "fairy", label: "✨ Guirlandes", lvl: 2 },
                    { id: "poster", label: "🖼️ Poster", lvl: 3 },
                    { id: "vinyl", label: "💿 Vinyle", lvl: 4 },
                    { id: "globes", label: "🏮 Lanternes", lvl: 6 },
                  ]
                    .filter((d) => levelOf(p.xp) >= d.lvl)
                    .map((d) => (
                      <button
                        key={d.id}
                        onClick={() => toggleDecor(d.id)}
                        className={`pixel-btn-sm px-3 py-1.5 text-xs ${(decorOn[d.id] ?? true) ? "" : "opacity-40 line-through"}`}
                      >
                        {d.label}
                      </button>
                    ))}
                </div>
              </>
            )}

            <div className="mt-4 text-center">
              <span className="font-pixel text-[9px] text-[var(--gold)] block mb-1.5">LE MOT DU JOUR</span>
              <span className="text-sm">
                <b className="text-[var(--dusty-pink)]">la flânerie</b>
                <span className="mx-2 opacity-60">—</span> the art of strolling around with no particular goal, watching the world go by 🥐
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
