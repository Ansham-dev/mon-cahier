"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type AudioCtx = {
  musicOn: boolean;
  rainOn: boolean;
  volume: number;
  setVolume: (v: number) => void;
  toggleMusic: () => void;
  toggleRain: () => void;
};

const Ctx = createContext<AudioCtx | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicOn, setMusicOn] = useState(false);
  const [rainOn, setRainOn] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const engine = useRef<Engine | null>(null);

  useEffect(() => {
    if (!engine.current) engine.current = new Engine();
    const e = engine.current;
    e.setVolume(volume);
  }, [volume]);

  const toggleMusic = useCallback(() => {
    if (!engine.current) return;
    const on = engine.current.toggleMusic();
    setMusicOn(on);
  }, []);

  const toggleRain = useCallback(() => {
    if (!engine.current) return;
    const on = engine.current.toggleRain();
    setRainOn(on);
  }, []);

  return (
    <Ctx.Provider value={{ musicOn, rainOn, volume, setVolume, toggleMusic, toggleRain }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLofi() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLofi outside provider");
  return ctx;
}

/* Cozy generative lofi engine: soft chord pads + gentle bass + vinyl crackle + rain noise */
class Engine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  musicBus: GainNode | null = null;
  rainBus: GainNode | null = null;
  musicPlaying = false;
  rainPlaying = false;
  chordTimer: ReturnType<typeof setInterval> | null = null;
  crackleTimer: ReturnType<typeof setInterval> | null = null;
  rainSource: AudioBufferSourceNode | null = null;

  ensure() {
    if (!this.ctx) {
      const AC =
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
        window.AudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._pending;
      this.master.connect(this.ctx.destination);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.9;
      this.musicBus.connect(this.master);
      this.rainBus = this.ctx.createGain();
      this.rainBus.gain.value = 0.55;
      this.rainBus.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx!;
  }

  setVolume(v: number) {
    if (this.master) this.master.gain.setTargetAtTime(v, this.ctx!.currentTime, 0.1);
    else this._pending = v;
  }
  _pending = 0.4;

  toggleMusic(): boolean {
    const ctx = this.ensure();
    if (!this.musicPlaying) {
      this.master!.gain.setTargetAtTime(this._pending, ctx.currentTime, 0.1);
      this.startChords();
      this.startCrackle();
      this.musicPlaying = true;
    } else {
      this.stopChords();
      this.stopCrackle();
      this.musicPlaying = false;
    }
    return this.musicPlaying;
  }

  toggleRain(): boolean {
    this.ensure();    if (!this.rainPlaying) {
      this.startRain();
      this.rainPlaying = true;
    } else {
      this.rainSource?.stop();
      this.rainSource = null;
      this.rainPlaying = false;
    }
    return this.rainPlaying;
  }

  /* ---------- rain ---------- */
  private startRain() {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 300;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    src.connect(hp).connect(lp).connect(g).connect(this.rainBus!);
    src.start();
    this.rainSource = src;
  }

  /* ---------- vinyl crackle ---------- */
  private startCrackle() {
    const ctx = this.ctx!;
    this.crackleTimer = setInterval(() => {
      if (Math.random() < 0.6) {
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = 2000 + Math.random() * 3000;
        g.gain.setValueAtTime(0.012, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        o.connect(g).connect(this.musicBus!);
        o.start(t);
        o.stop(t + 0.04);
      }
    }, 220);
  }
  private stopCrackle() {
    if (this.crackleTimer) clearInterval(this.crackleTimer);
    this.crackleTimer = null;
  }

  /* ---------- chords ---------- */
  // Fmaj7 - Am7 - Dm7 - Cmaj7 / Bbmaj7 - Gm7 style progression (Hz via midi)
  progression = [
    [53, 57, 60, 64], // Fmaj7
    [45, 52, 55, 60], // Am7 low
    [50, 53, 57, 60], // Dm7
    [48, 55, 59, 62], // Cmaj7-ish
    [46, 50, 53, 58], // Bbmaj7
    [43, 50, 55, 58], // Gm7
  ];
  step = 0;

  private startChords() {
    const ctx = this.ctx!;
    this.chordTimer = setInterval(() => {
      const chord = this.progression[this.step % this.progression.length];
      this.step++;
      const t = ctx.currentTime + 0.02;
      const root = chord[0] - 12;
      // soft bass
      this.pad([root], t, 3.4, 0.05, "sine");
      this.pad(chord, t, 4.2, 0.035, "triangle");
      // occasional gentle melody note
      if (Math.random() < 0.7) {
        const mel = chord[Math.floor(Math.random() * chord.length)] + 12;
        setTimeout(() => {
          const t2 = ctx.currentTime + 0.02;
          this.pad([mel], t2, 1.6, 0.03, "sine");
        }, 1400);
      }
    }, 3800);
  }
  private stopChords() {
    if (this.chordTimer) clearInterval(this.chordTimer);
    this.chordTimer = null;
  }

  private pad(midis: number[], start: number, dur: number, vol: number, type: OscillatorType) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    g.connect(lp).connect(this.musicBus!);
    for (const m of midis) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
      o.detune.value = (Math.random() - 0.5) * 8;
      o.connect(g);
      o.start(start);
      o.stop(start + dur + 0.1);
    }
  }
}
