"use client";
import { useState, useEffect, useCallback } from "react";

interface Event {
  emoji: string;
  label: string;
  correct: "stop" | "go";
  aiChoice: "stop" | "go"; // AI's decision — sometimes wrong!
  aiDelay: number; // ms before AI acts
}

const EVENTS: Event[] = [
  { emoji: "🟢", label: "Green light", correct: "go", aiChoice: "go", aiDelay: 800 },
  { emoji: "🛑", label: "Stop sign", correct: "stop", aiChoice: "stop", aiDelay: 600 },
  { emoji: "🐕", label: "Dog on the road!", correct: "stop", aiChoice: "go", aiDelay: 2000 }, // AI mistake!
  { emoji: "➡️", label: "Open road", correct: "go", aiChoice: "go", aiDelay: 500 },
  { emoji: "🔴", label: "Red light", correct: "stop", aiChoice: "stop", aiDelay: 700 },
  { emoji: "🚶", label: "Kid crossing!", correct: "stop", aiChoice: "go", aiDelay: 2200 }, // AI mistake!
  { emoji: "🟢", label: "Green light", correct: "go", aiChoice: "go", aiDelay: 600 },
  { emoji: "🚧", label: "Construction zone", correct: "stop", aiChoice: "stop", aiDelay: 900 },
  { emoji: "🛒", label: "Shopping cart rolling!", correct: "stop", aiChoice: "go", aiDelay: 1800 }, // AI mistake!
  { emoji: "➡️", label: "Highway clear", correct: "go", aiChoice: "go", aiDelay: 400 },
];

