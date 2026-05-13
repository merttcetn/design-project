const ITEMS: [string, string][] = [
  ["267", "düğüm"],
  ["587", "kenar"],
  ["352", "yer"],
  ["8", "blok"],
  ["5", "kat"],
  ["16", "düşey bağlantı"],
  ["4 dk", "ortalama yürüyüş"],
  ["187 m", "ortalama rota"],
  ["0", "GPS sinyali"],
  ["1 sn", "çizge yükleme"],
];

function Row() {
  return (
    <>
      {ITEMS.map(([num, lbl], i) => (
        <span className="ticker-item" key={`${num}-${lbl}-${i}`}>
          <span className="ticker-sep" />
          <span className="num">{num}</span>
          <span className="lbl">{lbl}</span>
        </span>
      ))}
    </>
  );
}

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {/* Two identical rows side-by-side make the loop seamless. */}
        <Row />
        <Row />
      </div>
    </div>
  );
}
