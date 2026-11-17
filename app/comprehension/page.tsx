"use client";

import { useRef, useState } from "react";
import { SectionShell, Panel, PixelHeading, ChoiceButton } from "@/components/ui";
import { READINGS, ComprehensionText } from "@/lib/data/content";
import { useProgress } from "@/lib/progress";

const LISTENING_SCRIPTS = [
  {
    id: "l-francais",
    title: "🎙️ Écoute : les secrets d'apprentissage",
    script:
      "Bonsoir à tous et bienvenue dans notre émission. Ce soir, nous parlons d'apprentissage des langues. Beaucoup de nos auditeurs demandent : combien de temps faut-il étudier chaque jour ? Notre invitée, professeure à La Sorbonne, répond : vingt minutes chaque jour valent mieux que trois heures le dimanche. Elle recommande aussi de lire à voix haute et de répéter des phrases entières, pas seulement des mots isolés. Et surtout, elle insiste : faites des erreurs avec plaisir, car chaque erreur est une petite porte vers le progrès. Bonne nuit à tous et bonne route vers le français !",
    questions: [
      { q: "Combien de temps d'étude quotidienne est conseillé ?", choices: ["3 heures le dimanche", "20 minutes chaque jour", "1 heure chaque matin", "60 minutes le samedi"], answer: 1 },
      { q: "Qui est l'invitée de l'émission ?", choices: ["Une journaliste", "Une étudiante", "Une professeure à La Sorbonne", "Une auteure de romans"], answer: 2 },
      { q: "Que recommande-t-elle de répéter ?", choices: ["Des mots isolés", "Des listes de règles", "Des phrases entières", "Des chansons"], answer: 2 },
      { q: "Quelle est son attitude envers les erreurs ?", choices: ["Il faut les éviter totalement", "Elles sont embarrassantes", "Elles sont utiles au progrès", "Elles sont amusantes à corriger"], answer: 2 },
    ],
  },
];

export default function ComprehensionPage() {
  const { markDone, isDone, addXp } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const reading: ComprehensionText | undefined = READINGS.find((r) => r.id === activeId);
  const listening = LISTENING_SCRIPTS.find((l) => l.id === activeId);

  function playScript(script: string) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(script);
      u.lang = "fr-FR";
      u.rate = 0.9;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      utterRef.current = u;
      synth.speak(u);
    } catch {}
  }

  function stopAudio() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  const questions = reading?.questions ?? listening?.questions ?? [];
  const answered = Object.keys(picked).length;
  const correct = questions.filter((q, i) => picked[i] === q.answer).length;

  function finish() {
    if (reading) markDone("comprehension", reading.id, 25);
    if (listening) markDone("comprehension", listening.id, 25);
    if (correct === questions.length) addXp(10, "Aucune faute !");
  }

  if (!activeId) {
    return (
      <SectionShell title="COMPRÉHENSION" subtitle="Lire et écouter, deux super-pouvoirs.">
        <div className="grid gap-3">
          {READINGS.map((r) => (
            <Panel key={r.id} className="hover:brightness-[1.03]">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{isDone("comprehension", r.id) ? "📰" : "📄"}</span>
                <div>
                  <h3 className="font-bold text-[var(--burgundy)]">{r.title}</h3>
                  <p className="text-xs text-[var(--brown)]">Lecture · {r.questions.length} questions</p>
                </div>
                <button
                  onClick={() => {
                    setActiveId(r.id);
                    setPicked({});
                  }}
                  className="ml-auto pixel-btn px-3 py-2 text-xs font-pixel shrink-0"
                >
                  Lire →
                </button>
              </div>
            </Panel>
          ))}
          {LISTENING_SCRIPTS.map((l) => (
            <Panel key={l.id} className="hover:brightness-[1.03]">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{isDone("comprehension", l.id) ? "🎧" : "🎙️"}</span>
                <div>
                  <h3 className="font-bold text-[var(--burgundy)]">{l.title}</h3>
                  <p className="text-xs text-[var(--brown)]">Écoute · {l.questions.length} questions</p>
                </div>
                <button
                  onClick={() => {
                    setActiveId(l.id);
                    setPicked({});
                  }}
                  className="ml-auto pixel-btn px-3 py-2 text-xs font-pixel shrink-0"
                >
                  Écouter →
                </button>
              </div>
            </Panel>
          ))}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell title="COMPRÉHENSION" subtitle={reading?.title ?? listening!.title}>
      {reading && (
        <Panel className="mb-4">
          <PixelHeading>📖 Le texte</PixelHeading>
          <p className="text-sm whitespace-pre-line leading-relaxed">{reading.text}</p>
        </Panel>
      )}

      {listening && (
        <Panel className="mb-4 text-center">
          <PixelHeading>🎧 L'audio</PixelHeading>
          <button
            onClick={() => (speaking ? stopAudio() : playScript(listening.script))}
            className="pixel-btn px-6 py-3 text-sm font-pixel text-xs"
          >
            {speaking ? "⏸ Stop" : "▶ Écouter"}
          </button>
          <p className="text-xs text-[var(--brown)] mt-2">Listen twice, then answer. (Uses your browser's French voice)</p>
          <details className="mt-2 text-left">
            <summary className="text-xs text-[var(--brown)] cursor-pointer">Show transcript 🔍 (after answering!)</summary>
            <p className="text-xs whitespace-pre-line mt-2 text-[var(--brown)] italic">{listening.script}</p>
          </details>
        </Panel>
      )}

      <Panel>
        <PixelHeading>
          ❓ Questions ({correct}/{questions.length} correct so far)
        </PixelHeading>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i}>
              <p className="text-sm font-semibold mb-2">
                {i + 1}. {q.q}
              </p>
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
        <button
          onClick={finish}
          disabled={answered < questions.length}
          className={`pixel-btn px-4 py-2 text-xs font-pixel mt-5 ${answered >= questions.length ? "" : "opacity-50 cursor-not-allowed"}`}
        >
          Terminer ({correct}/{questions.length})
        </button>
        <button onClick={() => setActiveId(null)} className="pixel-btn-sm px-4 py-2 text-xs mt-5 ml-2">
          ← Retour
        </button>
      </Panel>
    </SectionShell>
  );
}
