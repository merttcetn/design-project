import { COPY, initials } from "./content";

export function Team() {
  return (
    <section id="team" className="block team">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">07</span>
          {COPY.teamEyebrow}
        </div>
        <div className="team-grid" style={{ marginTop: 48 }}>
          {COPY.team.map((name, i) => (
            <div
              className="team-card reveal"
              key={name}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="avatar">{initials(name)}</div>
              <div className="name">{name}</div>
            </div>
          ))}
        </div>
        <div className="supervisor reveal delay-4">
          <div className="avatar">{initials(COPY.supervisor)}</div>
          <div>
            <div className="label">{COPY.supervisorRole}</div>
            <div className="who">{COPY.supervisor}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
