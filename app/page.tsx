"use client";
import { useState, useEffect } from "react";
import PowerUp from "./quests/PowerUp";
import MakeItMove from "./quests/MakeItMove";
import TeachItToSee from "./quests/TeachItToSee";
import TrainingSummary from "./quests/TrainingSummary";
import TestDrive from "./quests/TestDrive";
import SelfDriving from "./quests/SelfDriving";
import CarBuddy from "./quests/CarBuddy";
import Confetti from "./quests/Confetti";
import { sfxTap, sfxCelebrate } from "./quests/sfx";
import { speak, VOICE } from "./quests/speak";
import { recordCompletion, getCompletions } from "./quests/scores";
import { TrainingData } from "./quests/data";

const QUESTS = ["⚡ Power Up", "🔄 Make It Move", "👁️ Teach It to See", "🛻 Test Drive", "🤖 Self-Driving"];

type Phase = "menu" | "q1" | "q2" | "q3" | "summary" | "q4" | "q5";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [training, setTraining] = useState<TrainingData>({});
  const [completions, setCompletions] = useState(0);
  const [welcomed, setWelcomed] = useState(false);

  useEffect(() => { setCompletions(getCompletions()); }, []);

  const markDone = (idx: number) => {
    setCompleted((prev) => { const n = [...prev]; n[idx] = true; return n; });
  };

  // Play welcome on first tap (needs user interaction for audio)
  const startQuest = (questPhase: Phase) => {
    sfxTap();
    if (!welcomed) {
      setWelcomed(true);
      speak(VOICE.welcome).then(() => setPhase(questPhase));
    } else {
      setPhase(questPhase);
    }
  };

  if (phase === "menu") {
    const questPhases: Phase[] = ["q1", "q2", "q3", "q4", "q5"];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 fade-in">
        <Confetti active={completed.every(Boolean)} />
        <CarBuddy mood={completed.every(Boolean) ? "celebrate" : "idle"} size={140} />
        <h1 className="text-4xl font-bold text-center">Build a Robot Car!</h1>
        <p className="text-lg text-center opacity-70 max-w-md">
          Learn how self-driving cars work by building your own robot car — step by step!
        </p>
        {completions > 0 && <p className="text-sm opacity-50">🏆 Quests completed: {completions} times</p>}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {QUESTS.map((name, i) => (
            <button
              key={i}
              className="btn btn-primary flex justify-between items-center"
              style={{ opacity: i === 0 || completed[i - 1] ? 1 : 0.4 }}
              disabled={i > 0 && !completed[i - 1]}
              onClick={() => startQuest(questPhases[i])}
            >
              <span>{name}</span>
              {completed[i] && <span>✅</span>}
            </button>
          ))}
        </div>
        {completed.every(Boolean) && (
          <div className="text-2xl font-bold text-center fade-in" style={{ color: "var(--success)" }}>
            🎉 You built a self-driving robot car! Amazing job!
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {phase === "q1" && <PowerUp onComplete={() => { markDone(0); setPhase("q2"); }} />}
      {phase === "q2" && <MakeItMove onComplete={() => { markDone(1); setPhase("q3"); }} />}
      {phase === "q3" && <TeachItToSee onComplete={(data) => {
        setTraining((prev) => {
          const merged = { ...prev };
          for (const [k, v] of Object.entries(data)) merged[k] = (merged[k] || 0) + v;
          return merged;
        });
        markDone(2);
        setPhase("summary");
      }} />}
      {phase === "summary" && <TrainingSummary training={training} onComplete={() => setPhase("q4")} />}
      {phase === "q4" && <TestDrive training={training} onComplete={(needsRetrain) => {
        if (needsRetrain) setPhase("q3");
        else { markDone(3); setPhase("q5"); }
      }} />}
      {phase === "q5" && <SelfDriving training={training} onComplete={() => { markDone(4); setCompletions(recordCompletion()); sfxCelebrate(); setPhase("menu"); }} />}
    </>
  );
}
