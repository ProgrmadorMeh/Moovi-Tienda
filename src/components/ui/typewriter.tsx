"use client";
import React, { useEffect, useState } from "react";

const defaultPhrases = ["Explora lo último en tecnología móvil con MooviTech."];

export default function Typewriter({
  phrases = [],
  typeSpeed = 80,
  deleteSpeed = 40,
  pause = 1200,
  className = "",
}) {
  const activePhrases = phrases.length > 0 ? phrases : defaultPhrases;
  const shouldAnimate = phrases.length > 0;

  const [display, setDisplay] = useState(activePhrases[0]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(activePhrases[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    let timeout;
    const current = activePhrases[phraseIndex % activePhrases.length];

    // Empezamos a borrar la primera frase estática después de una pausa inicial
    if (phraseIndex === 0 && charIndex === current.length && !deleting) {
       timeout = setTimeout(() => {
            setDeleting(true);
       }, pause);
    }
    else if (!deleting && charIndex <= current.length) {
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
      setPhraseIndex((i) => (i + 1) % activePhrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, activePhrases, typeSpeed, deleteSpeed, pause, shouldAnimate]);


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
        {shouldAnimate && (
            <span
                className="inline-block ml-1 align-bottom h-6 w-[2px] animate-blink bg-primary"
                aria-hidden="true"
            />
        )}
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
