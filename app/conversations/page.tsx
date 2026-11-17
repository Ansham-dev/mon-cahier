"use client";

import { useRef, useState } from "react";
import { SectionShell, Panel, PixelHeading } from "@/components/ui";
import { ROLEPLAYS, Roleplay } from "@/lib/data/content";
import { useProgress } from "@/lib/progress";

type Msg = { who: "them" | "me" | "system"; text: string };

export default function ConversationsPage() {
  const { markDone, isDone, addXp } = useProgress();
  const [rp, setRp] = useState<Roleplay | null>(null);
  const [step, setStep] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; hint: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function start(roleplay: Roleplay) {
    setRp(roleplay);
    setStep(0);
    setMsgs([{ who: "them", text: roleplay.turns[0].prompt }]);
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function speak(text: string) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR";
      u.rate = 0.92;
      synth.speak(u);
    } catch {}
  }

  function send() {
    if (!rp || !input.trim()) return;
    const turn = rp.turns[step];
    const answer = input.trim();
    setMsgs((m) => [...m, { who: "me", text: answer }]);
    setInput("");

    const ok = turn.keywords.some((group) => group.some((kw) => answer.toLowerCase().includes(kw.toLowerCase())));
    setFeedback({ ok, hint: turn.hint });

    if (ok) {
      // continue conversation
      if (step + 1 < rp.turns.length) {
        setTimeout(() => {
          speak(rp.turns[step + 1].prompt);
          setMsgs((m) => [...m, { who: "them", text: rp.turns[step + 1].prompt }]);
        }, 500);
        setStep((s) => s + 1);
      } else {
        setTimeout(() => {
          setMsgs((m) => [...m, { who: "them", text: "🌟 Parfait ! Vous avez terminé la conversation. Bravo !" }]);
          markDone("conversations", rp.id, 25);
          addXp(5, "Roleplay finished");
        }, 500);
      }
    }
  }

  if (!rp) {
    return (
      <SectionShell title="CONVERSATIONS" subtitle="Parlez comme dans un vrai café parisien.">
        <div className="grid gap-3">
          {ROLEPLAYS.map((r) => (
            <Panel key={r.id} className="hover:brightness-[1.03]">
              <div className="flex items-center gap-4">
                <span className="text-2xl">☕</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[var(--burgundy)]">{r.title}</h3>
                  <p className="text-xs text-[var(--brown)] line-clamp-2">{r.intro}</p>
                </div>
                <button onClick={() => start(r)} className="ml-auto pixel-btn px-3 py-2 text-xs font-pixel shrink-0">
                  {isDone("conversations", r.id) ? "Rejouer ↻" : "Démarrer ▶"}
                </button>
              </div>
            </Panel>
          ))}
        </div>
        <Panel className="mt-4 !bg-[#efe0c8]">
          <p className="text-xs text-[var(--brown)]">
            💡 Tip: click a message to hear it spoken with French text-to-speech. Your answer must include a key word —
            the hint shows you how to build the sentence.
          </p>
        </Panel>
      </SectionShell>
    );
  }

  const done = msgs.some((m) => m.text.startsWith("🌟"));

  return (
    <SectionShell title="CONVERSATIONS" subtitle={rp.title}>
      <Panel className="!bg-[#fff8ec]">
        <PixelHeading>
          {rp.title} · line {Math.min(step + 1, rp.turns.length)}/{rp.turns.length}
        </PixelHeading>
        <div className="h-[46vh] min-h-72 overflow-y-auto flex flex-col gap-2 pr-2 mb-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
              <button
                onClick={() => m.who === "them" && speak(m.text)}
                className={`max-w-[85%] text-sm px-3 py-2 text-left ${
                  m.who === "me"
                    ? "bg-[var(--lavender)] text-[#2c1a3e] border-2 border-[#4a3226] rounded-br-none"
                    : m.who === "them"
                      ? "bg-[var(--dusty-pink)] text-[#4a3226] border-2 border-[#4a3226] rounded-bl-none"
                      : "bg-[#fdf3e3] italic text-[var(--brown)] border-2 border-[#c9b28f]"
                }`}
                style={{ borderRadius: 6 }}
                title={m.who === "them" ? "🔊 Click to listen" : undefined}
              >
                {m.who === "them" && <span className="mr-1">🧑‍🍳</span>}
                {m.text}
              </button>
            </div>
          ))}
        </div>

        {done ? (
          <div className="flex gap-2">
            <button onClick={() => setRp(null)} className="pixel-btn px-4 py-2 text-sm font-pixel text-xs">
              ← Autres conversations
            </button>
            <button onClick={() => start(rp)} className="pixel-btn-sm px-4 py-2 text-sm">
              Rejouer ↻
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Écrivez votre réponse en français…"
                className="font-sans pixel-panel !shadow-none !box-border px-3 py-2 text-sm flex-1 outline-none italic-none"
              />
              <button onClick={send} className="pixel-btn px-4 py-2 text-sm font-pixel text-xs">
                Dire →
              </button>
            </div>
            {feedback && (
              <div className="mt-2">
                <button
                  onClick={() => setRp(null)}
                  className="float-right text-xs underline text-[var(--brown)]"
                >
                  ← quitter
                </button>
                <p className={`text-xs ${feedback.ok ? "text-green-700" : "text-red-700"}`}>
                  {feedback.ok
                    ? "✓ Bien dit ! Continuez…"
                    : "✗ Le personnage n'a pas compris. Regardez l'indice :"}
                </p>
                {!feedback.ok && <p className="text-xs text-[var(--brown)] mt-1">💡 {feedback.hint}</p>}
              </div>
            )}
          </>
        )}
      </Panel>
    </SectionShell>
  );
}
