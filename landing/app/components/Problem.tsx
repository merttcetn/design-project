import { COPY } from "./content";

export function Problem() {
  return (
    <section id="problem" className="block problem">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">01</span>
          {COPY.problemEyebrow}
        </div>
        <h2 className="section-title reveal delay-1">{COPY.problemTitle}</h2>
        <p className="section-lede reveal delay-2">{COPY.problemLede}</p>
        <div className="problem-stats">
          {COPY.problemStats.map(([n, label, unit], i) => (
            <div
              className="problem-stat reveal"
              key={label}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="problem-stat-num">
                {n}
                <span className="unit">{unit}</span>
              </div>
              <div className="problem-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
