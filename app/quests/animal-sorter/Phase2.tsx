"use client";
import { useState } from "react";
import { ANIMALS, GUESS_ROUNDS } from "./data";

export default function Phase2({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [corrections, setCorrections] = useState(0);

  const round = GUESS_ROUNDS[idx];
  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-7xl">🤖📈</div>
        <h2 className="text-3xl font-bold">Robot is getting smarter!</h2>
        <p className="text-lg opacity-80">You corrected {corrections} mistakes. The robot learned from each one!</p>
        <button className="btn btn-success mt-4" onClick={() => onComplete(corrections)}>Next → Tricky Round!</button>
      </div>
    );
  }

  const animal = ANIMALS.find((a) => a.id === round.animal)!;
  const guessAnimal = ANIMALS.find((a) => a.id === round.robotGuess)!;
  const Icon = animal.icon;

  const respond = (correct: boolean) => {
    if (round.correct && correct) {
      setFeedback("✅ Yep! Robot got it right!");
    } else if (round.correct && !correct) {
      setFeedback("🤔 Actually, the robot WAS right! It's a " + animal.label + "!");
    } else if (!round.correct && !correct) {
      setFeedback("👏 Good catch! It's a " + animal.label + ", not a " + guessAnimal.label + "! " + round.reason);
      setCorrections((c) => c + 1);
    } else {
      setFeedback("❌ Hmm, the robot was wrong! It's a " + animal.label + ". " + round.reason);
    }
    setTimeout(() => { setFeedback(""); setIdx((i) => i + 1); }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <h2 className="text-3xl font-bold">🤖 Phase 2: Robot Guesses!</h2>
      <p className="opacity-70 text-center max-w-md">
        The robot tries to guess each animal. Is it right or wrong?
      </p>
      <div className="text-sm opacity-70">{idx + 1} / {GUESS_ROUNDS.length}</div>

      {/* Animal */}
      <div className="my-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${animal.color}` }}>
        <Icon size={96} color={animal.color} strokeWidth={1.5} />
      </div>

      {/* Robot guess */}
      <div className="text-xl text-center">
        🤖 "I think this is a... <b style={{ color: guessAnimal.color }}>{guessAnimal.label}!</b>"
      </div>

      {/* Feedback */}
      <div className="text-lg min-h-[2em] font-semibold text-center max-w-md">{feedback}</div>

      {/* Buttons */}
      {!feedback && (
        <div className="flex gap-4 fade-in">
          <button className="btn text-xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => respond(true)}>
            ✅ Correct!
          </button>
          <button className="btn text-xl" style={{ background: "#ef4444" }} onClick={() => respond(false)}>
            ❌ Wrong!
          </button>
        </div>
      )}
    </div>
  );
}
