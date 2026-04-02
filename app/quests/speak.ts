"use client";

const BASE = "/robot-car-quest/audio/";
let current: HTMLAudioElement | null = null;
let queue: Promise<void> = Promise.resolve();

export function speak(key: string): Promise<void> {
  // Queue audio so lines don't overlap
  queue = queue.then(() => new Promise<void>((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }
    if (current) { current.pause(); current = null; }
    const a = new Audio(BASE + key);
    current = a;
    a.onended = () => { current = null; resolve(); };
    a.onerror = () => { current = null; resolve(); };
    a.play().catch(() => resolve());
  }));
  return queue;
}

export const VOICE = {
  welcome: "welcome.mp3",
  q1Start: "q1_start.mp3",
  q1Perfect: "q1_perfect.mp3",
  q1TooMany: "q1_too_many.mp3",
  q2Start: "q2_start.mp3",
  q2Fast: "q2_fast.mp3",
  q2Regen: "q2_regen.mp3",
  q2Done: "q2_done.mp3",
  q3Start: "q3_start.mp3",
  q3Correct: "q3_correct.mp3",
  q3Wrong: "q3_wrong.mp3",
  q3Done: "q3_done.mp3",
  summary: "summary.mp3",
  summaryBias: "summary_bias.mp3",
  q4Start: "q4_start.mp3",
  q4Correct: "q4_correct.mp3",
  q4Wrong: "q4_wrong.mp3",
  q4Retrain: "q4_retrain.mp3",
  q5Start: "q5_start.mp3",
  q5Save: "q5_save.mp3",
  q5Crash: "q5_crash.mp3",
  q5AiRight: "q5_ai_right.mp3",
  q5Done: "q5_done.mp3",
  allDone: "all_done.mp3",
};
