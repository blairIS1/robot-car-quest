// ── PowerUp (Quest 1) ──
export const IDEAL_BATTERIES = 4;
export const MAX_BATTERIES = 7;

// ── MakeItMove (Quest 2) ──
export const INITIAL_BATTERY = 80;
export const BATTERY_DRAIN_RATE = 0.3;       // per-tick drain multiplied by speed
export const BATTERY_REGEN_RATE = 2;          // per-tick charge while braking
export const BATTERY_TICK_MS = 200;
export const FAST_SPEED_THRESHOLD = 3;        // speed to trigger "drove fast"
export const REGEN_BATTERY_THRESHOLD = 82;    // battery must exceed this to trigger "regen learned"
export const MAX_SPEED = 5;
export const CAR_POSITION_MULTIPLIER = 8;     // speed × this = car visual offset %
export const MAX_CAR_POSITION_PCT = 85;

// ── data.ts (AI confidence) ──
export const CONFIDENCE_NONE = 25;
export const CONFIDENCE_LOW = 55;
export const CONFIDENCE_HIGH = 90;
export const CONFIDENCE_HIGH_THRESHOLD = 70;  // confidence bar color thresholds
export const CONFIDENCE_MED_THRESHOLD = 45;

// ── TestDrive (Quest 4) ──
export const RETRAIN_MISTAKE_THRESHOLD = 3;
export const ANSWER_DELAY_MS = 2500;
export const CAR_START_POS = 10;

// ── SelfDriving (Quest 5) ──
export const DRIVING_PHASE_MS = 1500;
export const TIMER_TICK_MS = 100;
export const URGENCY_DANGER_PCT = 70;
