"use client";
import { useState, useEffect } from "react";
import { TRAIN_ITEMS, TrainingData } from "./data";
import CarBuddy from "./CarBuddy";
import { sfxCorrect, sfxWrong, sfxTap } from "./sfx";
import { speak, VOICE } from "./speak";
import Confetti from "./Confetti";

export default function TeachItToSee({ onComplete }: { onComplete: (data: TrainingData) => void }) {
  const [items] = useState(() => [...TRAIN_ITEMS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [training, setTraining] = useState<TrainingData>({});
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "scared">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { speak(VOICE.q3Start); }, []);

  const current = items[idx];

  const answer = (choice: "stop" | "go") => {
    const correct = choice === current.answer;
    if (correct) {
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      setTraining((t) => ({ ...t, [current.category]: (t[current.category] || 0) + 1 }));
      setFeedback("✅ Correct! The car learned about " + current.label + "!");
      speak(VOICE.q3Correct);
    } else {
      sfxWrong(); setMood("scared");
      setFeedback(`Oops! The car should ${current.answer} for "${current.label}" 😅`);
      speak(VOICE.q3Wrong);
    }
    setTimeout(() => {
      setFeedback(""); setMood("idle"); setShowConfetti(false);
      if (idx + 1 < items.length) setIdx(idx + 1);
      else setDone(true);
    }, 1500);
  };

  if (done) {
    const total = Object.values(training).reduce((a, b) => a + b, 0);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <CarBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">👁️ Training Complete!</h2>
        <p className="text-xl">You labeled <b>{total}/{items.length}</b> correctly!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak(VOICE.q3Done).then(() => onComplete(training)); }}>
          See Training Results →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-3xl font-bold">👁️ Quest 3: Teach It to See!</h2>
      <CarBuddy mood={mood} size={80} />
      <p className="opacity-70 text-center max-w-md text-sm">
        The car has cameras but its AI brain needs to learn. Should the car STOP or GO?
      </p>

      <div className="text-sm opacity-70">{idx + 1} / {items.length}</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${(idx / items.length) * 100}%` }} />
      </div>

      <div className="text-8xl my-2">{current.emoji}</div>
      <div className="text-xl font-semibold">{current.label}</div>
      <div className="text-xs opacity-50">Category: {current.category}</div>
      <div className="text-lg min-h-[2em] font-semibold">{feedback}</div>

      {!feedback && (
        <div className="flex gap-4 fade-in">
          <button className="btn text-2xl" style={{ background: "#ef4444" }} onClick={() => { sfxTap(); answer("stop"); }}>🛑 STOP</button>
          <button className="btn text-2xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => { sfxTap(); answer("go"); }}>✅ GO</button>
        </div>
      )}
    </div>
  );
}
