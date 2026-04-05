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
import ReadableText from "./quests/ReadableText";
import SessionTimer, { useSessionTimer } from "./quests/SessionTimer";
import { sfxTap, sfxCelebrate } from "./quests/sfx";
import { speak, stopSpeaking, useNarrate, VOICE } from "./quests/speak";
import { useMobile } from "./quests/useMobile";
import { startMusic, stopMusic } from "./quests/music";
import { recordCompletion, getCompletions } from "./quests/scores";
import { TrainingData } from "./quests/data";

const PARTS = [
  { emoji: "🔋", label: "Battery", quest: 0, voice: VOICE.partBattery },
  { emoji: "⚙️", label: "Motor", quest: 1, voice: VOICE.partMotor },
  { emoji: "👁️", label: "Cameras", quest: 2, voice: VOICE.partCameras },
  { emoji: "🧠", label: "AI Brain", quest: 3, voice: VOICE.partAiBrain },
  { emoji: "🤖", label: "Self-Drive", quest: 4, voice: VOICE.partSelfDrive },
];

const QUESTS = ["⚡ Power Up", "🔄 Make It Move", "👁️ Teach It to See", "🛻 Test Drive", "🤖 Self-Driving"];

type Phase = "menu" | "q1" | "q2" | "q3" | "summary" | "q4" | "q5";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [training, setTraining] = useState<TrainingData>({});
  const [completions, setCompletions] = useState(0);
  const [started, setStarted] = useState(false);
  const { expired, dismiss } = useSessionTimer();
  const mobile = useMobile();
  // Menu narration — only plays after Start is tapped (started=true triggers remount via key)
  const { talking } = useNarrate(started ? [VOICE.welcome, VOICE.menuSubtitle] : []);

  useEffect(() => { setCompletions(getCompletions()); }, []);

  const markDone = (idx: number) => {
    setCompleted((prev) => { const n = [...prev]; n[idx] = true; return n; });
  };

  const startQuest = (questPhase: Phase) => {
    sfxTap();
    stopSpeaking();
    setPhase(questPhase);
  };

  if (expired) {
    stopMusic();
    return <SessionTimer onDismiss={dismiss} />;
  }

  if (phase === "menu") {
    const questPhases: Phase[] = ["q1", "q2", "q3", "q4", "q5"];
    const partsCollected = completed.filter(Boolean).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={completed.every(Boolean)} />
        <CarBuddy mood={completed.every(Boolean) ? "celebrate" : "idle"} size={mobile ? 90 : 140} talking={talking} />
        <ReadableText voice={VOICE.menuTitle} as="h1" className="text-4xl font-bold text-center">
          Build a Robot Car!
        </ReadableText>
        <ReadableText voice={VOICE.menuSubtitle} as="p" className="text-lg text-center opacity-70 max-w-md">
          Collect all 5 parts to build your self-driving car!
        </ReadableText>

        {!started ? (
          <>
            <div className="rounded-xl p-4 text-center max-w-sm" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)" }}>
              <p className="text-lg">📏 Hold your tablet at arm&apos;s length!</p>
              <p className="opacity-60">Not too close — your eyes will thank you! 👀</p>
            </div>
            <button className="btn btn-primary text-xl mt-4" onClick={() => {
            sfxTap();
            setStarted(true);
            startMusic();
            speak(VOICE.welcome).then(() => speak(VOICE.menuSubtitle));
          }}>
            ▶️ Start!
          </button>
          </>
        ) : (
          <>
            <div className="flex gap-3">
              {PARTS.map((part, i) => (
                <div key={i} className="flex flex-col items-center gap-1 readable-text"
                  style={{ opacity: completed[part.quest] ? 1 : 0.3, cursor: "pointer" }}
                  onClick={() => { sfxTap(); speak(part.voice); }}>
                  <span className="text-3xl" style={{ filter: completed[part.quest] ? "none" : "grayscale(1)" }}>{part.emoji}</span>
                  <span className="text-xs">{part.label} <span className="read-icon">🔊</span></span>
                </div>
              ))}
            </div>
            <ReadableText voice={VOICE.menuParts} as="div" className="text-sm opacity-60">
              {partsCollected}/5 parts collected
            </ReadableText>

            {completions > 0 && <p className="text-xs opacity-40">🏆 Completed {completions} time{completions > 1 ? "s" : ""}</p>}

            <div className="flex flex-col gap-3 w-full max-w-sm fade-in">
              {QUESTS.map((name, i) => (
                <button
                  key={i}
                  className="btn btn-primary flex justify-between items-center"
                  style={{ opacity: i === 0 || completed[i - 1] ? 1 : 0.4 }}
                  disabled={talking || (i > 0 && !completed[i - 1])}
                  onClick={() => startQuest(questPhases[i])}
                >
                  <span>{name}</span>
                  {completed[i] ? <span>✅</span> : <span className="opacity-40">{PARTS[i].emoji}</span>}
                </button>
              ))}
            </div>

            {completed.every(Boolean) && (
              <ReadableText voice={VOICE.menuAllDone} as="div" className="text-xl font-bold text-center fade-in" style={{ color: "var(--success)" }}>
                🎉 All parts collected! Your robot car is complete!
              </ReadableText>
            )}
          </>
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
      {phase === "q5" && <SelfDriving training={training} onComplete={() => { markDone(4); setCompletions(recordCompletion()); sfxCelebrate(); setPhase("menu"); speak(VOICE.q5Done).then(() => speak(VOICE.allDone)); }} />}
    </>
  );
}
