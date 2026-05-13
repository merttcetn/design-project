import { COPY } from "./content";

export function Tech() {
  return (
    <section className="block tight">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">06</span>
          {COPY.techEyebrow}
        </div>
        <h2 className="section-title reveal delay-1">{COPY.techTitle}</h2>
        <div className="tech-list">
          {COPY.tech.map((t, i) => (
            <span
              className={
                "tech-chip reveal" + (COPY.techHl.includes(t) ? " hl" : "")
              }
              key={t}
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
