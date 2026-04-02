"use client";

const BASE = "/robot-car-quest/audio/";
let current: HTMLAudioElement | null = null;
let queue: Promise<void> = Promise.resolve();
let cancelId = 0;
let speaking = false;
const listeners = new Set<(v: boolean) => void>();

function setSpeaking(v: boolean) {
  if (speaking === v) return;
  speaking = v;
  listeners.forEach((fn) => fn(v));
}

export function onSpeakingChange(fn: (v: boolean) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function speak(key: string): Promise<void> {
  const id = cancelId;
  setSpeaking(true);
  queue = queue.then(() => new Promise<void>((resolve) => {
    if (id !== cancelId) { resolve(); return; }
    if (typeof window === "undefined") { resolve(); return; }
    if (current) { current.pause(); current = null; }
    const a = new Audio(BASE + key);
    current = a;
    a.onended = () => { current = null; resolve(); };
    a.onerror = () => { current = null; resolve(); };
    a.play().catch(() => resolve());
  })).then(() => {
    if (cancelId === id) setSpeaking(false);
  });
  return queue;
}

export function stopSpeaking() {
  cancelId++;
  if (current) { current.pause(); current = null; }
  queue = Promise.resolve();
  setSpeaking(false);
}

export const VOICE = {
  welcome: "welcome.mp3",
  menuTitle: "menu_title.mp3",
  menuSubtitle: "menu_subtitle.mp3",
  menuParts: "menu_parts.mp3",
  menuAllDone: "menu_all_done.mp3",
  q1Start: "q1_start.mp3",
  q1Title: "q1_title.mp3",
  q1Desc: "q1_desc.mp3",
  q1Perfect: "q1_perfect.mp3",
  q1TooMany: "q1_too_many.mp3",
  q2Start: "q2_start.mp3",
  q2Title: "q2_title.mp3",
  q2Desc: "q2_desc.mp3",
  q2Fast: "q2_fast.mp3",
  q2Regen: "q2_regen.mp3",
  q2Done: "q2_done.mp3",
  q3Start: "q3_start.mp3",
  q3Title: "q3_title.mp3",
  q3Desc: "q3_desc.mp3",
  q3Correct: "q3_correct.mp3",
  q3Wrong: "q3_wrong.mp3",
  q3Done: "q3_done.mp3",
  summary: "summary.mp3",
  summaryTitle: "summary_title.mp3",
  summaryDesc: "summary_desc.mp3",
  summaryBias: "summary_bias.mp3",
  q4Start: "q4_start.mp3",
  q4Title: "q4_title.mp3",
  q4Desc: "q4_desc.mp3",
  q4Correct: "q4_correct.mp3",
  q4Wrong: "q4_wrong.mp3",
  q4Retrain: "q4_retrain.mp3",
  q5Start: "q5_start.mp3",
  q5Title: "q5_title.mp3",
  q5Desc: "q5_desc.mp3",
  q5Save: "q5_save.mp3",
  q5Crash: "q5_crash.mp3",
  q5AiRight: "q5_ai_right.mp3",
  q5Done: "q5_done.mp3",
  q5Complete: "q5_complete.mp3",
  q5Lesson: "q5_lesson.mp3",
  allDone: "all_done.mp3",
  partBattery: "part_battery.mp3",
  partMotor: "part_motor.mp3",
  partCameras: "part_cameras.mp3",
  partAiBrain: "part_ai_brain.mp3",
  partSelfDrive: "part_self_drive.mp3",
  nextQuest: "next_quest.mp3",
} as const;
