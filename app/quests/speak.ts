"use client";

let speaking = false;

export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return; }
    if (speaking) { window.speechSynthesis.cancel(); }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.3; // slightly high pitch — friendly robot car voice
    u.volume = 0.9;
    speaking = true;
    u.onend = () => { speaking = false; resolve(); };
    u.onerror = () => { speaking = false; resolve(); };
    window.speechSynthesis.speak(u);
  });
}

// Pre-written voice lines for each quest moment
export const VOICE = {
  // Menu
  welcome: "Hi! I'm Zippy, your robot car! Let's learn how self-driving cars work!",

  // Quest 1: PowerUp
  q1Start: "Every car needs a battery! Help me find the right amount of power!",
  q1Perfect: "Yes! That's the perfect amount of batteries!",
  q1TooMany: "Whoa, too heavy! I can't move!",

  // Quest 2: MakeItMove
  q2Start: "Now let's learn about electric motors and regenerative braking!",
  q2Fast: "Vroom! I'm going fast!",
  q2Regen: "Cool! The brakes are charging my battery!",
  q2Done: "I can drive and recharge! Let's learn to see!",

  // Quest 3: TeachItToSee
  q3Start: "I have cameras but I don't know what anything means yet. Teach me!",
  q3Correct: "Got it! I'll remember that!",
  q3Wrong: "Oops! I'll try to remember next time.",
  q3Done: "Training complete! Let's see how smart I am now!",

  // Training Summary
  summary: "Here's what my brain looks like after training!",
  summaryBias: "Hmm, most of my data is about one thing. That's called bias!",
  summaryGood: "I have data for everything! But more data makes me smarter.",

  // Quest 4: TestDrive
  q4Start: "Time for a test drive! Let's see if my training worked!",
  q4Correct: "I got it right!",
  q4Wrong: "Oops, I made a mistake! I need more training data for that.",
  q4Done: "Test drive complete! Can I drive all by myself now?",
  q4Retrain: "I made too many mistakes. Can you teach me more?",

  // Quest 5: SelfDriving
  q5Start: "I'm driving by myself now! But watch out, I might make mistakes!",
  q5Save: "Great save! Thank you for watching out for me!",
  q5Crash: "Oh no! I should have stopped! I need a human to help me.",
  q5AiRight: "I got that one right all by myself!",
  q5Done: "Even smart AI needs humans to stay safe. You were a great safety driver!",

  // Completion
  allDone: "We did it! You built a self-driving robot car! Amazing job!",
};
