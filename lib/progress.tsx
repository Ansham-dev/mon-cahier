"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

export type Progress = {
  xp: number;
  lastDate: string | null;
  streak: number;
  done: Record<string, string[]>;
  achievements: string[];
  decor: string[];
  goalMinutes: number;
  minutes: Record<string, number>;
  todayXp: { date: string; xp: number };
};

const DEFAULT: Progress = {
  xp: 0,
  lastDate: null,
  streak: 0,
  done: {},
  achievements: [],
  decor: [],
  goalMinutes: 30,
  minutes: {},
  todayXp: { date: "", xp: 0 },
};

const STORAGE_KEY = "mon-cahier-progress-v1";

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const levelOf = (xp: number) => Math.floor(xp / 120) + 1;

type Toast = { id: number; text: string; icon?: string };

type Ctx = {
  p: Progress;
  today: string;
  level: number;
  xpInLevel: number;
  xpForLevel: number;
  minutesToday: number;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  addXp: (n: number, reason?: string) => void;
  markDone: (key: string, id: string, xp?: number) => void;
  isDone: (key: string, id: string) => boolean;
  addMinutes: (m: number) => void;
  setGoal: (m: number) => void;
  awardDecor: (id: string) => void;
  toggleDecor: (id: string) => void;
  reset: () => void;
};

const ProgressCtx = createContext<Ctx | null>(null);

export const ACHIEVEMENTS: {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (p: Progress) => boolean;
}[] = [
  { id: "first-steps", name: "Premiers pas", desc: "Earn your first 10 XP", icon: "🌱", check: (p) => p.xp >= 10 },
  { id: "bookworm", name: "Bookworm", desc: "Learn 10 vocabulary words", icon: "📖", check: (p) => (p.done.vocab ?? []).length >= 10 },
  { id: "grammarian", name: "Le Grammairien", desc: "Complete 3 grammar lessons", icon: "✒️", check: (p) => (p.done.grammar ?? []).length >= 3 },
  { id: "conjugator", name: "Maître des verbes", desc: "Complete 5 conjugation exercises", icon: "⏳", check: (p) => (p.done.conjugation ?? []).length >= 5 },
  { id: "causer", name: "Grand Causeur", desc: "Finish a conversation roleplay", icon: "☕", check: (p) => (p.done.conversations ?? []).length >= 1 },
  { id: "romancier", name: "Petit Romancier", desc: "Complete a writing exercise", icon: "🪶", check: (p) => (p.done.writing ?? []).length >= 1 },
  { id: "lecteur", name: "Bon Lecteur", desc: "Complete a comprehension text", icon: "📰", check: (p) => (p.done.comprehension ?? []).length >= 1 },
  { id: "delf-ready", name: "Prêt pour le DELF", desc: "Finish a DELF timed exercise", icon: "🎓", check: (p) => (p.done.delf ?? []).length >= 1 },
  { id: "streak3", name: "Habitué du café", desc: "3-day study streak", icon: "🔥", check: (p) => p.streak >= 3 },
  { id: "streak7", name: "Une semaine !", desc: "7-day study streak", icon: "🌟", check: (p) => p.streak >= 7 },
  { id: "night-owl", name: "Oiseau de nuit", desc: "Study 60 minutes in one day", icon: "🌙", check: (p) => (p.minutes[todayKey()] ?? 0) >= 60 },
  { id: "lvl5", name: "Habitué niveau 5", desc: "Reach level 5", icon: "🏰", check: (p) => levelOf(p.xp) >= 5 },
];

