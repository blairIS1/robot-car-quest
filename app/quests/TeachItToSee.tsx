"use client";
import { useState } from "react";
import { TRAIN_ITEMS, TrainingData } from "./data";

export default function TeachItToSee({ onComplete }: { onComplete: (data: TrainingData) => void }) {
  const [items] = useState(() => [...TRAIN_ITEMS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [training, setTraining] = useState<TrainingData>({});
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  const current = items[idx];

  const answer = (choice: "stop" | "go") => {
    const correct = choice === current.answer;
    if (correct) {
      setTraining((t) => ({ ...t, [current.category]: (t[current.category] || 0) + 1 }));
      setFeedback("✅ Correct! The car learned about " + current.label + "!");
    } else {
      setFeedback(`❌ Oops! The car should ${current.answer} for "${current.label}"`);
    }
    setTimeout(() => {
      setFeedback("");
      if (idx + 1 < items.length) setIdx(idx + 1);
      else setDone(true);
    }, 1500);
  };

  if (done) {
    const total = Object.values(training).reduce((a, b) => a + b, 0);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <h2 className="text-3xl font-bold">👁️ Training Complete!</h2>
        <div className="text-8xl">🧠</div>
        <p className="text-xl">You labeled <b>{total}/{items.length}</b> correctly!</p>
        <p className="opacity-70 text-center max-w-md">
          Let&apos;s see how well the car&apos;s AI brain learned from your training data...
        </p>
        <button className="btn btn-success mt-4" onClick={() => onComplete(training)}>
          See Training Results →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <h2 className="text-3xl font-bold">👁️ Quest 3: Teach It to See!</h2>
      <p className="opacity-70 text-center max-w-md">
        The car has cameras but its AI brain needs to learn what to do.
        Help train it — should the car STOP or GO?
      </p>

      <div className="text-sm opacity-70">{idx + 1} / {items.length}</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${(idx / items.length) * 100}%` }} />
      </div>

      <div className="text-8xl my-4">{current.emoji}</div>
      <div className="text-xl font-semibold">{current.label}</div>
      <div className="text-xs opacity-50">Category: {current.category}</div>

      <div className="text-lg min-h-[2em] font-semibold">{feedback}</div>

      {!feedback && (
        <div className="flex gap-4 fade-in">
          <button className="btn text-2xl" style={{ background: "#ef4444" }} onClick={() => answer("stop")}>
            🛑 STOP
          </button>
          <button className="btn text-2xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => answer("go")}>
            ✅ GO
          </button>
        </div>
      )}
    </div>
  );
}
