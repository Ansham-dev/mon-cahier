"use client";

import { useState } from "react";
import { SectionShell, Panel, PixelHeading } from "@/components/ui";
import { WRITING_PROMPTS } from "@/lib/data/content";
import { useProgress } from "@/lib/progress";

export default function EcriturePage() {
  const { markDone, isDone } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [saved, setSaved] = useState(false);
  const prompt = WRITING_PROMPTS.find((w) => w.id === activeId);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  function save() {
    if (!prompt) return;
    markDone("writing", prompt.id, 30);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function checkUseful() {
    if (!prompt) return [];
    const missing = prompt.useful.filter((u) => !text.toLowerCase().includes(u.toLowerCase()));
    return missing;
  }

  if (!prompt) {
    return (
      <SectionShell title="EXPRESSION ÉCRITE" subtitle="La plume, pas la peur.">
        <div className="grid gap-3">
          {WRITING_PROMPTS.map((w) => (
            <Panel
              key={w.id}
              className="hover:brightness-[1.03] flex items-center gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4 w-full" onClick={() => setActiveId(w.id)}>
                <span className="text-2xl">{isDone("writing", w.id) ? "✅" : "🪶"}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[var(--burgundy)]">{w.title}</h3>
                  <p className="text-xs text-[var(--brown)]">{w.levelnote} · {w.minWords}+ words</p>
                </div>
                <span className="ml-auto pixel-btn-sm px-2 py-1 text-xs shrink-0">Écrire →</span>
              </div>
            </Panel>
          ))}
        </div>
      </SectionShell>
    );
  }

  const missing = checkUseful();

  return (
    <SectionShell title="EXPRESSION ÉCRITE" subtitle={prompt.title}>
      <Panel className="mb-4">
        <PixelHeading>📰 Le sujet</PixelHeading>
        <p className="text-sm leading-relaxed">{prompt.prompt}</p>
        <p className="text-xs text-[var(--brown)] mt-2">
          Try to use: {prompt.useful.map((u) => <code key={u} className="bg-[#efe0c8] px-1 mr-1">{u}</code>)}
        </p>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between mb-2">
          <PixelHeading>✍️ Ton texte</PixelHeading>
          <span className={`text-xs ${words >= prompt.minWords ? "text-green-700" : "text-[var(--brown)]"}`}>
            {words} / {prompt.minWords} mots
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 pixel-panel !shadow-none !box-border p-3 text-sm outline-none leading-relaxed"
          placeholder="Chers lecteurs du cahier…"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={save}
            disabled={words < prompt.minWords}
            className={`pixel-btn px-4 py-2 text-xs font-pixel ${words >= prompt.minWords ? "" : "opacity-50 cursor-not-allowed"}`}
          >
            Remettre la copie +30 XP
          </button>
          <button onClick={() => setShowModel((s) => !s)} className="pixel-btn-sm px-4 py-2 text-xs">
            {showModel ? "Cacher le modèle" : "👁 Model answer"}
          </button>
          <button onClick={() => setActiveId(null)} className="pixel-btn-sm px-4 py-2 text-xs">
            ← Retour
          </button>
        </div>

        {saved && <p className="text-green-700 text-sm mt-2">Copie enregistrée ! Votre professeur (le chat) est fier. 🐱</p>}

        {missing.length > 0 && words > 10 && (
          <p className="text-xs text-[var(--brown)] mt-2">
            Still missing connectors: {missing.map((m) => `« ${m} »`).join(", ")}
          </p>
        )}

        {showModel && (
          <div className="mt-4 border-t-2 border-dashed border-[#c9b28f] pt-3">
            <p className="font-pixel text-[9px] text-[var(--burgundy)] mb-2">MODÈLE RÉDACTIONNEL</p>
            <p className="text-sm whitespace-pre-line leading-relaxed">{prompt.model}</p>
          </div>
        )}
      </Panel>

    </SectionShell>
  );
}
