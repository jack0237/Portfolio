"use client";

import { useEffect, useId, useState } from "react";
import { MOTION_EVENT, readUserReduce, writeUserReduce } from "./preference";

type Labels = { label: string; hint: string; system: string };

// Interrupteur « Réduire les animations » (DESIGN 6.4, CONTENT 1.6), mémorisé en localStorage.
export function MotionToggle({ labels }: { labels: Labels }) {
  const [checked, setChecked] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const hintId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setChecked(readUserReduce());
      setSystemReduce(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener(MOTION_EVENT, sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener(MOTION_EVENT, sync);
    };
  }, []);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    writeUserReduce(next);
  };

  return (
    <div className="motion-toggle">
      <button
        type="button"
        role="switch"
        className="switch"
        aria-checked={checked || systemReduce}
        aria-describedby={hintId}
        onClick={toggle}
      >
        <span className="switch__track" aria-hidden="true" />
        <span>{labels.label}</span>
      </button>
      <p id={hintId} className="motion-toggle__hint">
        {systemReduce ? labels.system : labels.hint}
      </p>
    </div>
  );
}
