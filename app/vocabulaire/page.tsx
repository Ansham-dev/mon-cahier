"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionShell, Panel, PixelHeading, ChoiceButton } from "@/components/ui";
import { VOCAB, VOCAB_CATEGORIES, Word } from "@/lib/data/vocab";
import { useProgress } from "@/lib/progress";

type Mode = "browse" | "flashcards" | "quiz";

export default function VocabulairePage() {
  const { markDone, isDone, addXp } = useProgress();
  const [category, setCategory] = useState<string>(VOCAB_CATEGORIES[0]);
  const [mode, setMode] = useState<Mode>("browse");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // quiz state
  const [quizQs, setQuizQs] = useState<ReturnType<typeof buildQuiz>>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const words = useMemo(() => VOCAB.filter((w) => w.category === category), [category]);

  function buildQuiz() {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
    return shuffled.map((w, i) => {
      const others = VOCAB.filter((o) => o.id !== w.id && o.category === w.category);
      const distract = [others[0], others[1], others[2]].filter(Boolean).map((o) => o.en);
      const choices = [w.en, ...distract].sort(() => Math.random() - 0.5);
      return {
        id: `q-${i}`,
        word: w,
        q: `« ${w.article} » means…`,
        choices,
        answer: choices.indexOf(w.en),
      };
    });
  }

  function restartQuiz() {
    setQuizQs(buildQuiz());
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setQuizDone(false);
  }

  // fresh quiz whenever category/mode changes to quiz
  useEffect(() => {
    restartQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const qq = quizQs[qIndex];
    if (i === qq.answer) {
      setScore((s) => s + 1);
      markDone("vocab", qq.word.id, 10);
    }
  }

  function next() {
    if (qIndex + 1 >= quizQs.length) {
      setQuizDone(true);
      if (score >= 4) addXp(15, "Vocab quiz cleared");
    } else {
      setQIndex((q) => q + 1);
      setPicked(null);
    }
  }

  const card: Word = words[cardIndex % words.length];

  return (
    <SectionShell title="VOCABULAIRE" subtitle="Un mot un jour, un mot pour toujours.">
      {/* category picker */}
      <div className="flex flex-wrap gap-2 mb-5">
        {VOCAB_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setMode("browse");
              setCardIndex(0);
              restartQuiz();
            }}
            className={`pixel-btn-sm px-3 py-2 text-xs capitalize ${category === c ? "brightness-110" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* mode picker */}
      <div className="flex gap-2 mb-5">
        {(["browse", "flashcards", "quiz"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              if (m === "quiz") restartQuiz();
            }}
            className={`pixel-btn px-3 py-2 text-xs font-pixel capitalize ${mode === m ? "" : "!opacity-70"}`}
          >
            {m === "browse" ? "📖 Liste" : m === "flashcards" ? "🃏 Cartes" : "❓ Quiz"}
          </button>
        ))}
      </div>

      {mode === "browse" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {words.map((w) => (
            <Panel key={w.id} className={isDone("vocab", w.id) ? "!bg-[#e8dccb]" : ""}>
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-[var(--burgundy)] text-lg">{w.article}</h3>
                {isDone("vocab", w.id) && <span title="Learned" className="text-xs">🌱</span>}
              </div>
              <p className="text-sm text-[var(--brown)] mb-2">{w.en}</p>
              <p className="text-sm italic">« {w.example} »</p>
              <p className="text-xs text-[var(--brown)]">{w.exampleEn}</p>
            </Panel>
          ))}
        </div>
      )}

      {mode === "flashcards" && (
        <div>
          <Panel className="text-center max-w-md mx-auto">
            <button
              className="w-full py-8 cursor-pointer select-none"
              onClick={() => setFlipped((f) => !f)}
            >
              {!flipped ? (
                <>
                  <span className="font-pixel text-md text-[var(--burgundy)] text-xl sm:text-2xl">{card.article}</span>
                  <p className="text-xs text-[var(--brown)] mt-4">tap to flip 🔁</p>
                </>
              ) : (
                <>
                  <span className="text-xl sm:text-2xl font-bold text-[var(--burgundy)]">{card.en}</span>
                  <p className="text-sm italic mt-3">« {card.example} »</p>
                  <p className="text-xs text-[var(--brown)] mt-1">{card.exampleEn}</p>
                </>
              )}
            </button>
            <div className="flex gap-2 justify-center">
              <button
                className="pixel-btn-sm px-4 py-2 text-sm"
                onClick={() => {
                  setFlipped(false);
                  setCardIndex((i) => (i - 1 + words.length) % words.length);
                }}
              >
                ← Prev
              </button>
              <button
                className="pixel-btn-sm px-4 py-2 text-sm"
                onClick={() => {
                  setFlipped(false);
                  setCardIndex((i) => (i + 1) % words.length);
                }}
              >
                Next →
              </button>
              <button
                className="pixel-btn px-4 py-2 text-sm font-pixel text-xs"
                onClick={() => markDone("vocab", card.id, 10)}
                disabled={isDone("vocab", card.id)}
              >
                {isDone("vocab", card.id) ? "✓ Learned" : "Je sais ! +10 XP"}
              </button>
            </div>
            <p className="text-xs text-[var(--brown)] mt-3">
              {cardIndex + 1} / {words.length}
            </p>
          </Panel>
        </div>
      )}

      {mode === "quiz" && (
        <Panel className="max-w-xl mx-auto">
          {quizDone ? (
            <div className="text-center py-6">
              <p className="font-pixel text-sm text-[var(--burgundy)] mb-3">Quiz terminé !</p>
              <p className="text-lg">
                Score : <b>{score}</b> / {quizQs.length}
              </p>
              <p className="text-sm mt-2 text-[var(--brown)]">
                {score >= 4 ? "Formidable ! 🎉" : "Révise les mots puis réessaie 💪"}
              </p>
              <button onClick={restartQuiz} className="pixel-btn px-4 py-2 text-sm font-pixel text-xs mt-4">
                Retenter ↻
              </button>
            </div>
          ) : (
            <>
              <PixelHeading>
                Question {qIndex + 1} / {quizQs.length} · Score {score}
              </PixelHeading>
              <p className="text-lg font-bold text-[var(--burgundy)] mb-1">{quizQs[qIndex].q}</p>
              <p className="text-xs text-[var(--brown)] mb-3">
                category: {quizQs[qIndex].word.category}
              </p>
              <div className="grid gap-2">
                {quizQs[qIndex].choices.map((c, i) => (
                  <ChoiceButton
                    key={i}
                    selected={picked === i}
                    correct={picked !== null ? quizQs[qIndex].answer === i : undefined}
                    wrong={picked === i && picked !== quizQs[qIndex].answer}
                    onClick={() => pick(i)}
                  >
                    {c}
                  </ChoiceButton>
                ))}
              </div>
              {picked !== null && (
                <button onClick={next} className="pixel-btn px-4 py-2 text-sm font-pixel text-xs mt-4 w-full">
                  {qIndex + 1 >= quizQs.length ? "Finish" : "Next →"}
                </button>
              )}
            </>
          )}
        </Panel>
      )}
    </SectionShell>
  );
}
