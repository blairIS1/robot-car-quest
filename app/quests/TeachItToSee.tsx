"use client";
import { useState } from "react";

const ITEMS = [
  { emoji: "🛑", label: "Stop Sign", answer: "stop" },
  { emoji: "🟢", label: "Green Light", answer: "go" },
  { emoji: "🚶", label: "Person Walking", answer: "stop" },
  { emoji: "🌳", label: "Tree", answer: "go" },
  { emoji: "🔴", label: "Red Light", answer: "stop" },
  { emoji: "🐕", label: "Dog on Road", answer: "stop" },
  { emoji: "➡️", label: "Road Ahead Clear", answer: "go" },
  { emoji: "🚧", label: "Construction", answer: "stop" },
];

export default function TeachItToSee({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  const current = ITEMS[idx];

  const answer = (choice: "stop" | "go") => {
    const correct = choice === current.answer;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback("✅ Correct! The car learned something!");
    } else {
      setFeedback(`❌ Oops! The car should ${current.answer} for "${current.label}"`);
    }
    setTimeout(() => {
      setFeedback("");
      if (idx + 1 < ITEMS.length) {
        setIdx(idx + 1);
      } else {
        setDone(true);
      }
    }, 1500);
  };

  if (done) {
    const pct = Math.round((score / ITEMS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <h2 className="text-3xl font-bold">👁️ Training Complete!</h2>
        <div className="text-8xl">🧠</div>
        <p className="text-xl">Your car&apos;s AI brain is <b>{pct}%</b> accurate!</p>
        <p className="opacity-70 text-center max-w-md">
          You labeled {score}/{ITEMS.length} correctly. Real Tesla AI learns from
          millions of camera images — just like you taught it here!
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button className="btn btn-success mt-4" onClick={onComplete}>
          Next Quest →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <h2 className="text-3xl font-bold">👁️ Quest 3: Teach It to See!</h2>
      <p className="opacity-70 text-center max-w-md">
        Tesla has 8 cameras. The AI brain needs to learn what to do when it sees
        things. Help train it — should the car STOP or GO?
      </p>

      {/* Progress */}
      <div className="text-sm opacity-70">{idx + 1} / {ITEMS.length}</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${((idx) / ITEMS.length) * 100}%` }} />
      </div>

      {/* Current item */}
      <div className="text-8xl my-4">{current.emoji}</div>
      <div className="text-xl font-semibold">{current.label}</div>

      {/* Feedback */}
      <div className="text-lg min-h-[2em] font-semibold">{feedback}</div>

      {/* Buttons */}
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
