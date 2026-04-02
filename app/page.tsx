"use client";
import { useState } from "react";
import PowerUp from "./quests/PowerUp";
import MakeItMove from "./quests/MakeItMove";
import TeachItToSee from "./quests/TeachItToSee";
import TestDrive from "./quests/TestDrive";
import SelfDriving from "./quests/SelfDriving";
import AnimalSorter from "./quests/animal-sorter";

const QUESTS = [
  "⚡ Power Up", "🔄 Make It Move", "👁️ Teach It to See", "🛻 Test Drive", "🤖 Self-Driving",
  "🐾 Animal Sorter",
];

const COMPONENTS = [PowerUp, MakeItMove, TeachItToSee, TestDrive, SelfDriving, AnimalSorter];

export default function Home() {
  const [quest, setQuest] = useState(-1);
  const [completed, setCompleted] = useState<boolean[]>(new Array(QUESTS.length).fill(false));

  const complete = () => {
    const next = [...completed];
    next[quest] = true;
    setCompleted(next);
    setQuest(quest + 1 < QUESTS.length ? quest + 1 : -1);
  };

  if (quest === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 fade-in">
        <div className="text-8xl"><span className="car">🛻</span></div>
        <h1 className="text-4xl font-bold text-center">AI Quests for Kids!</h1>
        <p className="text-lg text-center opacity-70 max-w-md">
          Learn how AI works by building a robot car and teaching a robot to see!
        </p>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {QUESTS.map((name, i) => (
            <button
              key={i}
              className="btn btn-primary flex justify-between items-center"
              style={{ opacity: i === 0 || completed[i - 1] ? 1 : 0.4 }}
              disabled={i > 0 && !completed[i - 1]}
              onClick={() => setQuest(i)}
            >
              <span>{name}</span>
              {completed[i] && <span>✅</span>}
            </button>
          ))}
        </div>
        {completed.every(Boolean) && (
          <div className="text-2xl font-bold text-center fade-in" style={{ color: "var(--success)" }}>
            🎉 You completed all AI Quests! Amazing job!
          </div>
        )}
      </div>
    );
  }

  const Q = COMPONENTS[quest];
  return <Q onComplete={complete} />;
}
