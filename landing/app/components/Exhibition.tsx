import { Fragment } from "react";
import { COPY } from "./content";

export function Exhibition() {
  const words = COPY.exhibTagline.split(" ");
  const head = words.slice(0, 3).join(" ");
  const tail = words.slice(3).join(" ");

  return (
    <section id="exhib" className="block exhib">
      <div className="wrap exhib-inner">
        <div>
          <div
            className="section-eyebrow reveal"
            style={{ color: "rgba(247,243,235,.7)" }}
          >
            <span
              className="num"
              style={{
                background: "var(--ink-900)",
                color: "var(--paper)",
              }}
            >
              08
            </span>
            {COPY.exhibLabel}
          </div>
          <h2 style={{ marginTop: 18 }} className="reveal delay-1">
            {head} <em>{tail}</em>
          </h2>
          <p className="exhib-lede reveal delay-2">{COPY.exhibLede}</p>
        </div>
        <div className="exhib-card reveal delay-2">
          <div className="date">Sergi · BBM479</div>
          <div className="day">15</div>
          <div className="month">Mayıs 2026</div>
          <dl className="when">
            {COPY.exhibWhen.map(([k, v]) => (
              <Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
