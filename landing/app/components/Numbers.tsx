"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "./content";

function useCounter(target: number, ref: React.RefObject<HTMLDivElement | null>, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * target));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, ref, duration]);
  return n;
}

export function Numbers() {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const refs = [ref0, ref1, ref2, ref3];
  const targets = COPY.numbers.map(([n]) => parseInt(n, 10));
  const counts = [
    useCounter(targets[0], ref0),
    useCounter(targets[1], ref1),
    useCounter(targets[2], ref2),
    useCounter(targets[3], ref3),
  ];
  return (
    <section id="numbers" className="block numbers">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">03</span>
          {COPY.numbersEyebrow}
        </div>
        <h2 className="section-title reveal delay-1">{COPY.numbersTitle}</h2>
        <p className="section-lede reveal delay-2">{COPY.numbersLede}</p>
        <div className="numbers-grid">
          {COPY.numbers.map(([, label], i) => (
            <div className="num-cell" key={label} ref={refs[i]}>
              <div className="num-big">{counts[i]}</div>
              <div className="num-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
