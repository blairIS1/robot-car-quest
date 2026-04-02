"use client";
import { useState, useEffect } from "react";
import CarBuddy from "./CarBuddy";
import { sfxTap, sfxCorrect, sfxWrong } from "./sfx";
import { speak, VOICE } from "./speak";
import Confetti from "./Confetti";

export default function PowerUp({ onComplete }: { onComplete: () => void }) {
  const [batteries, setBatteries] = useState(0);
  const ideal = 4;
  const max = 7;
  const status = batteries === 0 ? "empty" : batteries < ideal ? "low" : batteries === ideal ? "perfect" : batteries <= max ? "heavy" : "overload";

  useEffect(() => { speak(VOICE.q1Start); }, []);

  const msg: Record<string, string> = {
    empty: "Tap the batteries to add them to your car! 🔋",
    low: `${batteries}/${ideal} — Need more power! The car won't go far enough.`,
    perfect: "✅ Perfect! Just the right amount of batteries!",
    heavy: `⚠️ ${batteries} batteries — the car is getting too heavy...`,
    overload: "💥 Too many! The car can't even move!",
  };

  const mood = status === "perfect" ? "celebrate" as const : status === "overload" ? "scared" as const : "idle" as const;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <Confetti active={status === "perfect"} />
      <h2 className="text-3xl font-bold">⚡ Quest 1: Power Up!</h2>
      <p className="opacity-70 text-center max-w-md">
        Electric cars have a big battery under the floor. Too few batteries = car stops halfway.
        Too many = car is too heavy! Find the right number.
      </p>

      <CarBuddy mood={mood} size={120} />

      {/* Battery bar */}
      <div className="w-64">
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${Math.min((batteries / max) * 100, 100)}%`,
            background: status === "perfect" ? "var(--success)" : status === "heavy" || status === "overload" ? "var(--warn)" : undefined,
          }} />
        </div>
        <div className="text-center mt-2 text-sm opacity-70">{batteries} / {ideal} batteries</div>
      </div>

      <div className="text-lg text-center font-semibold min-h-[2em]">{msg[status]}</div>

      <div className="flex gap-3">
        <button className="btn btn-primary text-3xl" onClick={() => {
          sfxTap();
          const n = Math.min(batteries + 1, max + 1);
          setBatteries(n);
          if (n === ideal) { sfxCorrect(); speak(VOICE.q1Perfect); }
          else if (n > max) { sfxWrong(); speak(VOICE.q1TooMany); }
        }}>🔋 +1</button>
        <button className="btn text-3xl" style={{ background: "#475569" }} onClick={() => { sfxTap(); setBatteries(Math.max(batteries - 1, 0)); }}>➖</button>
      </div>

      {status === "perfect" && (
        <button className="btn btn-success mt-4 fade-in" onClick={() => { sfxTap(); onComplete(); }}>Next Quest →</button>
      )}
    </div>
  );
}
