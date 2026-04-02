"use client";
import { useState } from "react";
import { ANIMALS, CATEGORIES } from "./data";

const shuffled = [...ANIMALS, ...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 8);

export default function Phase1({ onComplete }: { onComplete: () => void }) {
  const [queue, setQueue] = useState(shuffled);
  const [sorted, setSorted] = useState(0);
  const [feedback, setFeedback] = useState("");

  const current = queue[0];
  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-7xl">🤖✨</div>
        <h2 className="text-3xl font-bold">Robot is learning!</h2>
        <p className="text-lg opacity-80">You taught it {sorted} animals. Now let's see if it can guess!</p>
        <button className="btn btn-success mt-4" onClick={onComplete}>Next →</button>
      </div>
    );
  }

  const Icon = current.icon;

  const pick = (cat: string) => {
    if (cat === current.category) {
      setFeedback("✅ Correct! Robot learned a new " + current.label + "!");
      setSorted((s) => s + 1);
    } else {
      setFeedback("❌ That's a " + current.label + ", not a " + cat + "!");
    }
    setTimeout(() => {
      setFeedback("");
      if (cat === current.category) setQueue((q) => q.slice(1));
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <h2 className="text-3xl font-bold">🏷️ Phase 1: Teach the Robot!</h2>
      <p className="opacity-70 text-center max-w-md">
        This baby robot doesn't know any animals. Tap the right bucket to teach it!
      </p>
      <div className="text-sm opacity-70">{sorted} / {shuffled.length} taught</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${(sorted / shuffled.length) * 100}%` }} />
      </div>

      {/* Current animal */}
      <div className="my-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${current.color}` }}>
        <Icon size={96} color={current.color} strokeWidth={1.5} />
      </div>
      <div className="text-xl font-semibold">What animal is this?</div>

      {/* Feedback */}
      <div className="text-lg min-h-[2em] font-semibold">{feedback}</div>

      {/* Buckets */}
      {!feedback && (
        <div className="flex flex-wrap justify-center gap-3 fade-in">
          {CATEGORIES.map((cat) => {
            const a = ANIMALS.find((x) => x.category === cat)!;
            const CatIcon = a.icon;
            return (
              <button key={cat} className="btn flex flex-col items-center gap-1 px-5 py-3" style={{ background: "var(--card)" }} onClick={() => pick(cat)}>
                <CatIcon size={32} color={a.color} strokeWidth={1.5} />
                <span className="text-sm capitalize">{cat}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
