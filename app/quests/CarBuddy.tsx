"use client";

// Car buddy — a car with eyes and expressions, like Robi in animal-sorter
type Mood = "idle" | "happy" | "thinking" | "scared" | "celebrate";

export default function CarBuddy({ mood = "idle", size = 100 }: { mood?: Mood; size?: number }) {
  const w = size;
  const h = size * 0.65;

  const eyeL = mood === "scared" ? 6 : mood === "happy" || mood === "celebrate" ? 2 : 4;
  const eyeR = mood === "scared" ? 6 : mood === "happy" || mood === "celebrate" ? 2 : 4;
  const mouthD = mood === "happy" || mood === "celebrate"
    ? "M35 52 Q45 60 55 52"
    : mood === "scared"
    ? "M38 55 Q45 50 52 55"
    : "M38 52 Q45 55 52 52";
  const bodyColor = mood === "celebrate" ? "#fbbf24" : "#38bdf8";
  const bodyAnim = mood === "celebrate" ? "bounce 0.5s ease-in-out infinite" : mood === "happy" ? "wiggle 0.6s ease-in-out" : "none";

  return (
    <svg width={w} height={h} viewBox="0 0 90 58" fill="none">
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
        @keyframes blink{0%,90%,100%{ry:${eyeL}}95%{ry:1}}
      `}</style>
      <g style={{ transformOrigin: "45px 30px", animation: bodyAnim }}>
        {/* Body */}
        <rect x="10" y="18" width="70" height="28" rx="8" fill={bodyColor} />
        {/* Roof */}
        <path d="M25 18 L32 6 L58 6 L65 18" fill={bodyColor} opacity="0.85" />
        {/* Windshield */}
        <path d="M33 8 L28 18 L62 18 L57 8" fill="#0f172a" opacity="0.7" />
        {/* Eyes */}
        <ellipse cx="38" cy="14" rx="3.5" ry={eyeL} fill="#4ade80">
          {mood === "idle" && <animate attributeName="ry" values={`${eyeL};1;${eyeL}`} dur="3s" repeatCount="indefinite" begin="2s" />}
        </ellipse>
        <ellipse cx="52" cy="14" rx="3.5" ry={eyeR} fill="#4ade80">
          {mood === "idle" && <animate attributeName="ry" values={`${eyeR};1;${eyeR}`} dur="3s" repeatCount="indefinite" begin="2s" />}
        </ellipse>
        {/* Scared eyes */}
        {mood === "scared" && <>
          <text x="34" y="18" fontSize="8" fill="#ef4444">!</text>
          <text x="50" y="18" fontSize="8" fill="#ef4444">!</text>
        </>}
        {/* Celebrate stars */}
        {mood === "celebrate" && <>
          <text x="34" y="17" fontSize="8" fill="#fbbf24">★</text>
          <text x="49" y="17" fontSize="8" fill="#fbbf24">★</text>
        </>}
        {/* Mouth (on bumper) */}
        <path d={mouthD} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Headlights */}
        <circle cx="14" cy="32" r="3" fill="#fbbf24" opacity={mood === "thinking" ? 0.5 : 0.8} />
        <circle cx="76" cy="32" r="3" fill="#fbbf24" opacity={mood === "thinking" ? 0.5 : 0.8} />
        {/* Thinking blinker */}
        {mood === "thinking" && <>
          <circle cx="14" cy="32" r="3" fill="#fbbf24">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
        </>}
        {/* Wheels */}
        <circle cx="25" cy="48" r="6" fill="#1e293b" />
        <circle cx="25" cy="48" r="3" fill="#475569" />
        <circle cx="65" cy="48" r="6" fill="#1e293b" />
        <circle cx="65" cy="48" r="3" fill="#475569" />
        {/* Cheek blush */}
        {(mood === "happy" || mood === "celebrate") && <>
          <circle cx="28" cy="38" r="3" fill="#f87171" opacity="0.3" />
          <circle cx="62" cy="38" r="3" fill="#f87171" opacity="0.3" />
        </>}
      </g>
      {/* Celebrate sparkles */}
      {mood === "celebrate" && <>
        <text x="2" y="10" fontSize="10">✨</text>
        <text x="74" y="8" fontSize="10">✨</text>
      </>}
    </svg>
  );
}
