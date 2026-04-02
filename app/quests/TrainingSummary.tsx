"use client";
import { useEffect } from "react";
import { CATEGORIES, TrainingData, getConfidence } from "./data";
import CarBuddy from "./CarBuddy";
import { sfxTap } from "./sfx";
import { speak, VOICE } from "./speak";

const CAT_EMOJI: Record<string, string> = { lights: "🚦", signs: "🛑", people: "🚶", animals: "🐕", obstacles: "🚧" };

export default function TrainingSummary({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const total = Object.values(training).reduce((a, b) => a + b, 0);
  const missing = CATEGORIES.filter((c) => !training[c]);

  // Bias: one category has >50% of data
  const maxCat = CATEGORIES.reduce((a, b) => ((training[a] || 0) > (training[b] || 0) ? a : b));
  const maxCount = training[maxCat] || 0;
  const isBiased = total > 0 && maxCount / total > 0.5;

  useEffect(() => {
    speak(VOICE.summary).then(() => {
      if (isBiased) speak(VOICE.summaryBias);
    });
  }, [isBiased]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <CarBuddy mood="thinking" size={100} />
      <h2 className="text-3xl font-bold">Car&apos;s AI Brain</h2>
      <p className="text-lg opacity-80 text-center max-w-md">
        You fed the AI <b>{total}</b> correct examples. Here&apos;s what it knows:
      </p>

      <div className="flex flex-col gap-3 w-72">
        {CATEGORIES.map((cat) => {
          const count = training[cat] || 0;
          const conf = getConfidence(training, cat);
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-2xl">{CAT_EMOJI[cat]}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{cat}</span>
                  <span>{count === 0 ? "⚠️ no data!" : `${count} — ${conf}% confident`}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: count === 0 ? "#ef4444" : undefined,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isBiased && (
        <div className="rounded-xl p-4 max-w-sm text-center" style={{ background: "rgba(251,191,36,0.15)", border: "2px solid #fbbf24" }}>
          <p className="text-base font-bold" style={{ color: "#fbbf24" }}>⚠️ Bias Detected!</p>
          <p className="text-sm opacity-80 mt-1">
            Most training data is about <b className="capitalize">{maxCat}</b> ({Math.round((maxCount / total) * 100)}%).
            The car might struggle with other situations!
          </p>
        </div>
      )}

      {!isBiased && missing.length > 0 && (
        <p className="text-base opacity-70 text-center max-w-sm">
          ⚠️ No data for {missing.join(", ")}! The car will guess randomly for those.
        </p>
      )}

      {!isBiased && missing.length === 0 && (
        <p className="text-base opacity-70 text-center max-w-sm">
          The car has data for every category — nice! More data = smarter AI.
        </p>
      )}

      <button className="btn btn-success mt-4" onClick={() => { sfxTap(); onComplete(); }}>
        Test Drive →
      </button>
    </div>
  );
}
