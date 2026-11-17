"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

export function Toasts() {
  const { toasts, dismissToast } = useProgress();
  if (!toasts.length) return null;
  return (
    <>
      {toasts.map((t) => (
        <div key={t.id} className="toast-anim pixel-panel px-4 py-3 text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{t.icon ?? "⭐"}</span>
          <span>{t.text}</span>
          <button onClick={() => dismissToast(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      ))}
    </>
  );
}

export function SectionShell({
  title,
  subtitle,
  children,
  max = "max-w-3xl",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  max?: string;
}) {
  const { level, xpInLevel, xpForLevel, p } = useProgress();
  return (
    <div className="min-h-screen pb-28">
      <header className="border-b-4 border-[#120c22] bg-gradient-to-b from-[#3a2438] to-[#2c1a3e] shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="pixel-btn wood pl px-3 py-2 text-xs font-pixel" aria-label="Back to study room">
            ←
          </Link>
          <div className="min-w-0">
            <h1 className="font-pixel text-sm sm:text-base text-[var(--gold)] truncate">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--rose)] mt-1 truncate">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="pixel-badge px-3 py-1.5 text-[10px] font-pixel hidden sm:flex gap-2 items-center">
              <span className="text-[var(--gold)]">Lv {level}</span>
              <span className="hidden md:inline text-[var(--dusty-pink)]">
                {xpInLevel}/{xpForLevel}
              </span>
            </div>
            <div className="pixel-badge px-3 py-1.5 text-[10px] font-pixel flex gap-2 items-center">
              <span>🔥</span>
              <span>{p.streak}</span>
            </div>
          </div>
        </div>
      </header>
      <main className={`${max} mx-auto px-4 py-6 enter-anim`}>{children}</main>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`pixel-panel p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function PixelHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-pixel text-xs sm:text-sm text-[var(--burgundy)] mb-3">{children}</h2>;
}

export function ChoiceButton({
  selected,
  correct,
  wrong,
  onClick,
  children,
}: {
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  let cls = "bg-[var(--paper)] hover:bg-[#fff8ec]";
  if (selected && correct === true) cls = "bg-green-200";
  if (selected && wrong) cls = "bg-red-200";
  return (
    <button
      onClick={onClick}
      className={`pixel-panel !shadow-none !box-border text-left px-3 py-2.5 text-sm w-full ${cls}`}
    >
      {children}
    </button>
  );
}
