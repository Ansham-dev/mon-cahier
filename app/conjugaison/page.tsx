"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionShell, Panel, PixelHeading } from "@/components/ui";
import { VERBS, PRONOUNS, TENSES, TenseId, Verb } from "@/lib/data/verbs";
import { useProgress } from "@/lib/progress";

type Mode = "table" | "drill";

export default function ConjugaisonPage() {
  const { markDone, addXp } = useProgress();
  const [verb, setVerb] = useState<Verb>(VERBS[0]);
  const [mode, setMode] = useState<Mode>("table");

  // drill state
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; expected: string }>(null);
  const [correct, setCorrect] = useState(0);

  const baseQuestions = useMemo(() => {
    const qs: { verb: Verb; tense: TenseId; person: number }[] = [];
    for (const t of TENSES) {
      for (let pi = 0; pi < 6; pi++) {
        qs.push({ verb, tense: t.id, person: pi });
      }
    }
    return qs;
  }, [verb]);

  const [questions, setQuestions] = useState(baseQuestions);

  useEffect(() => {
    setQuestions(baseQuestions);
  }, [baseQuestions]);

  function shuffleQuestions() {
    setQuestions([...baseQuestions].sort(() => Math.random() - 0.5));
  }

  function answerFor(v: Verb, t: TenseId, pi: number) {
    return v[t][pi];
  }

  function submit() {
    const q = questions[step];
    const expected = answerFor(q.verb, q.tense, q.person);
    const guess = input.trim().toLowerCase().replace(/\s+/g, "");
    const ok = guess === expected.toLowerCase();
    setResult({ ok, expected });
    if (ok) setCorrect((c) => c + 1);
  }

  function next() {
    if (step + 1 >= questions.length) {
      markDone("conjugation", `${verb.inf}-${Date.now()}`, correct >= 20 ? 30 : 15);
      if (correct >= 20) addXp(10, "Conjugation master");
    } else {
      setStep((s) => s + 1);
      setInput("");
      setResult(null);
    }
  }

  const q = questions[step];

  return (
    <SectionShell title="CONJUGAISON" subtitle="Les verbes, cœur battant de la langue.">
      {/* verb picker */}
      <div className="flex flex-wrap gap-2 mb-4">
        {VERBS.map((v) => (
          <button
            key={v.inf}
            onClick={() => {
              setVerb(v);
              setStep(0);
              setResult(null);
              setCorrect(0);
            }}
            className={`pixel-btn-sm px-3 py-1.5 text-sm italic ${verb.inf === v.inf ? "brightness-110" : ""}`}
          >
            {v.fr}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setMode("table")} className={`pixel-btn px-4 py-2 text-xs font-pixel ${mode === "table" ? "" : "!opacity-70"}`}>
          🗂️ Tables
        </button>
        <button onClick={() => setMode("drill")} className={`pixel-btn px-4 py-2 text-xs font-pixel ${mode === "drill" ? "" : "!opacity-70"}`}>
          ✍️ Exercices
        </button>
      </div>

      {mode === "table" && (
        <Panel className="overflow-x-auto">
          <div className="flex items-baseline gap-3 mb-4">
            <h3 className="font-bold text-xl text-[var(--burgundy)] italic">{verb.fr}</h3>
            <span className="text-sm text-[var(--brown)]">{verb.en} · participle: {verb.participle} · aux: {verb.aux}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 font-pixel text-[9px] text-[var(--burgundy)]">personne</th>
                {TENSES.map((t) => (
                  <th key={t.id} className="text-left p-2 font-pixel text-[9px] text-[var(--burgundy)]" title={t.desc}>
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRONOUNS.map((pr, pi) => (
                <tr key={pr} className="odd:bg-[#f3e6d0]">
                  <td className="p-2 text-[var(--brown)]">{pr}</td>
                  {TENSES.map((t) => (
                    <td key={t.id} className="p-2">
                      <b>{answerFor(verb, t.id, pi)}</b>
                      <span className="text-[var(--brown)]">
                        {" "}
                        {t.id === "futur" || t.id === "conditionnel" || t.id === "imparfait" || t.id === "present" ? "" : ""}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[var(--brown)] mt-3">
            Passé composé : {verb.aux === "avoir" ? "j'ai" : "je suis"} + <b>{verb.participle}</b>
            {verb.aux === "être" ? " (accord avec le sujet !)" : ""}
          </p>
        </Panel>
      )}

      {mode === "drill" && (
        <Panel className="max-w-xl mx-auto">
          {step === 0 && !result ? (
            <div className="text-center py-4">
              <PixelHeading>À toi de jouer…</PixelHeading>
              <p className="text-sm mb-4">
                {questions.length} questions · 4 temps ({verb.fr}) · fill in the blank. You need 20 for the bonus.
              </p>
              <button
                onClick={() => {
                  shuffleQuestions();
                  setResult(null);
                  setCorrect(0);
                }}
                className="pixel-btn px-5 py-3 text-sm font-pixel text-xs"
              >
                Commencer ▶
              </button>
            </div>
          ) : step >= questions.length ? (
            <div className="text-center py-6">
              <p className="font-pixel text-sm text-[var(--burgundy)] mb-2">Série terminée !</p>
              <p className="text-lg mb-2">
                {correct} / {questions.length} correct
              </p>
              <button
                onClick={() => {
                  shuffleQuestions();
                  setStep(0);
                  setInput("");
                  setResult(null);
                  setCorrect(0);
                }}
                className="pixel-btn px-4 py-2 text-sm font-pixel text-xs"
              >
                Encore ↻
              </button>
            </div>
          ) : (
            <>
              <PixelHeading>
                Exercice {step + 1} / {questions.length} · OK: {correct}
              </PixelHeading>
              <p className="text-sm text-[var(--brown)] mb-1">
                {TENSES.find((t) => t.id === q.tense)!.label} · {verb.fr}
              </p>
              <p className="text-lg font-bold mb-3">
                {PRONOUNS[q.person]} <span className="text-[var(--burgundy)]">______</span>{" "}
                <span className="text-xs text-[var(--brown)]">
                  ({q.tense === "present" ? "présent" : TENSES.find((t) => t.id === q.tense)!.label.toLowerCase()})
                </span>
              </p>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !result && submit()}
                  className="pixel-panel !shadow-none !box-border px-3 py-2 text-sm flex-1 outline-none"
                  placeholder="ta réponse…"
                  autoFocus
                />
                <button onClick={submit} disabled={result !== null} className="pixel-btn px-4 text-sm font-pixel text-xs">
                  OK
                </button>
              </div>
              {result && (
                <div className="mt-3">
                  <p className={`text-sm font-semibold ${result.ok ? "text-green-700" : "text-red-700"}`}>
                    {result.ok ? "✓ Parfait !" : `✗ La réponse : ${result.expected}`}
                  </p>
                  <button onClick={next} className="pixel-btn px-4 py-2 text-sm font-pixel text-xs mt-2 w-full">
                    {step + 1 >= questions.length ? "Finish" : "Next →"}
                  </button>
                </div>
              )}
            </>
          )}
        </Panel>
      )}
    </SectionShell>
  );
}
