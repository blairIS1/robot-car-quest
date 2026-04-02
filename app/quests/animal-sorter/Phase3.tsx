"use client";
import { useState } from "react";
import { TRICKY_ROUNDS, ANIMALS } from "./data";

export default function Phase3({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const round = TRICKY_ROUNDS[idx];
  if (!round) {
    const pct = Math.round((score / TRICKY_ROUNDS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-7xl">🎉</div>
        <h2 className="text-3xl font-bold text-center">Quest Complete!</h2>
        <div className="text-6xl my-2">🤖🧠✨</div>
        <p className="text-xl">Your robot's brain is <b>{pct}%</b> accurate!</p>
        <p className="text-lg opacity-80 text-center max-w-md">
          Even tricky animals are hard for AI! Real Google AI learns from millions of photos — just like you taught your robot today!
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button className="btn btn-success mt-4" onClick={() => onComplete(score)}>🏠 Back to Menu</button>
      </div>
    );
  }

  const pick = (choice: string) => {
    if (choice === round.answer) {
      setScore((s) => s + 1);
      setFeedback("✅ " + round.reason);
    } else {
      setFeedback("❌ " + round.reason);
    }
    setTimeout(() => { setFeedback(""); setIdx((i) => i + 1); }, 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <h2 className="text-3xl font-bold">🤔 Phase 3: Tricky Animals!</h2>
      <p className="opacity-70 text-center max-w-md">
        Even the robot is confused! Help it decide — which category fits better?
      </p>
      <div className="text-sm opacity-70">{idx + 1} / {TRICKY_ROUNDS.length}</div>

      {/* Tricky animal */}
      <div className="text-8xl my-4">{round.emoji}</div>
      <div className="text-2xl font-semibold">{round.label}</div>
      <div className="text-lg opacity-70">🤖 "Hmm... I'm not sure about this one!"</div>

      {/* Feedback */}
      <div className="text-lg min-h-[2em] font-semibold text-center max-w-md">{feedback}</div>

      {/* Options */}
      {!feedback && (
        <div className="flex gap-4 fade-in">
          {round.options.map((opt) => {
            const a = ANIMALS.find((x) => x.id === opt)!;
            const Icon = a.icon;
            return (
              <button key={opt} className="btn flex flex-col items-center gap-2 px-8 py-4" style={{ background: "var(--card)" }} onClick={() => pick(opt)}>
                <Icon size={40} color={a.color} strokeWidth={1.5} />
                <span className="capitalize">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
