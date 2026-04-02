"use client";
import { useState } from "react";

export default function PowerUp({ onComplete }: { onComplete: () => void }) {
  const [batteries, setBatteries] = useState(0);
  const ideal = 4;
  const max = 7;
  const status = batteries === 0 ? "empty" : batteries < ideal ? "low" : batteries === ideal ? "perfect" : batteries <= max ? "heavy" : "overload";

  const msg: Record<string, string> = {
    empty: "Tap the batteries to add them to your car! 🔋",
    low: `${batteries}/${ideal} — Need more power! The car won't go far enough.`,
    perfect: "✅ Perfect! Just the right amount of batteries!",
    heavy: `⚠️ ${batteries} batteries — the car is getting too heavy...`,
    overload: "💥 Too many! The car can't even move!",
  };

  const carEmoji = status === "overload" ? "💥" : status === "perfect" ? <><span className="car">🛻</span>✨</> : <span className="car">🛻</span>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <h2 className="text-3xl font-bold">⚡ Quest 1: Power Up!</h2>
      <p className="opacity-70 text-center max-w-md">
        A Tesla has a big battery under the floor. Too few batteries = car stops halfway.
        Too many = car is too heavy! Find the right number.
      </p>

      {/* Car visual */}
      <div className="text-7xl my-4">{carEmoji}</div>

      {/* Battery bar */}
      <div className="w-64">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((batteries / max) * 100, 100)}%`,
              background: status === "perfect" ? "var(--success)" : status === "heavy" || status === "overload" ? "var(--warn)" : undefined,
            }}
          />
        </div>
        <div className="text-center mt-2 text-sm opacity-70">{batteries} / {ideal} batteries</div>
      </div>

      {/* Message */}
      <div className="text-lg text-center font-semibold min-h-[2em]">{msg[status]}</div>

      {/* Battery buttons */}
      <div className="flex gap-3">
        <button className="btn btn-primary text-3xl" onClick={() => setBatteries(Math.min(batteries + 1, max + 1))}>
          🔋 +1
        </button>
        <button className="btn text-3xl" style={{ background: "#475569" }} onClick={() => setBatteries(Math.max(batteries - 1, 0))}>
          ➖
        </button>
      </div>

      {status === "perfect" && (
        <button className="btn btn-success mt-4 fade-in" onClick={onComplete}>
          Next Quest →
        </button>
      )}
    </div>
  );
}
