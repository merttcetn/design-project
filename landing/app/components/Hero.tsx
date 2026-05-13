import { COPY, POSTER_HREF } from "./content";
import { HeroGraph } from "./HeroGraph";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" />
      <HeroGraph />
      <div className="wrap hero-inner">
        <span className="hero-eyebrow reveal in">
          <span className="pill">BBM479</span>
          {COPY.eyebrow}
        </span>
        <h1>
          <img
            className="hero-stamp reveal in"
            src="/hacettepe-logo.svg"
            alt="Hacettepe Üniversitesi"
          />
          <span className="reveal in">{COPY.h1_a}</span>{" "}
          <span className="red reveal in delay-1">{COPY.h1_b}</span>
          <br />
          <span className="underline-mark reveal in delay-2">{COPY.h1_c}</span>
          <br />
          <span className="reveal in delay-3">{COPY.h1_d}</span>
        </h1>
        <p className="hero-lede reveal in delay-3">{COPY.lede}</p>
        <div className="hero-actions reveal in delay-4">
          <a className="btn btn-primary" href="#journey">
            {COPY.cta_demo} →
          </a>
          <a
            className="btn btn-ghost"
            href={POSTER_HREF}
            target="_blank"
            rel="noreferrer"
          >
            {COPY.cta_poster}
          </a>
        </div>
        <div className="hero-meta">
          {COPY.meta.map(([k, v], i) => (
            <div
              className="hero-meta-item reveal"
              key={k}
              style={{ transitionDelay: `${0.4 + i * 0.08}s` }}
            >
              <div className="hero-meta-label">{k}</div>
              <div className="hero-meta-value">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
