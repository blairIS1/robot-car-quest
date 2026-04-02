"use client";
import { useState, useEffect, useCallback } from "react";
import { TrainingData, generateSelfDrivingEvents } from "./data";
import CarBuddy from "./CarBuddy";
import ReadableText from "./ReadableText";
import { sfxCorrect, sfxWrong, sfxTap, sfxBrake, sfxCelebrate } from "./sfx";
import { speak, stopSpeaking, VOICE } from "./speak";
import { useMobile, useSpeaking } from "./useMobile";
import Confetti from "./Confetti";

export default function SelfDriving({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const [events] = useState(() => generateSelfDrivingEvents(training));
  const mobile = useMobile();
  const talking = useSpeaking();
  const [idx, setIdx] = useState(0);
  const [carPos, setCarPos] = useState(10);
  const [phase, setPhase] = useState<"driving" | "event" | "result">("driving");
  const [overridden, setOverridden] = useState(false);
  const [aiActed, setAiActed] = useState(false);
  const [saves, setSaves] = useState(0);
  const [crashes, setCrashes] = useState(0);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    speak(VOICE.q5Start);
    return () => stopSpeaking();
  }, []);

  const event = events[idx];
  const aiWrong = event.correct !== event.aiChoice;

  useEffect(() => {
    if (phase !== "driving") return;
    const t = setInterval(() => setCarPos((p) => Math.min(p + 1, 70)), 60);
    const show = setTimeout(() => { setPhase("event"); setTimer(0); }, 1500);
    return () => { clearInterval(t); clearTimeout(show); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "event") return;
    const t = setInterval(() => setTimer((v) => v + 100), 100);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "event" || overridden || aiActed) return;
    if (timer >= event.aiDelay) setAiActed(true);
  }, [phase, timer, event.aiDelay, overridden, aiActed]);

  useEffect(() => {
    if (!aiActed || phase !== "event") return;
    if (aiWrong) { setCrashes((c) => c + 1); sfxWrong(); speak(VOICE.q5Crash); }
    else { sfxCorrect(); speak(VOICE.q5AiRight); }
    setPhase("result");
  }, [aiActed, phase, aiWrong]);

  const override = useCallback(() => {
    if (phase !== "event" || aiActed) return;
    setOverridden(true);
    setPhase("result");
    if (aiWrong) { setSaves((s) => s + 1); sfxBrake(); sfxCorrect(); speak(VOICE.q5Save); }
  }, [phase, aiActed, aiWrong]);

  const getResult = () => {
    if (overridden) {
      if (aiWrong) return { icon: "🦸", text: `Great save! The AI wanted to ${event.aiChoice.toUpperCase()} but you stopped it. "${event.label}" means ${event.correct.toUpperCase()}!`, ok: true };
      return { icon: "😅", text: "False alarm — the AI had it right. No harm done!", ok: true };
    }
    if (!aiWrong) return { icon: "🤖✅", text: `AI got it right! ${event.label} → ${event.aiChoice.toUpperCase()}`, ok: true };
    return { icon: "😅", text: `Oops! The AI chose ${event.aiChoice.toUpperCase()} but should have ${event.correct.toUpperCase()}ed for "${event.label}"! Still learning!`, ok: false };
  };

  const advance = () => {
    if (idx + 1 >= events.length) { setDone(true); return; }
    setIdx(idx + 1);
    setCarPos(10);
    setPhase("driving");
    setOverridden(false);
    setAiActed(false);
    setTimer(0);
  };

  if (done) {
    const totalWrong = events.filter((e) => e.correct !== e.aiChoice).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <CarBuddy mood="celebrate" size={mobile ? 90 : 140} talking={talking} />
        <ReadableText voice={VOICE.q5Complete} as="h2" className="text-3xl font-bold text-center">Self-Driving Complete!</ReadableText>
        <div className="flex gap-6 text-lg">
          <span>🦸 Saves: {saves}/{totalWrong}</span>
          <span>😅 Oops: {crashes}</span>
        </div>
        <ReadableText voice={VOICE.q5Lesson} as="p" className="text-lg text-center max-w-md opacity-80">
          Even smart AI makes mistakes! That&apos;s why self-driving cars still need
          a human paying attention. You were the safety driver!
        </ReadableText>
        <button className="btn btn-success mt-4" disabled={talking} onClick={() => { sfxTap(); sfxCelebrate(); stopSpeaking(); onComplete(); }}>
          🏠 Back to Menu
        </button>
      </div>
    );
  }

  const result = phase === "result" ? getResult() : null;
  const urgencyPct = aiWrong ? Math.min((timer / event.aiDelay) * 100, 100) : 0;
  const confColor = event.confidence >= 70 ? "#4ade80" : event.confidence >= 45 ? "#fbbf24" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <ReadableText voice={VOICE.q5Title} as="h2" className="text-3xl font-bold">🤖 Quest 5: Self-Driving!</ReadableText>
      <ReadableText voice={VOICE.q5Desc} as="p" className="opacity-70 text-center max-w-md text-sm">
        The car drives itself now! Watch for AI mistakes and hit OVERRIDE to help!
      </ReadableText>

      <div className="text-sm opacity-70">{idx + 1} / {events.length}</div>

      <div className="w-full max-w-lg h-20 sm:h-28 bg-gray-800 rounded-2xl relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-gray-600" />
        <div className="text-5xl absolute bottom-3 transition-all car" style={{ left: `${carPos}%`, transitionDuration: "0.15s" }}>🛻</div>
        {phase !== "driving" && <div className="text-5xl absolute top-3 right-8">{event.emoji}</div>}
        {phase === "event" && !aiActed && !overridden && (
          <div className="absolute top-3 left-4 text-sm opacity-70">🤖 AI thinking...</div>
        )}
      </div>

      {phase === "event" && !overridden && !aiActed && (
        <div className="rounded-xl p-3 text-sm max-w-xs" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="text-xs opacity-50 mb-1">🤖 AI sees:</div>
          <div className="flex flex-wrap gap-1">
            {event.features.map((f) => (
              <span key={f} className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(56,189,248,0.2)", color: "#38bdf8" }}>
                {f}
              </span>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs opacity-50">Confidence:</span>
            <span className="text-sm font-bold" style={{ color: confColor }}>{event.confidence}%</span>
          </div>
        </div>
      )}

      {phase === "event" && aiWrong && !overridden && !aiActed && (
        <div className="w-full max-w-lg">
          <div className="text-sm text-center mb-1" style={{ color: "var(--warn)" }}>⚠️ Override before the AI acts!</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${urgencyPct}%`, background: urgencyPct > 70 ? "#ef4444" : "var(--warn)", transition: "width 0.1s linear" }} />
          </div>
        </div>
      )}

      {phase === "event" && <div className="text-xl font-semibold">{event.label}</div>}

      {phase === "event" && !overridden && !aiActed && (
        <button className="btn text-2xl fade-in" style={{ background: "#ef4444", animation: "pulse 0.6s infinite alternate" }} onClick={override}>
          🛑 OVERRIDE — STOP THE CAR!
        </button>
      )}

      {result && (
        <div className="flex flex-col items-center gap-3 fade-in">
          <div className="text-5xl">{result.icon}</div>
          <div className="text-lg text-center max-w-md" style={{ color: result.ok ? "var(--success)" : "var(--warn)" }}>
            {result.text}
          </div>
          <button className="btn btn-primary mt-2" onClick={advance}>
            {idx + 1 < events.length ? "Continue →" : "See Results"}
          </button>
        </div>
      )}

      <div className="flex gap-4 text-sm opacity-70">
        <span>🦸 Saves: {saves}</span>
        <span>😅 Oops: {crashes}</span>
      </div>
    </div>
  );
}
