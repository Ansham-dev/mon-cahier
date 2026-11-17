"use client";

import { useState } from "react";
import { SectionShell, Panel, PixelHeading, ChoiceButton } from "@/components/ui";
import { GRAMMAR } from "@/lib/data/grammar";
import { useProgress } from "@/lib/progress";

export default function GrammairePage() {
  const { markDone, isDone, addXp } = useProgress();
  const [openId, setOpenId] = useState<string | null>(null);
  const lesson = GRAMMAR.find((l) => l.id === openId);

  const [picked, setPicked] = useState<Record<number, number>>({});

  if (!lesson) {
    return (
      <SectionShell title="GRAMMAIRE" subtitle="La structure du français, expliquée simplement.">
        <div className="grid gap-3">
          {GRAMMAR.map((l) => {
            const done = isDone("grammar", l.id);
            return (
              <Panel
                key={l.id}
                className={`flex items-center gap-4 cursor-pointer hover:brightness-[1.03] ${done ? "!bg-[#e8dccb]" : ""}`}
              >
                <div onClick={() => setOpenId(l.id)} className="flex items-center gap-4 w-full">
                  <span className="text-2xl">{done ? "✅" : "📘"}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[var(--burgundy)]">{l.title}</h3>
                    <p className="text-xs text-[var(--brown)]">{l.level} · {l.exercises.length} exercices</p>
                  </div>
                  <span className="ml-auto pixel-btn-sm px-2 py-1 text-xs">Ouvrir →</span>
                </div>
              </Panel>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  const exercises = lesson.exercises;
  const allAnswered = exercises.every((_, i) => picked[i] !== undefined);
  const correctCount = exercises.filter((e, i) => picked[i] === e.answer).length;

  return (
    <SectionShell title="GRAMMAIRE" subtitle={lesson.title}>
      <Panel className="mb-4">
        <PixelHeading>📖 The lesson</PixelHeading>
        <p className="text-sm leading-relaxed mb-4">{lesson.explanation}</p>
        <div className="space-y-2">
          {lesson.examples.map((ex, i) => (
            <div key={i} className="border-l-4 border-[var(--burgundy)] pl-3">
              <p className="text-sm font-semibold">« {ex.fr} »</p>
              <p className="text-xs text-[var(--brown)]">{ex.en}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PixelHeading>✏️ Exercises</PixelHeading>
        <div className="space-y-4">
          {exercises.map((e, i) => (
            <div key={i}>
              <p className="text-sm font-semibold mb-2">
                {i + 1}. {e.q}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {e.choices.map((c, ci) => {
                  const sel = picked[i] === ci;
                  return (
                    <ChoiceButton
                      key={ci}
                      selected={sel}
                      correct={picked[i] !== undefined ? e.answer === ci : undefined}
                      wrong={sel && e.answer !== ci}
                      onClick={() => setPicked((pp) => ({ ...pp, [i]: ci }))}
                    >
                      {c}
                    </ChoiceButton>
                  );
                })}
              </div>
              {picked[i] !== undefined && (
                <p className={`text-xs mt-1.5 ${picked[i] === e.answer ? "text-green-700" : "text-red-700"}`}>
                  {picked[i] === e.answer ? "✓ " : "✗ "}
                  {e.explain}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            disabled={!allAnswered}
            onClick={() => {
              const ok = correctCount === exercises.length;
              markDone("grammar", lesson.id, ok ? 30 : 15);
              if (ok) addXp(10, "Perfect lesson!");
            }}
            className={`pixel-btn px-4 py-2 text-xs font-pixel ${allAnswered ? "" : "opacity-50 cursor-not-allowed"}`}
          >
            Terminer la leçon ({correctCount}/{exercises.length})
          </button>
          <button
            onClick={() => setPicked({})}
            className="pixel-btn-sm px-4 py-2 text-xs"
          >
            Reset answers
          </button>
          <button
            onClick={() => {
              setOpenId(null);
              setPicked({});
            }}
            className="pixel-btn-sm px-4 py-2 text-xs"
          >
            ← All lessons
          </button>
        </div>
        {!allAnswered && (
          <p className="text-xs text-[var(--brown)] mt-2">Answer all questions to finish the lesson.</p>
        )}
      </Panel>
    </SectionShell>
  );
}
