import { COPY } from "./content";

export function Architecture() {
  return (
    <section id="arch" className="block arch">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">05</span>
          {COPY.archEyebrow}
        </div>
        <h2 className="section-title reveal delay-1">{COPY.archTitle}</h2>
        <p className="section-lede reveal delay-2">{COPY.archLede}</p>
        <div className="arch-pipeline">
          {COPY.arch.map(([n, title, sub, tag], i) => (
            <div
              className="arch-layer reveal"
              key={n}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div className="arch-layer-num">{n}</div>
              <div className="arch-layer-title">
                {title}
                <small>{sub}</small>
              </div>
              <div className="arch-layer-tag">{tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
