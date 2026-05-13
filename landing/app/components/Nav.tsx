"use client";

import { useEffect, useRef, useState } from "react";
import { POSTER_HREF } from "./content";

const LINKS = [
  { href: "#problem", label: "Sorun" },
  { href: "#journey", label: "Yöntem" },
  { href: "#numbers", label: "Sayılar" },
  { href: "#arch", label: "Mimari" },
  { href: "#team", label: "Ekip" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (y / total) * 100 : 0);

      const dy = y - lastY.current;
      if (y < 80) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      lastY.current = y;

      const offset = window.innerHeight * 0.35;
      let current = "";
      for (const l of LINKS) {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = l.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="nav-progress">
        <div className="nav-progress-bar" style={{ width: progress + "%" }} />
      </div>
      <nav
        className={
          "nav" + (scrolled ? " scrolled" : "") + (hidden ? " hidden" : "")
        }
      >
        <a className="nav-brand" href="#top">
          <img
            className="nav-logo"
            src="/hacettepe-logo.svg"
            alt="Hacettepe Üniversitesi"
          />
          <span className="nav-course">
            <span className="mark" />
            BBM 479 · 2026
          </span>
          <span className="nav-title">
            Hacettepe Hastanesi <em>kapalı alan navigasyonu</em>
          </span>
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "active" : ""}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          className="nav-cta"
          href={POSTER_HREF}
          target="_blank"
          rel="noreferrer"
        >
          Posteri Aç <span className="arrow">↗</span>
        </a>
      </nav>
    </>
  );
}
