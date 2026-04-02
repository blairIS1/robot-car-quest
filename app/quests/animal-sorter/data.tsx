"use client";
import { Cat, Dog, Bird, Fish, Rabbit } from "lucide-react";

export const ANIMALS = [
  { id: "cat", label: "Cat", icon: Cat, color: "#f97316", category: "cat" },
  { id: "dog", label: "Dog", icon: Dog, color: "#3b82f6", category: "dog" },
  { id: "bird", label: "Bird", icon: Bird, color: "#22c55e", category: "bird" },
  { id: "fish", label: "Fish", icon: Fish, color: "#06b6d4", category: "fish" },
  { id: "rabbit", label: "Rabbit", icon: Rabbit, color: "#a855f7", category: "rabbit" },
] as const;

export const CATEGORIES = ["cat", "dog", "bird", "fish", "rabbit"] as const;

// Phase 2: robot guesses — some intentionally wrong
export const GUESS_ROUNDS = [
  { animal: "cat", robotGuess: "cat", correct: true },
  { animal: "dog", robotGuess: "dog", correct: true },
  { animal: "rabbit", robotGuess: "cat", correct: false, reason: "It has fur and pointy ears like a cat!" },
  { animal: "bird", robotGuess: "bird", correct: true },
  { animal: "fish", robotGuess: "bird", correct: false, reason: "It moves fast like a bird!" },
  { animal: "dog", robotGuess: "cat", correct: false, reason: "It has four legs and fur like a cat!" },
  { animal: "cat", robotGuess: "cat", correct: true },
  { animal: "rabbit", robotGuess: "rabbit", correct: true },
];

// Phase 3: tricky animals
export const TRICKY_ROUNDS = [
  { emoji: "🦊", label: "Fox", options: ["cat", "dog"], answer: "dog", reason: "Foxes are in the dog family!" },
  { emoji: "🐧", label: "Penguin", options: ["bird", "fish"], answer: "bird", reason: "Penguins are birds that swim!" },
  { emoji: "🦇", label: "Bat", options: ["bird", "rabbit"], answer: "rabbit", reason: "Bats are mammals, not birds!" },
  { emoji: "🐢", label: "Turtle", options: ["fish", "rabbit"], answer: "rabbit", reason: "Turtles live on land too — not a fish!" },
  { emoji: "🦭", label: "Seal", options: ["dog", "fish"], answer: "dog", reason: "Seals are closer to dogs than fish!" },
];
