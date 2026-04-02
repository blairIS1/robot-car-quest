"use client";
import { useState, useEffect } from "react";
import CarBuddy from "./CarBuddy";
import { useNarrate } from "./speak";
import { useMobile } from "./useMobile";

const SESSION_LIMIT = 12 * 60;

export default function SessionTimer({ onDismiss }: { onDismiss: () => void }) {
  const mobile = useMobile();
  const { talking } = useNarrate([]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
      <CarBuddy mood="happy" size={mobile ? 90 : 140} talking={talking} />
      <h2 className="text-3xl font-bold text-center">⏰ Great job today!</h2>
      <p className="text-lg opacity-80 text-center max-w-md">
        You&apos;ve been playing for 12 minutes — your brain needs a break to remember everything you learned!
      </p>
      <p className="text-base opacity-60 text-center">Come back later and keep building! 🚗</p>
      <button className="btn btn-primary mt-4" onClick={onDismiss}>
        OK, see you later! 👋
      </button>
    </div>
  );
}

export function useSessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= SESSION_LIMIT) setExpired(true);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return { elapsed, expired, dismiss: () => setExpired(false) };
}