const DECOR_UNLOCK: { id: string; name: string; level: number }[] = [
  { id: "fairy", name: "Fairy lights", level: 2 },
  { id: "poster", name: "French poster", level: 3 },
  { id: "vinyl", name: "Vinyl record", level: 4 },
  { id: "globes", name: "Paper lanterns", level: 6 },
];

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState<Progress>(DEFAULT);
  const [today, setToday] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const loaded = useRef(false);
  const toastId = useRef(0);

  useEffect(() => {
    const t = todayKey();
    setToday(t);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT, ...JSON.parse(raw) } as Progress;
        if (parsed.lastDate && parsed.lastDate !== t && parsed.lastDate !== yesterdayKey()) {
          parsed.streak = 0;
        }
        if (parsed.todayXp.date !== t) parsed.todayXp = { date: t, xp: 0 };
        setP(parsed);
      }
    } catch {}
    loaded.current = true;
    const rollover = setInterval(() => setToday(todayKey()), 60_000);
    return () => clearInterval(rollover);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  }, [p]);

  const pushToast = useCallback((text: string, icon?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const checkAchievements = useCallback(
    (next: Progress): Progress => {
      let result = next;
      for (const a of ACHIEVEMENTS) {
        if (!result.achievements.includes(a.id) && a.check(result)) {
          result = { ...result, achievements: [...result.achievements, a.id] };
          setTimeout(() => pushToast(`Achievement: ${a.name}`, a.icon), 150);
        }
      }
      for (const d of DECOR_UNLOCK) {
        if (levelOf(result.xp) >= d.level && !result.decor.includes(d.id)) {
          result = { ...result, decor: [...result.decor, d.id] };
          setTimeout(() => pushToast(`Unlocked: ${d.name}`, "🎁"), 300);
        }
      }
      return result;
    },
    [pushToast]
  );

  const touchStreak = useCallback((base: Progress): Progress => {
    const t = todayKey();
    if (base.lastDate === t) return base;
    const streak = base.lastDate === yesterdayKey() ? base.streak + 1 : 1;
    return { ...base, lastDate: t, streak };
  }, []);

  const addXp = useCallback(
    (n: number, reason?: string) => {
      setP((prev) => {
        const before = levelOf(prev.xp);
        let next = touchStreak(prev);
        const t = todayKey();
        const todayXp =
          next.todayXp.date === t ? { date: t, xp: next.todayXp.xp + n } : { date: t, xp: n };
        next = { ...next, xp: next.xp + n, todayXp };
        next = checkAchievements(next);
        if (reason) setTimeout(() => pushToast(`+${n} XP — ${reason}`, "⭐"), 100);
        const after = levelOf(next.xp);
        if (after > before) setTimeout(() => pushToast(`Level ${after} reached!`, "🎉"), 600);
        return next;
      });
    },
    [checkAchievements, pushToast, touchStreak]
  );

  const markDone = useCallback(
    (key: string, id: string, xp = 15) => {
      setP((prev) => {
        const list = prev.done[key] ?? [];
        if (list.includes(id)) return prev;
        const before = levelOf(prev.xp);
        let next = touchStreak(prev);
        const t = todayKey();
        const todayXp =
          next.todayXp.date === t ? { date: t, xp: next.todayXp.xp + xp } : { date: t, xp };
        next = { ...next, xp: next.xp + xp, todayXp, done: { ...next.done, [key]: [...list, id] } };
        next = checkAchievements(next);
        setTimeout(() => pushToast(`+${xp} XP — ${id.slice(0, 40)}`, "⭐"), 100);
        const after = levelOf(next.xp);
        if (after > before) setTimeout(() => pushToast(`Level ${after} reached!`, "🎉"), 600);
        return next;
      });
    },
    [checkAchievements, pushToast, touchStreak]
  );

  const addMinutes = useCallback(
    (m: number) => {
      if (m <= 0) return;
      setP((prev) => {
        const t = todayKey();
        const next = touchStreak(prev);
        return checkAchievements({ ...next, minutes: { ...next.minutes, [t]: (next.minutes[t] ?? 0) + m } });
      });
    },
    [checkAchievements, touchStreak]
  );

  const value = useMemo<Ctx>(() => {
    const lv = levelOf(p.xp);
    return {
      p,
      today,
      level: lv,
      xpInLevel: p.xp - (lv - 1) * 120,
      xpForLevel: 120,
      minutesToday: today ? p.minutes[today] ?? 0 : 0,
      toasts,
      dismissToast: (id) => setToasts((all) => all.filter((x) => x.id !== id)),
      addXp,
      markDone,
      isDone: (key, id) => (p.done[key] ?? []).includes(id),
      addMinutes,
      setGoal: (m) => setP((prev) => ({ ...prev, goalMinutes: m })),
      awardDecor: (id) =>
        setP((prev) => (prev.decor.includes(id) ? prev : { ...prev, decor: [...prev.decor, id] })),
      toggleDecor: (id) =>
        setP((prev) => {
          const on = prev.done.decor ?? [];
          if (on.includes(id)) {
            return { ...prev, done: { ...prev.done, decor: on.filter((x) => x !== id) } };
          }
          return { ...prev, done: { ...prev.done, decor: [...on, id] } };
        }),
      reset: () => setP(DEFAULT),
    };
  }, [p, today, toasts, addXp, markDone, addMinutes]);

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