export default function SelfDriving({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [carPos, setCarPos] = useState(10);
  const [phase, setPhase] = useState<"driving" | "event" | "result">("driving");
  const [overridden, setOverridden] = useState(false);
  const [aiActed, setAiActed] = useState(false);
  const [saves, setSaves] = useState(0);
  const [crashes, setCrashes] = useState(0);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(0);

  const event = EVENTS[idx];
  const aiWrong = event.correct !== event.aiChoice;

  // Car drives forward between events
  useEffect(() => {
    if (phase !== "driving") return;
    const t = setInterval(() => setCarPos((p) => Math.min(p + 1, 70)), 6000);
    const show = setTimeout(() => { setPhase("event"); setTimer(0); }, 150000);
    return () => { clearInterval(t); clearTimeout(show); };
  }, [phase]);

  // Timer ticks during event phase
  useEffect(() => {
    if (phase !== "event") return;
    const t = setInterval(() => setTimer((v) => v + 100), 10000);
    return () => clearInterval(t);
  }, [phase]);

  // AI acts after its delay
  useEffect(() => {
    if (phase !== "event" || overridden || aiActed) return;
    if (timer >= event.aiDelay) setAiActed(true);
  }, [phase, timer, event.aiDelay, overridden, aiActed]);

  // Resolve once AI acts (and wasn't overridden)
  useEffect(() => {
    if (!aiActed || phase !== "event") return;
    if (aiWrong) setCrashes((c) => c + 1);
    setPhase("result");
  }, [aiActed, phase, aiWrong]);

  const override = useCallback(() => {
    if (phase !== "event" || aiActed) return;
    setOverridden(true);
    setPhase("result");
    if (aiWrong) setSaves((s) => s + 1);
  }, [phase, aiActed, aiWrong]);

  // Determine result
  const getResult = () => {
    if (overridden) {
      if (aiWrong) return { icon: "🦸", text: `Great save! The AI wanted to GO but you stopped the car. ${event.label} — the car should STOP!`, ok: true };
      return { icon: "😅", text: `False alarm — the AI had it right. No harm done though!`, ok: true };
    }
    if (!aiWrong) return { icon: "🤖✅", text: `AI got it right! ${event.label} → ${event.aiChoice.toUpperCase()}`, ok: true };
    return { icon: "💥", text: `Oops! The AI chose GO but should have STOPPED for "${event.label}"! You needed to override!`, ok: false };
  };

  const advance = () => {
    if (idx + 1 >= EVENTS.length) { setDone(true); return; }
    setIdx(idx + 1);
    setCarPos(10);
    setPhase("driving");
    setOverridden(false);
    setAiActed(false);
    setTimer(0);
  };

  if (done) {
    const total = EVENTS.filter((e) => e.correct !== e.aiChoice).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-8xl">🎉</div>
        <h2 className="text-3xl font-bold text-center">Self-Driving Complete!</h2>
        <div className="text-6xl my-2"><span className="car">🛻</span>🤖✨</div>
        <div className="flex gap-6 text-lg">
          <span>🦸 Saves: {saves}/{total}</span>
          <span>💥 Crashes: {crashes}</span>
        </div>
        <p className="text-lg text-center max-w-md opacity-80">
          Even smart AI makes mistakes! That&apos;s why Tesla still needs a human
          driver paying attention. You were the safety driver!
        </p>
        <button className="btn btn-success mt-4" onClick={onComplete}>
          🏠 Back to Menu
        </button>
      </div>
    );
  }

  const result = phase === "result" ? getResult() : null;

  // Urgency bar — shows time left before AI acts (only when AI will be wrong)
  const urgencyPct = aiWrong ? Math.min((timer / event.aiDelay) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <h2 className="text-3xl font-bold">🤖 Quest 5: Self-Driving!</h2>
      <p className="opacity-70 text-center max-w-md">
        The car drives itself now! But the AI isn&apos;t perfect — watch for mistakes
        and hit the <b>OVERRIDE</b> button before it crashes!
      </p>

      <div className="text-sm opacity-70">{idx + 1} / {EVENTS.length}</div>

      {/* Road */}
      <div className="w-full max-w-lg h-28 bg-gray-800 rounded-2xl relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-gray-600" />
        <div className="text-5xl absolute bottom-3 transition-all car" style={{ left: `${carPos}%`, transitionDuration: "15s" }}>🛻</div>
        {phase !== "driving" && <div className="text-5xl absolute top-3 right-8">{event.emoji}</div>}
        {/* AI thinking indicator */}
        {phase === "event" && !aiActed && !overridden && (
          <div className="absolute top-3 left-4 text-sm opacity-70">🤖 AI thinking...</div>
        )}
      </div>

      {/* Urgency bar — only shows when AI is about to make a mistake */}
      {phase === "event" && aiWrong && !overridden && !aiActed && (
        <div className="w-full max-w-lg">
          <div className="text-sm text-center mb-1" style={{ color: "var(--warn)" }}>⚠️ Override before the AI acts!</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${urgencyPct}%`, background: urgencyPct > 70 ? "#ef4444" : "var(--warn)", transition: "width 0.1s linear" }} />
          </div>
        </div>
      )}

      {phase === "event" && <div className="text-xl font-semibold">{event.label}</div>}

      {/* Override button */}
      {phase === "event" && !overridden && !aiActed && (
        <button className="btn text-2xl fade-in" style={{ background: "#ef4444", animation: "pulse 0.6s infinite alternate" }} onClick={override}>
          🛑 OVERRIDE — STOP THE CAR!
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="flex flex-col items-center gap-3 fade-in">
          <div className="text-5xl">{result.icon}</div>
          <div className="text-lg text-center max-w-md" style={{ color: result.ok ? "var(--success)" : "var(--warn)" }}>
            {result.text}
          </div>
          <button className="btn btn-primary mt-2" onClick={advance}>
            {idx + 1 < EVENTS.length ? "Continue →" : "See Results"}
          </button>
        </div>
      )}

      {/* Score */}
      <div className="flex gap-4 text-sm opacity-70">
        <span>🦸 Saves: {saves}</span>
        <span>💥 Crashes: {crashes}</span>
      </div>
    </div>
  );
}
