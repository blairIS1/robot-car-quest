"use client";
import { useState } from "react";
import CarBuddy from "./CarBuddy";
import ReadableText from "./ReadableText";
import { sfxTap, sfxCorrect, sfxWrong } from "./sfx";
import { stopSpeaking, useNarrate, VOICE } from "./speak";
import { useMobile } from "./useMobile";
import Confetti from "./Confetti";
import { IDEAL_BATTERIES, MAX_BATTERIES } from "./constants";

export default function PowerUp({ onComplete }: { onComplete: () => void }) {
  const [batteries, setBatteries] = useState(0);
  const mobile = useMobile();
  const { talking, narrate } = useNarrate([VOICE.q1Start]);
  const status = batteries === 0 ? "empty" : batteries < IDEAL_BATTERIES ? "low" : batteries === IDEAL_BATTERIES ? "perfect" : batteries <= MAX_BATTERIES ? "heavy" : "overload";

  const msg: Record<string, string> = {
    empty: "Tap the batteries to add them to your car! 🔋",
    low: `${batteries}/${IDEAL_BATTERIES} — Need more power! The car won't go far enough.`,
    perfect: "✅ Perfect! Just the right amount of batteries!",
    heavy: `⚠️ ${batteries} batteries — the car is getting too heavy...`,
    overload: "💥 Too many! The car can't even move!",
  };

  const mood = status === "perfect" ? "celebrate" as const : status === "overload" ? "scared" as const : "idle" as const;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <Confetti active={status === "perfect"} />
      <ReadableText voice={VOICE.q1Title} as="h2" className="text-3xl font-bold">⚡ Quest 1: Power Up!</ReadableText>
      <ReadableText voice={VOICE.q1Desc} as="p" className="opacity-70 text-center max-w-md">
        Electric cars have a big battery under the floor. Too few batteries = car stops halfway.
        Too many = car is too heavy! Find the right number.
      </ReadableText>

      <CarBuddy mood={mood} size={mobile ? 80 : 120} talking={talking} />

      <div className="w-full max-w-64">
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${Math.min((batteries / IDEAL_BATTERIES) * 100, 100)}%`,
            background: status === "perfect" ? "var(--success)" : status === "heavy" || status === "overload" ? "var(--warn)" : undefined,
          }} />
        </div>
        <div className="text-center mt-2 text-sm opacity-70">{batteries} / {IDEAL_BATTERIES} batteries</div>
      </div>

      <div className="text-lg text-center font-semibold min-h-[2em]">{msg[status]}</div>

      <div className="flex gap-3">
        <button className="btn btn-primary text-3xl" disabled={talking} onClick={() => {
          sfxTap();
          const n = Math.min(batteries + 1, MAX_BATTERIES + 1);
          setBatteries(n);
          if (n === IDEAL_BATTERIES) { sfxCorrect(); narrate(VOICE.q1Perfect); }
          else if (n > MAX_BATTERIES) { sfxWrong(); narrate(VOICE.q1TooMany); }
        }}>🔋 +1</button>
        <button className="btn text-3xl" disabled={talking} style={{ background: "#475569" }} onClick={() => { sfxTap(); setBatteries(Math.max(batteries - 1, 0)); }}>➖</button>
      </div>

      {status === "perfect" && (
        <button className="btn btn-success mt-4 fade-in" disabled={talking} onClick={() => { sfxTap(); stopSpeaking(); onComplete(); }}>Next Quest →</button>
      )}
    </div>
  );
}
