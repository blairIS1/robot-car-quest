"use client";
import { useEffect, useState } from "react";

interface Particle { id: number; x: number; y: number; color: string; size: number; rot: number; }

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const colors = ["#fbbf24", "#f87171", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];
    const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: -10 - Math.random() * 20,
      color: colors[i % colors.length], size: 6 + Math.random() * 6, rot: Math.random() * 360,
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50 }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size * 0.6, background: p.color, borderRadius: 2,
          transform: `rotate(${p.rot}deg)`,
          animation: `confetti-fall ${1.5 + Math.random()}s ease-in forwards`,
          animationDelay: `${Math.random() * 0.5}s`,
        }} />
      ))}
      <style>{`@keyframes confetti-fall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(100vh) rotate(720deg)}}`}</style>
    </div>
  );
}
