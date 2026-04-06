"use client";
import { useState, useEffect } from "react";
import { TrainingData, generateTestScenes } from "./data";
import CarBuddy from "./CarBuddy";
import ReadableText from "./ReadableText";
import { sfxCorrect, sfxWrong, sfxTap } from "./sfx";
import { stopSpeaking, useNarrate, VOICE } from "./speak";
import { useMobile } from "./useMobile";
import Confetti from "./Confetti";
import { RETRAIN_MISTAKE_THRESHOLD, ANSWER_DELAY_MS, CAR_START_POS, CONFIDENCE_HIGH_THRESHOLD, CONFIDENCE_MED_THRESHOLD } from "./constants";

export default function TestDrive({ training, onComplete }: { training: TrainingData; onComplete: (needsRetrain: boolean) => void }) {
  const [scenes] = useState(() => generateTestScenes(training));
  const mobile = useMobile();
  const { talking, narrate } = useNarrate([VOICE.q4Start]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [mood, setMood] = useState<"thinking" | "happy" | "scared">("thinking");
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [carPos, setCarPos] = useState(CAR_START_POS);

  const scene = scenes[idx];

  useEffect(() => {
    if (picked === scene?.correct) {
      const t = setInterval(() => setCarPos((p) => Math.min(p + 2, 90)), 50);
      const stop = setTimeout(() => { clearInterval(t); setCarPos(CAR_START_POS); }, 1200);
      return () => { clearInterval(t); clearTimeout(stop); };
    }
  }, [picked, scene]);

  const choose = (c: string) => {
    setPicked(c);
    if (c === scene.correct) { sfxCorrect(); setMood("happy"); setShowConfetti(true); narrate(VOICE.q4Correct); }
    else { sfxWrong(); setMood("scared"); setMistakes((m) => m + 1); narrate(VOICE.q4Wrong); }
    setTimeout(() => {
      setPicked(null); setMood("thinking"); setShowConfetti(false);
      if (idx + 1 < scenes.length) setIdx(idx + 1);
      else setDone(true);
    }, ANSWER_DELAY_MS);
  };

  if (done) {
    const needsRetrain = mistakes >= RETRAIN_MISTAKE_THRESHOLD;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={!needsRetrain} />
        <CarBuddy mood={needsRetrain ? "scared" : "celebrate"} size={mobile ? 80 : 120} talking={talking} />
        <h2 className="text-3xl font-bold text-center">Test Drive Complete!</h2>
        <p className="text-lg text-center max-w-md opacity-80">
          {mistakes === 0 ? "Perfect driving! The AI training paid off!" :
           `${mistakes} mistake${mistakes > 1 ? "s" : ""}. ${needsRetrain ? "The car needs more training!" : "Not bad — but can it drive alone?"}`}
        </p>
        {needsRetrain ? (
          <div className="flex gap-3 mt-4">
            <button className="btn" style={{ background: "var(--accent)", color: "#0f172a" }} disabled={talking} onClick={() => { stopSpeaking(); onComplete(true); }}>
              🔄 Retrain AI
            </button>
            <button className="btn" style={{ background: "var(--card)" }} disabled={talking} onClick={() => { stopSpeaking(); onComplete(false); }}>
              Continue anyway →
            </button>
          </div>
        ) : (
          <button className="btn btn-success mt-4" disabled={talking} onClick={() => { stopSpeaking(); onComplete(false); }}>
            Next Quest →
          </button>
        )}
      </div>
    );
  }

  const confColor = scene.confidence >= CONFIDENCE_HIGH_THRESHOLD ? "#4ade80" : scene.confidence >= CONFIDENCE_MED_THRESHOLD ? "#fbbf24" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <Confetti active={showConfetti} />
      <ReadableText voice={VOICE.q4Title} as="h2" className="text-3xl font-bold">🛻 Quest 4: Test Drive!</ReadableText>
      <CarBuddy mood={mood} size={mobile ? 60 : 80} talking={talking} />
      <ReadableText voice={VOICE.q4Desc} as="p" className="opacity-70 text-center max-w-md text-sm">
        Your car is on the road! See what the AI thinks, then decide.
      </ReadableText>

      <div className="text-sm opacity-70">{idx + 1} / {scenes.length}</div>

      <div className="w-full max-w-lg h-20 sm:h-28 bg-gray-800 rounded-2xl relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-gray-600" />
        <div className="text-5xl absolute bottom-3 transition-all car" style={{ left: `${carPos}%`, transitionDuration: "0.15s" }}>🛻</div>
        <div className="text-5xl absolute top-3 right-8">{scene.emoji}</div>
      </div>

      <div className="text-xl font-semibold">{scene.label}</div>

      <div className="rounded-xl p-3 text-sm max-w-xs" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="text-xs opacity-50 mb-1">🤖 AI sees:</div>
        <div className="flex flex-wrap gap-1">
          {scene.features.map((f) => (
            <span key={f} className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(56,189,248,0.2)", color: "#38bdf8" }}>
              {f}
            </span>
          ))}
        </div>
        <div className="mt-2 text-xs">
          AI thinks: <b style={{ color: scene.aiChoice === "stop" ? "#ef4444" : "#4ade80" }}>{scene.aiChoice.toUpperCase()}</b>
          {" "}({scene.confidence}% sure)
        </div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xs">
        <span className="text-xs opacity-60 w-20">Confidence:</span>
        <div className="progress-track flex-1">
          <div className="progress-fill" style={{ width: `${scene.confidence}%`, background: confColor }} />
        </div>
        <span className="text-sm font-bold" style={{ color: confColor }}>{scene.confidence}%</span>
      </div>

      {picked ? (
        <div className="text-lg text-center fade-in" style={{ color: picked === scene.correct ? "var(--success)" : "var(--warn)" }}>
          {picked === scene.correct
            ? (scene.aiChoice !== scene.correct
              ? `✅ You're right! The AI said ${scene.aiChoice.toUpperCase()} but the car should ${scene.correct}!`
              : `✅ Correct! The car should ${scene.correct}!`)
            : `Oops! The car should ${scene.correct}! 😅`}
        </div>
      ) : (
        <div className="flex gap-4 fade-in">
          <button className="btn text-2xl" disabled={talking} style={{ background: "#ef4444" }} onClick={() => { sfxTap(); choose("stop"); }}>
            🛑 STOP
          </button>
          <button className="btn text-2xl" disabled={talking} style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => { sfxTap(); choose("go"); }}>
            ✅ GO
          </button>
        </div>
      )}
    </div>
  );
}
