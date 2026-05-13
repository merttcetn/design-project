"use client";

import type { ReactNode } from "react";

const PIcon = {
  search: () => (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      width="16"
      height="16"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m13.5 13.5-3-3" />
    </svg>
  ),
  battery: () => (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect
        x=".5"
        y=".5"
        width="18"
        height="10"
        rx="2.5"
        stroke="currentColor"
        opacity=".4"
      />
      <rect x="2" y="2" width="14" height="7" rx="1.2" fill="currentColor" />
      <rect
        x="20"
        y="3.5"
        width="1.5"
        height="4"
        rx=".7"
        fill="currentColor"
        opacity=".4"
      />
    </svg>
  ),
  wifi: () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path
        d="M1 3.5a9 9 0 0 1 12 0M3 6a6 6 0 0 1 8 0M5.5 8.5a2 2 0 0 1 3 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function PhoneStatus({ time = "14:02" }: { time?: string }) {
  return (
    <div className="phone-status">
      <span>{time}</span>
      <span className="phone-status-icons">
        <PIcon.wifi />
        <PIcon.battery />
      </span>
    </div>
  );
}

function PhoneHeader({ tag = "Hastane Rotam" }: { tag?: string }) {
  return (
    <div className="papp-header">
      <div className="papp-mark">H</div>
      <div className="papp-title">
        {tag}
        <small>HACETTEPE · DEMO</small>
      </div>
    </div>
  );
}

function Screen1Open() {
  return (
    <div className="phone-content">
      <PhoneHeader />
      <div className="p-h1">Neredesiniz?</div>
      <div className="p-sub">352 konum hazır. Başlamak için bir nokta seçin.</div>
      <div className="p-input">
        <PIcon.search />
        <span className="placeholder">Departman, kat, kapı no…</span>
      </div>
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--ink-500)",
            marginBottom: 8,
          }}
        >
          Önerilen
        </div>
        <div className="p-row">
          <div className="icon">A1</div>
          <div className="body">
            <strong>Ana Giriş</strong>
            <small>A Blok · Zemin Kat</small>
          </div>
        </div>
        <div className="p-row">
          <div className="icon">B2</div>
          <div className="body">
            <strong>Acil Servis Girişi</strong>
            <small>B Blok · Zemin Kat</small>
          </div>
        </div>
        <div className="p-row">
          <div className="icon">C3</div>
          <div className="body">
            <strong>Otopark Asansörü</strong>
            <small>C Blok · Bodrum</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen2Search() {
  return (
    <div className="phone-content">
      <PhoneHeader />
      <div className="p-h1">Hedef</div>
      <div className="p-sub">352 yer arasında, aksana duyarlı arama.</div>
      <div className="p-input">
        <PIcon.search />
        <span style={{ color: "var(--ink-900)" }}>kardi</span>
        <span className="cursor" />
      </div>
      <div style={{ marginTop: 16 }}>
        <div className="p-row">
          <div className="icon">K</div>
          <div className="body">
            <strong>Kardiyoloji Polikliniği</strong>
            <small>D Blok · 2. Kat</small>
          </div>
          <div className="floor">D · 2</div>
        </div>
        <div className="p-row">
          <div className="icon">K</div>
          <div className="body">
            <strong>Kardiyoloji Yataklı Servis</strong>
            <small>D Blok · 3. Kat</small>
          </div>
          <div className="floor">D · 3</div>
        </div>
        <div className="p-row">
          <div className="icon">K</div>
          <div className="body">
            <strong>Kardiyovasküler Cerrahi</strong>
            <small>E Blok · 4. Kat</small>
          </div>
          <div className="floor">E · 4</div>
        </div>
        <div className="p-row">
          <div className="icon">K</div>
          <div className="body">
            <strong>Kardiyoloji EKG Odası</strong>
            <small>D Blok · 2. Kat</small>
          </div>
          <div className="floor">D · 2</div>
        </div>
      </div>
    </div>
  );
}

