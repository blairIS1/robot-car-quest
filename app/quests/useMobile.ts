"use client";
import { useState, useEffect } from "react";
import { onSpeakingChange } from "./speak";

/** Returns true when audio is currently playing */
export function useSpeaking() {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => onSpeakingChange(setSpeaking), []);
  return speaking;
}

/** Returns true when viewport width <= breakpoint (default 480px) */
export function useMobile(breakpoint = 480) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return mobile;
}
