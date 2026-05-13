"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "./content";
import { Phone } from "./Phone";

function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setP(0);
        return;
      }
      const passed = -rect.top;
      const prog = Math.max(0, Math.min(1, passed / total));
      setP(prog);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return p;
}

export function Journey() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(wrapperRef);
  const step = Math.max(0, Math.min(5, Math.floor(progress * 5.999)));

  return (
    <section id="journey" className="block journey">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">02</span>
          {COPY.journeyEyebrow}
        </div>
        <h2 className="section-title reveal delay-1">{COPY.journeyTitle}</h2>
        <p className="section-lede reveal delay-2">{COPY.journeyLede}</p>
      </div>

      <div className="wrap journey-layout" ref={wrapperRef}>
        <div className="journey-steps">
          {COPY.steps.map((s, i) => (
            <div
              className={"journey-step" + (i === step ? " active" : "")}
              key={s.n}
            >
              <div className="journey-step-num">
                <span className="dot" />
                {s.n} · ADIM
              </div>
              <h3 className="journey-step-title">{s.title}</h3>
              <p className="journey-step-body">{s.body}</p>
              <span className="journey-step-tag">▸ {s.tag}</span>
            </div>
          ))}
        </div>
        <div className="journey-sticky">
          <Phone step={step} />
        </div>
      </div>
    </section>
  );
}
