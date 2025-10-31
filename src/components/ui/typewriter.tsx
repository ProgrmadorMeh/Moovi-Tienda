"use client";
import React, { useEffect, useState } from "react";

export default function Typewriter({
  phrases = ["Desarrollador Web", "Diseñador UX/UI", "Freelancer"],
  typeSpeed = 80,
  deleteSpeed = 40,
  pause = 1200,
  className = "",
}) {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting && charIndex <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex));
        setCharIndex((i) => i + 1);
      }, typeSpeed);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex));
        setCharIndex((i) => i - 1);
      }, deleteSpeed);
    } else if (!deleting && charIndex > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex < 0) {
      setDeleting(false);
      setCharIndex(0);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause]);

  return (
    <span
      key={phraseIndex}
      className={`inline-block max-w-full md:max-w-[60ch] whitespace-normal break-words align-middle ${className}`}
      aria-live="polite"
    >
      <span className="inline-block leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-400">
          {display}
        </span>
        {/* Cursor */}
        <span
          className="inline-block ml-1 align-bottom h-6 w-[2px] animate-blink bg-primary"
          aria-hidden="true"
        />
      </span>

      <style jsx>{`
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </span>
  );
}
