"use client";

// Training categories for the car's AI brain
export const CATEGORIES = ["lights", "signs", "people", "animals", "obstacles"] as const;
export type Category = typeof CATEGORIES[number];

export type TrainingData = Record<string, number>;

// Confidence: 0 correct → 25%, 1 → 55%, 2+ → 90%
export function getConfidence(training: TrainingData, cat: string): number {
  const count = training[cat] || 0;
  return count === 0 ? 25 : count === 1 ? 55 : 90;
}

// Training items — each has a category for tracking
export const TRAIN_ITEMS = [
  { emoji: "🟢", label: "Green Light", answer: "go" as const, category: "lights" },
  { emoji: "🛑", label: "Stop Sign", answer: "stop" as const, category: "signs" },
  { emoji: "🚶", label: "Person Walking", answer: "stop" as const, category: "people" },
  { emoji: "🌳", label: "Tree (roadside)", answer: "go" as const, category: "obstacles" },
  { emoji: "🔴", label: "Red Light", answer: "stop" as const, category: "lights" },
  { emoji: "🐕", label: "Dog on Road", answer: "stop" as const, category: "animals" },
  { emoji: "➡️", label: "Road Ahead Clear", answer: "go" as const, category: "obstacles" },
  { emoji: "🚧", label: "Construction Zone", answer: "stop" as const, category: "signs" },
  { emoji: "🐈", label: "Cat on Road", answer: "stop" as const, category: "animals" },
  { emoji: "👦", label: "Kid on Sidewalk", answer: "go" as const, category: "people" },
];

// Features the AI "sees" — used for reasoning display
export const AI_FEATURES: Record<string, string[]> = {
  lights: ["Round shape", "Colored glow", "Mounted high"],
  signs: ["Flat shape", "Has text/symbol", "On a pole"],
  people: ["Moving figure", "Upright shape", "On/near road"],
  animals: ["Small moving thing", "Low to ground", "Unpredictable"],
  obstacles: ["Stationary object", "Near road edge", "Not moving"],
};

// Generate test drive scenes based on training data
export function generateTestScenes(training: TrainingData) {
  const scenes = [
    { emoji: "🟢", label: "Green light ahead", correct: "go" as const, category: "lights" },
    { emoji: "🛑", label: "Stop sign!", correct: "stop" as const, category: "signs" },
    { emoji: "🚶", label: "Person crossing", correct: "stop" as const, category: "people" },
    { emoji: "➡️", label: "Open road", correct: "go" as const, category: "obstacles" },
    { emoji: "🔴", label: "Red light!", correct: "stop" as const, category: "lights" },
    { emoji: "🐕", label: "Dog on road!", correct: "stop" as const, category: "animals" },
  ].sort(() => Math.random() - 0.5);

  return scenes.map((s) => {
    const conf = getConfidence(training, s.category);
    const accuracy = conf / 100;
    const aiCorrect = Math.random() < accuracy;
    const aiChoice = aiCorrect ? s.correct : (s.correct === "stop" ? "go" : "stop");
    return { ...s, aiChoice, confidence: conf, features: AI_FEATURES[s.category] || [] };
  });
}

// Generate self-driving events based on training data
export function generateSelfDrivingEvents(training: TrainingData) {
  const events = [
    { emoji: "🟢", label: "Green light", correct: "go" as const, category: "lights", aiDelay: 3000 },
    { emoji: "🛑", label: "Stop sign", correct: "stop" as const, category: "signs", aiDelay: 2500 },
    { emoji: "🐕", label: "Dog on the road!", correct: "stop" as const, category: "animals", aiDelay: 4000 },
    { emoji: "➡️", label: "Open road", correct: "go" as const, category: "obstacles", aiDelay: 2500 },
    { emoji: "🔴", label: "Red light", correct: "stop" as const, category: "lights", aiDelay: 2800 },
    { emoji: "🚶", label: "Kid crossing!", correct: "stop" as const, category: "people", aiDelay: 4500 },
    { emoji: "🟢", label: "Green light", correct: "go" as const, category: "lights", aiDelay: 2500 },
    { emoji: "🚧", label: "Construction zone", correct: "stop" as const, category: "signs", aiDelay: 3000 },
    { emoji: "🐈", label: "Cat on road!", correct: "stop" as const, category: "animals", aiDelay: 3500 },
    { emoji: "➡️", label: "Highway clear", correct: "go" as const, category: "obstacles", aiDelay: 2000 },
  ];

  return events.map((e) => {
    const conf = getConfidence(training, e.category);
    const accuracy = conf / 100;
    const aiCorrect = Math.random() < accuracy;
    const aiChoice = aiCorrect ? e.correct : (e.correct === "stop" ? "go" as const : "stop" as const);
    return { ...e, aiChoice, confidence: conf, features: AI_FEATURES[e.category] || [] };
  });
}