function Screen3Destination() {
  return (
    <div className="phone-content">
      <PhoneHeader />
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--ink-500)",
            }}
          >
            Başlangıç
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: 13,
              marginTop: 2,
              letterSpacing: "-.01em",
            }}
          >
            Ana Giriş · A0
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--red-700)",
            }}
          >
            Hedef
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: 13,
              marginTop: 2,
              letterSpacing: "-.01em",
            }}
          >
            Kardiyoloji · D2
          </div>
        </div>
      </div>

      <div className="p-map">
        <svg viewBox="0 0 280 140" preserveAspectRatio="none">
          <defs>
            <pattern
              id="grd"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path d="M20 0H0v20" stroke="rgba(20,17,15,.08)" fill="none" />
            </pattern>
          </defs>
          <rect width="280" height="140" fill="url(#grd)" />
          <rect
            x="20"
            y="20"
            width="80"
            height="100"
            rx="4"
            fill="rgba(20,17,15,.04)"
            stroke="rgba(20,17,15,.18)"
          />
          <rect
            x="120"
            y="20"
            width="60"
            height="60"
            rx="4"
            fill="rgba(20,17,15,.04)"
            stroke="rgba(20,17,15,.18)"
          />
          <rect
            x="200"
            y="40"
            width="60"
            height="80"
            rx="4"
            fill="rgba(160,26,31,.06)"
            stroke="rgba(160,26,31,.4)"
          />
          <path
            d="M40 100 L100 80 L150 60 L210 70"
            stroke="#a01a1f"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="40" cy="100" r="5" fill="#14110f" />
          <circle
            cx="40"
            cy="100"
            r="9"
            fill="none"
            stroke="#14110f"
            strokeOpacity=".25"
          />
          <circle cx="210" cy="70" r="5" fill="#a01a1f" />
          <circle
            cx="210"
            cy="70"
            r="9"
            fill="none"
            stroke="#a01a1f"
            strokeOpacity=".4"
          />
        </svg>
      </div>

      <div className="p-route-list">
        <div className="leg">
          <span className="num">~</span>
          <span>
            Tahmini yürüyüş <strong style={{ color: "var(--ink-900)" }}>4 dk</strong> · 8 adım
          </span>
        </div>
      </div>

      <div className="p-toggle on" style={{ marginTop: "auto" }}>
        <span>Merdivensiz rota (yalnız asansör)</span>
        <span className="p-toggle-sw" />
      </div>
      <div className="p-cta red" style={{ marginTop: 10 }}>
        Rotayı Hesapla →
      </div>
    </div>
  );
}

function Screen4Calculating() {
  return (
    <div className="phone-content">
      <PhoneHeader />
      <div className="p-loading">
        <div className="p-loading-dots">
          <span />
          <span />
          <span />
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-.015em",
            }}
          >
            Rota hesaplanıyor
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--ink-500)",
              marginTop: 8,
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            Dijkstra · 267 düğüm · 587 kenar
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <div
            style={{
              padding: "6px 10px",
              background: "var(--cream)",
              borderRadius: 8,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--ink-700)",
            }}
          >
            graph · ok
          </div>
          <div
            style={{
              padding: "6px 10px",
              background: "var(--red-50)",
              borderRadius: 8,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--red-700)",
            }}
          >
            llm · rewriting…
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen5Step() {
  return (
    <div className="phone-content">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--ink-500)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          ← Rota
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--red-700)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          Kardiyoloji · D2
        </span>
      </div>

      <div className="p-progress">
        <div className="p-progress-bar" style={{ width: "38%" }} />
      </div>
      <div className="p-step-counter">
        <span>Adım 3 / 8</span>
        <span>~2 dk kaldı</span>
      </div>

      <div className="p-instruction">
        <span className="step-type">
          <span
            style={{
              width: 6,
              height: 6,
              background: "var(--paper)",
              borderRadius: "50%",
            }}
          />
          Asansör
        </span>
        <div className="text">
          D Blok asansörüne binin ve{" "}
          <em
            style={{
              color: "var(--red-800)",
              fontStyle: "normal",
              background: "var(--red-100)",
              padding: "0 4px",
              borderRadius: 3,
            }}
          >
            2. kata
          </em>{" "}
          çıkın.
        </div>
        <div className="land">Danışmanın arkasında, mavi tabelaları takip edin.</div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: "12px 14px",
          background: "var(--cream)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--white)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--ink-700)",
          }}
        >
          4.
        </div>
        <div style={{ flex: 1, fontSize: 12, color: "var(--ink-700)" }}>
          Asansörden çıkın, sağa dönün
        </div>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--ink-500)",
          }}
        >
          Sonraki
        </span>
      </div>

      <div className="p-cta red" style={{ marginTop: "auto" }}>
        Tamamlandı →
      </div>
    </div>
  );
}

function Screen6Arrival() {
  return (
    <div className="phone-content">
      <PhoneHeader />
      <div className="p-progress">
        <div className="p-progress-bar" style={{ width: "100%" }} />
      </div>
      <div className="p-step-counter">
        <span>Adım 8 / 8</span>
        <span style={{ color: "var(--red-700)" }}>Tamamlandı</span>
      </div>

      <div className="p-arrival">
        <div className="check">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 5 5 9-11" />
          </svg>
        </div>
        <h2>Hedefe ulaştınız</h2>
        <p>Kardiyoloji Polikliniği · D Blok · 2. Kat</p>
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            background: "var(--cream)",
            borderRadius: 10,
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--ink-700)",
          }}
        >
          Toplam · 4 dk 12 sn · 187 m
        </div>
      </div>

      <div className="p-cta red">Varışa Geç ✓</div>
    </div>
  );
}

const SCREENS: (() => ReactNode)[] = [
  Screen1Open,
  Screen2Search,
  Screen3Destination,
  Screen4Calculating,
  Screen5Step,
  Screen6Arrival,
];

export function Phone({ step = 0 }: { step?: number }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="phone-screen">
          {SCREENS.map((S, i) => (
            <div
              key={i}
              className="phone-screen-inner"
              style={{
                opacity: i === step ? 1 : 0,
                transform: i === step ? "translateY(0)" : "translateY(8px)",
                pointerEvents: i === step ? "auto" : "none",
              }}
            >
              <PhoneStatus />
              <S />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
