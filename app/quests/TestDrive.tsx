"use client";
import { useState, useEffect } from "react";

const SCENES = [
  { emoji: "🟢", label: "Green light ahead", correct: "go", carAction: "Car sees green — vroom!" },
  { emoji: "🛑", label: "Stop sign!", correct: "stop", carAction: "Car sees the stop sign and brakes!" },
  { emoji: "🚶", label: "Person crossing the road", correct: "stop", carAction: "Car waits for the person to cross safely." },
  { emoji: "➡️", label: "Open road ahead", correct: "go", carAction: "All clear — car drives on!" },
  { emoji: "🔴", label: "Red light!", correct: "stop", carAction: "Car stops at the red light." },
];

export default function TestDrive({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [carPos, setCarPos] = useState(10);

  useEffect(() => {
    if (picked === SCENES[idx]?.correct) {
      const t = setInterval(() => setCarPos((p) => Math.min(p + 2, 90)), 50);
      const stop = setTimeout(() => { clearInterval(t); setCarPos(10); }, 1200);
      return () => { clearInterval(t); clearTimeout(stop); };
    }
  }, [picked, idx]);

  const scene = SCENES[idx];

  const choose = (c: string) => {
    setPicked(c);
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 < SCENES.length) setIdx(idx + 1);
      else setDone(true);
    }, 2000);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-8xl">✅</div>
        <h2 className="text-3xl font-bold text-center">Test Drive Complete!</h2>
        <div className="text-6xl my-4"><span className="car">🛻</span>✨</div>
        <p className="text-lg text-center max-w-md opacity-80">
          Your Cybertruck can drive and make decisions! But can it drive all by itself?
          Time to unlock self-driving mode...
        </p>
        <button className="btn btn-success mt-4" onClick={onComplete}>
          Next Quest →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <h2 className="text-3xl font-bold">🛻 Quest 4: Test Drive!</h2>
      <p className="opacity-70 text-center max-w-md">
        Your robot car is on the road! Help it decide what to do.
      </p>

      <div className="text-sm opacity-70">{idx + 1} / {SCENES.length}</div>

      {/* Road */}
      <div className="w-full max-w-lg h-28 bg-gray-800 rounded-2xl relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-gray-600" />
        <div className="text-5xl absolute bottom-3 transition-all car" style={{ left: `${carPos}%`, transitionDuration: "0.15s" }}>🛻</div>
        <div className="text-5xl absolute top-3 right-8">{scene.emoji}</div>
      </div>

      <div className="text-xl font-semibold">{scene.label}</div>

      {picked ? (
        <div className="text-lg text-center fade-in" style={{ color: picked === scene.correct ? "var(--success)" : "var(--warn)" }}>
          {picked === scene.correct ? `✅ ${scene.carAction}` : `❌ Not quite — the car should ${scene.correct}!`}
        </div>
      ) : (
        <div className="flex gap-4 fade-in">
          <button className="btn text-2xl" style={{ background: "#ef4444" }} onClick={() => choose("stop")}>
            🛑 STOP
          </button>
          <button className="btn text-2xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => choose("go")}>
            ✅ GO
          </button>
        </div>
      )}
    </div>
  );
}
