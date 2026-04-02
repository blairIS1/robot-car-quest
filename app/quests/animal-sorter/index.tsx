"use client";
import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Phase3 from "./Phase3";

export default function AnimalSorter({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(1);

  if (phase === 1) return <Phase1 onComplete={() => setPhase(2)} />;
  if (phase === 2) return <Phase2 onComplete={() => setPhase(3)} />;
  return <Phase3 onComplete={onComplete} />;
}
