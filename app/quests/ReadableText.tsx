"use client";
import { speak } from "./speak";
import { sfxTap } from "./sfx";

type Props = {
  voice: string;
  as?: "h1" | "h2" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export default function ReadableText({ voice, as: Tag = "p", className = "", style, children }: Props) {
  return (
    <Tag
      className={`readable-text ${className}`}
      style={style}
      onClick={() => { sfxTap(); speak(voice); }}
    >
      {children} <span className="read-icon">🔊</span>
    </Tag>
  );
}
