"use client";

import { useEffect, useRef, useState } from "react";
import { SectionShell, Panel, PixelHeading, ChoiceButton } from "@/components/ui";
import { DELF_TASKS, DelfTask } from "@/lib/data/content";
import { useProgress } from "@/lib/progress";

export default function DelfPage() {
  const { markDone, isDone, addXp } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const task = DELF_TASKS.find((t) => t.id === activeId);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [essay, setEssay] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ivRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
    };
  }, [running]);

  function openTask(t: DelfTask) {
    setActiveId(t.id);
    setSecondsLeft(t.minutes * 60);
    setRunning(false);
    setPicked({});
    setEssay("");
    setShowModel(false);
    setShowTranscript(false);
  }

  if (!task) {
    const sections = ["Production écrite", "Production orale", "Compréhension écrite", "Compréhension orale"] as const;
    return (
      <SectionShell title="DELF B1" subtitle="Ton ticket pour la certification. Prépare-toi ici.">
        {sections.map((sec) => (
          <div key={sec} className="mb-5">
            <PixelHeading>🎓 {sec}</PixelHeading>
            <div className="grid gap-3">
              {DELF_TASKS.filter((t) => t.section === sec).map((t) => (
                <Panel key={t.id} className="hover:brightness-[1.03]">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{isDone("delf", t.id) ? "🏅" : "📝"}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[var(--burgundy)]">{t.title}</h3>
                      <p className="text-xs text-[var(--brown)]">⏱ {t.minutes} min · {t.criteria.length} critères</p>
                    </div>
                    <button onClick={() => openTask(t)} className="ml-auto pixel-btn px-3 py-2 text-xs font-pixel shrink-0">
                      Commencer →
                    </button>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        ))}
      </SectionShell>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const allPicked =
    task.questions ? Object.keys(picked).length >= task.questions.length : true;

  function playAudio() {
    const script = task?.audioScript;
    if (!script) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(script);
    u.lang = "fr-FR";
    u.rate = 0.88;
    synth.speak(u);
  }

  function submitTask() {
    if (!task) return;
    setRunning(false);
    markDone("delf", task.id, 40);
    addXp(10, "DELF session done");
  }

  return (
    <SectionShell title="DELF B1" subtitle={`${task.section} — ${task.title}`} max="max-w-2xl">
      {/* timer bar */}
      <Panel className="mb-4 !bg-[#3a2438] !text-[var(--cream)]">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-lg" style={{ color: secondsLeft < 60 ? "#ff8a8a" : "var(--gold)" }}>
            ⏱ {mm}:{ss}
          </span>
          <button onClick={() => setRunning((r) => !r)} className="pixel-btn-sm px-3 py-1.5 text-xs">
            {running ? "Pause" : "Démarrer"}
          </button>
          <button
            onClick={() => setSecondsLeft(task.minutes * 60)}
            className="pixel-btn-sm px-3 py-1.5 text-xs"
          >
            Reset
          </button>
          <span className="text-xs text-[var(--rose)]">{task.minutes} min officielles</span>
        </div>
      </Panel>

      <Panel className="mb-4">
        <PixelHeading>📋 Consignes</PixelHeading>
        <p className="text-sm leading-relaxed">{task.instructions}</p>
        {task.body && <p className="text-sm whitespace-pre-line leading-relaxed mt-3 border-t-2 border-dashed border-[#c9b28f] pt-3">{task.body}</p>}
        {task.audioScript && (
          <div className="mt-3">
            <button onClick={playAudio} className="pixel-btn-sm px-4 py-2 text-sm">
              ▶ Écouter l'annonce
            </button>
            <button onClick={() => setShowTranscript((s) => !s)} className="pixel-btn-sm px-4 py-2 text-xs ml-2">
              Transcription
            </button>
            {showTranscript && <p className="text-xs italic text-[var(--brown)] mt-2">{task.audioScript}</p>}
          </div>
        )}
      </Panel>

      {task.questions && (
        <Panel className="mb-4">
          <PixelHeading>❓ Questions</PixelHeading>
          <div className="space-y-4">
            {task.questions.map((q, i) => (
              <div key={i}>
                <p className="text-sm font-semibold mb-2">{i + 1}. {q.q}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.choices.map((c, ci) => (
                    <ChoiceButton
                      key={ci}
                      selected={picked[i] === ci}
                      correct={picked[i] !== undefined ? q.answer === ci : undefined}
                      wrong={picked[i] === ci && q.answer !== ci}
                      onClick={() => setPicked((pp) => ({ ...pp, [i]: ci }))}
                    >
                      {c}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {(task.section === "Production écrite" || task.section === "Production orale") && (
        <Panel className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <PixelHeading>{task.section === "Production écrite" ? "✍️ Ta production" : "🎙️ Notes / brouillon"}</PixelHeading>
            {task.section === "Production écrite" && <span className="text-xs text-[var(--brown)]">{words} mots</span>}
          </div>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            className="w-full h-56 pixel-panel !shadow-none !box-border p-3 text-sm outline-none leading-relaxed"
            placeholder="Madame, Monsieur…"
          />
        </Panel>
      )}

      <Panel className="mb-4">
        <PixelHeading>🎯 Grille d'évaluation</PixelHeading>
        <ul className="text-sm space-y-1.5">
          {task.criteria.map((c, i) => (
            <li key={i}>• {c}</li>
          ))}
        </ul>
        <button onClick={() => setShowModel((s) => !s)} className="pixel-btn-sm px-4 py-2 text-xs mt-3">
          {showModel ? "Cacher le modèle" : "👁 Voir le modèle / critères détaillés"}
        </button>
        {showModel && task.model && (
          <p className="text-sm whitespace-pre-line leading-relaxed mt-3 border-t-2 border-dashed border-[#c9b28f] pt-3">
            {task.model}
          </p>
        )}
      </Panel>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={submitTask}
          disabled={task.questions ? !allPicked : words < 40}
          className={`pixel-btn px-4 py-2 text-xs font-pixel ${
            (task.questions ? allPicked : words >= 40) ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Rendre l'examen +50 XP
        </button>
        <button onClick={() => setActiveId(null)} className="pixel-btn-sm px-4 py-2 text-xs">
          ← Retour
        </button>
      </div>
    </SectionShell>
  );
}
