"use client";

import { SectionShell, Panel, PixelHeading } from "@/components/ui";
import { ACHIEVEMENTS, levelOf, useProgress } from "@/lib/progress";
import { useMemo, useState } from "react";

export default function ProgressionPage() {
  const { p, today, level, xpInLevel, xpForLevel, minutesToday, addMinutes, setGoal, reset } = useProgress();
  const doneCount = Object.values(p.done).reduce((n, arr) => (Array.isArray(arr) ? n + arr.length : n), 0);
  const last7 = useMemo(() => {
    if (!today) return [];
    const base = new Date(`${today}T00:00:00Z`);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setUTCDate(d.getUTCDate() - (6 - i));
      const key2 = d.toISOString().slice(0, 10);
      return { key2, label: ["S", "M", "T", "W", "T", "F", "S"][d.getUTCDay()], min: p.minutes[key2] ?? 0 };
    });
  }, [today, p.minutes]);
  const maxMin = Math.max(30, ...last7.map((d) => d.min));
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <SectionShell title="MON PROGRESSION" subtitle="Chaque jour, la tour Eiffel se dessine un peu mieux.">
      {/* level card */}
      <Panel className="mb-4 text-center !bg-[#3a2438] !text-[var(--cream)]">
        <p className="font-pixel text-[10px] text-[var(--gold)] mb-2">NIVEAU {level}</p>
        <div className="progress-track h-4 max-w-md mx-auto">
          <div className="h-full progress-fill" style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} />
        </div>
        <p className="text-xs text-[var(--rose)] mt-2">
          {xpInLevel} / {xpForLevel} XP vers le niveau {level + 1} · total {p.xp} XP
        </p>
      </Panel>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Panel className="text-center">
          <p className="text-3xl">🔥</p>
          <p className="font-pixel text-sm mt-1">{p.streak} jours</p>
          <p className="text-xs text-[var(--brown)]">série d'étude</p>
        </Panel>
        <Panel className="text-center">
          <p className="text-3xl">📚</p>
          <p className="font-pixel text-sm mt-1">{doneCount}</p>
          <p className="text-xs text-[var(--brown)]">activités terminées</p>
        </Panel>
        <Panel className="text-center">
          <p className="text-3xl">⏰</p>
          <p className="font-pixel text-sm mt-1">
            {minutesToday}/{p.goalMinutes} min
          </p>
          <p className="text-xs text-[var(--brown)]">objectif du jour</p>
        </Panel>
      </div>

      {/* weekly chart */}
      <Panel className="mb-4">
        <PixelHeading>📈 Cette semaine (minutes)</PixelHeading>
        <div className="flex items-end gap-2 h-32">
          {last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[var(--brown)]">{d.min}</span>
              <div
                className="w-full bg-[var(--burgundy)] border-2 border-[var(--dark-brown)] rounded-t"
                style={{ height: `${Math.max(4, (d.min / maxMin) * 90)}px` }}
              />
              <span className="text-[10px] font-bold">{d.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* daily challenge */}
      <Panel className="mb-4">
        <PixelHeading>🎯 Défi du jour</PixelHeading>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-sm font-semibold">Gagner 40 XP aujourd'hui</p>
            <p className="text-xs text-[var(--brown)]">
              {p.todayXp.date === today ? p.todayXp.xp : 0} / 40 XP
            </p>
            <div className="progress-track h-3 w-48 mt-1">
              <div
                className="h-full progress-fill"
                style={{ width: `${Math.min(100, ((p.todayXp.date === today ? p.todayXp.xp : 0) / 40) * 100)}%` }}
              />
            </div>
          </div>
          <span
            className={`ml-auto text-2xl ${
              p.todayXp.date === today && p.todayXp.xp >= 40 ? "" : "opacity-30"
            }`}
          >
            {p.todayXp.date === today && p.todayXp.xp >= 40 ? "🏆" : "🔒"}
          </span>
        </div>
      </Panel>

      {/* achievements */}
      <Panel className="mb-4">
        <PixelHeading>🏆 Récompenses ({p.achievements.length}/{ACHIEVEMENTS.length})</PixelHeading>
        <div className="grid sm:grid-cols-2 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const got = p.achievements.includes(a.id);
            return (
              <div key={a.id} className={`flex items-center gap-3 p-2 border-2 border-[#c9b28f] ${got ? "bg-[#fdf3e3]" : "opacity-50"}`}>
                <span className="text-2xl">{got ? a.icon : "🔒"}</span>
                <div>
                  <p className="text-sm font-bold text-[var(--burgundy)]">{a.name}</p>
                  <p className="text-xs text-[var(--brown)]">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* settings */}
      <Panel>
        <PixelHeading>⚙️ Réglages du nid</PixelHeading>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">Objectif quotidien :</span>
          {[15, 30, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => setGoal(m)}
              className={`pixel-btn-sm px-3 py-1.5 text-xs ${p.goalMinutes === m ? "brightness-110" : ""}`}
            >
              {m} min
            </button>
          ))}
          <button onClick={() => addMinutes(5)} className="pixel-btn-sm px-3 py-1.5 text-xs">
            +5 min (track session)
          </button>
        </div>
        <div className="mt-4 border-t-2 border-dashed border-[#c9b28f] pt-3">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-700">Tout effacer ? Sûr·e ?</span>
              <button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="pixel-btn px-3 py-1.5 text-xs font-pixel !bg-[#8f2f3f]"
              >
                Oui, tout effacer
              </button>
              <button onClick={() => setConfirmReset(false)} className="pixel-btn-sm px-3 py-1.5 text-xs">
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="text-xs underline text-[var(--brown)]">
              Réinitialiser ma progression… (level {levelOf(p.xp)} et tout le reste)
            </button>
          )}
        </div>
      </Panel>
    </SectionShell>
  );
}
