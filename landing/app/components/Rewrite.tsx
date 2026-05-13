export function Rewrite() {
  return (
    <section className="block rewrite">
      <div className="wrap">
        <div className="section-eyebrow reveal">
          <span className="num">04</span>
          LLM Yeniden Yazımı
        </div>
        <h2 className="section-title reveal delay-1">
          Mühendislik diliyle yazılmış adımları, hastanın anladığı tek bir cümleye çeviririz.
        </h2>
        <p className="section-lede reveal delay-2">
          Dijkstra ham yön verir. LLM, alan işaretlerini görür, yön kavramını kibarlaştırır ve gereksiz adımları birleştirir. Hizalama bizim için bir tasarım kararıdır.
        </p>

        <div className="rewrite-grid">
          <div className="rewrite-card before reveal">
            <span className="rewrite-tag">
              <span className="dot" />
              Önce · Dijkstra çıktısı
            </span>
            <div className="rewrite-code">{`step 3/8
type:    elevator
node:    D-ELV-0 → D-ELV-2
floor:   0 → 2
heading: N
landmark: info_desk_left`}</div>
            <div className="rewrite-meta">FastAPI · ham yön</div>
          </div>

          <div className="rewrite-arrow reveal delay-1" aria-hidden="true">
            →
          </div>

          <div className="rewrite-card after reveal delay-2">
            <span className="rewrite-tag red">
              <span className="dot" />
              Sonra · LLM yönergesi
            </span>
            <div className="rewrite-out">
              D Blok asansörüne binin ve{" "}
              <em>2. kata</em> çıkın. Danışmanın arkasında, mavi tabelaları takip edin.
            </div>
            <div className="rewrite-meta">MiniMax · landmark-tabanlı</div>
          </div>
        </div>
      </div>
    </section>
  );
}
