"use client";

const KEY = "robot-car-quest-scores";

export function recordCompletion(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = (parseInt(localStorage.getItem(KEY) || "0") || 0) + 1;
    localStorage.setItem(KEY, String(n));
    return n;
  } catch { return 0; }
}

export function getCompletions(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(KEY) || "0") || 0; } catch { return 0; }
}
