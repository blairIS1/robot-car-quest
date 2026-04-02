"use client";
import { useState, useEffect } from "react";

export default function MakeItMove({ onComplete }: { onComplete: () => void }) {
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(80);
  const [braking, setBraking] = useState(false);
  const [learned, setLearned] = useState({ drove: false, regen: false });

  useEffect(() => {
    const t = setInterval(() => {
      setBattery((b) => {
        if (speed > 0 && !braking) return Math.max(b - speed * 0.3, 0);
        if (braking && speed > 0) return Math.min(b + 2, 100);
        return b;
      });
    }, 200);
    return () => clearInterval(t);
  }, [speed, braking]);

  useEffect(() => {
    if (speed >= 3 && !learned.drove) setLearned((l) => ({ ...l, drove: true }));
  }, [speed, learned.drove]);

  useEffect(() => {
    if (braking && battery > 82 && !learned.regen) setLearned((l) => ({ ...l, regen: true }));
  }, [braking, battery, learned.regen]);

  const done = learned.drove && learned.regen;
  const carX = speed * 8;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <h2 className="text-3xl font-bold">🔄 Quest 2: Make It Move!</h2>
      <p className="opacity-70 text-center max-w-md">
        An electric motor spins to move the car. When you brake, the motor runs
        backwards and charges the battery! This is called <b>regenerative braking</b>.
      </p>

      {/* Road + car */}
      <div className="w-full max-w-lg h-24 bg-gray-800 rounded-2xl relative overflow-hidden flex items-end">
        <div className="absolute bottom-0 w-full h-1 bg-gray-600" />
        <div className="text-5xl absolute bottom-2 transition-all duration-200 car" style={{ left: `${Math.min(carX, 85)}%` }}>
          🛻
        </div>
      </div>

      {/* Battery */}
      <div className="w-64">
        <div className="flex justify-between text-sm opacity-70 mb-1">
          <span>🔋 Battery</span>
          <span>{Math.round(battery)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${battery}%`, background: braking ? "var(--success)" : undefined }} />
        </div>
        {braking && speed > 0 && <div className="text-center text-sm mt-1" style={{ color: "var(--success)" }}>⚡ Regenerating!</div>}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm opacity-70">Speed: {speed}</label>
        <input type="range" min={0} max={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-64" />
        <button
          className={`btn text-xl ${braking ? "btn-success" : "btn-primary"}`}
          onPointerDown={() => setBraking(true)}
          onPointerUp={() => setBraking(false)}
          onPointerLeave={() => setBraking(false)}
        >
          {braking ? "⚡ Regenerating!" : "🛑 Hold to Brake"}
        </button>
      </div>

      {/* Checklist */}
      <div className="flex gap-4 text-sm">
        <span>{learned.drove ? "✅" : "⬜"} Drive fast</span>
        <span>{learned.regen ? "✅" : "⬜"} Regen brake</span>
      </div>

      {done && (
        <button className="btn btn-success mt-2 fade-in" onClick={onComplete}>
          Next Quest →
        </button>
      )}
    </div>
  );
}
