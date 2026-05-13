import { COPY } from "./content";

export function Footer() {
  return (
    <footer>
      <div className="wrap foot-inner">
        <div className="foot-brand">
          <img
            className="foot-logo"
            src="/hacettepe-logo.svg"
            alt="Hacettepe Üniversitesi"
          />
          <div>
            <div className="foot-name">Hastane Rotam</div>
            <div className="foot-sub">Grup 53 · BBM479 · 2026</div>
          </div>
        </div>
        <div className="foot-meta">{COPY.footMeta}</div>
      </div>
    </footer>
  );
}
