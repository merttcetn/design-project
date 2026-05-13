export const POSTER_HREF = "/uploads/bbm479-poster-final.pdf";

export const COPY = {
  eyebrow: "Hacettepe · BBM479 · Bitirme Projesi",
  h1_a: "Hastanenin",
  h1_b: "içinde",
  h1_c: "kaybolmak",
  h1_d: "tarih oluyor.",
  lede: "Hacettepe Hastanesi için LLM destekli, çizge tabanlı bir kapalı alan navigasyon sistemi. 352 konum, 267 düğüm, tek bir nazik Türkçe yönerge.",
  cta_demo: "Canlı Demo",
  cta_poster: "Posteri Aç",
  meta: [
    ["Konum", "8 Blok · 5 Kat"],
    ["Düğüm", "267"],
    ["Kenar", "587"],
    ["Yer", "352"],
  ] as [string, string][],

  problemEyebrow: "Sorun",
  problemTitle: "GPS sustuğunda, hastane bir labirente dönüşür.",
  problemLede:
    "Hacettepe Hastanesi 8 blok ve 5 katta yüzlerce departmanı barındırır. Hastalar, ziyaretçiler ve yeni başlayan personel her gün kaybolur. Statik tabelalar başlangıç noktasına ya da erişilebilirlik ihtiyaçlarına göre uyum sağlayamaz.",
  problemStats: [
    ["8", "Blok", "blok"],
    ["5", "Kat", "kat"],
    ["352", "Departman", "yer"],
    ["0", "GPS", "yok"],
  ] as [string, string, string][],

  journeyEyebrow: "Kullanıcı Yolculuğu",
  journeyTitle: "“Neredeyim?” den “Hedefe ulaştınız.” a — altı dokunuş.",
  journeyLede:
    "Aşağı kaydırın. Sağdaki telefon, hastane kapısından muayene kapısına kadar her adımı sizinle birlikte ilerletir.",
  steps: [
    {
      n: "01",
      title: "Uygulamayı aç",
      body: "Mobil öncelikli açılış ekranı tek bir şey sorar: neredesiniz? 352 konum indekslenmiş ve hazır.",
      tag: "352 konum · 1 saniyede hazır",
    },
    {
      n: "02",
      title: "Departmanı ara",
      body: "Tüm katlarda aksana duyarlı, anlık arama. “Kardiyoloji”, “ortopedi” ya da kapı numarası — fark etmez.",
      tag: "Aksana duyarlı · anlık",
    },
    {
      n: "03",
      title: "Hedefi seç",
      body: "Gideceğiniz yeri seçin ve gerekirse “Merdivensiz rota”yı açın — sistem sadece asansörler üzerinden gider.",
      tag: "Erişilebilirlik · merdivensiz mod",
    },
    {
      n: "04",
      title: "Rotayı hesapla",
      body: "FastAPI arka uç 267 düğümlü çizgede Dijkstra çalıştırır. Ham adımlar saniyeler içinde hazır.",
      tag: "Dijkstra · 267 düğüm · 587 kenar",
    },
    {
      n: "05",
      title: "Adım adım takip et",
      body: "LLM, mühendislik diliyle yazılmış ham adımları, alan işareti odaklı doğal Türkçe yönergelere çevirir. Tek bir adım. Tek bir ilerleme çubuğu.",
      tag: "MiniMax LLM · landmark-tabanlı",
    },
    {
      n: "06",
      title: "Hedefe ulaş",
      body: "Son adım net bir şekilde gösterilir. “Varışa Geç”e dokunarak varışı onaylar ve oturumu kapatırsınız.",
      tag: "Ortalama 4 dk · 187 m",
    },
  ],

  numbersEyebrow: "Sayılarla",
  numbersTitle: "Çizge tabanlı, ölçeklenebilir bir bina haritası.",
  numbersLede:
    "Her departman, asansör, koridor ve geçit elle işaretlenmiş düğümler ve kenarlar olarak bir JSON çizgede yaşar.",
  numbers: [
    ["267", "Çizge düğümü"],
    ["352", "Adlandırılmış yer"],
    ["587", "Kenar (geçiş)"],
    ["16", "Düşey bağlantı"],
  ] as [string, string][],

  archEyebrow: "Sistem Mimarisi",
  archTitle: "Her katman bağımsız test edilebilir. LLM opsiyoneldir.",
  archLede:
    "API anahtarı yoksa sistem ham adım metnine zarif bir şekilde geri düşer. Hiçbir adım yolda kaybolmaz.",
  arch: [
    ["01", "Kat Planları", "PDF / DWG dosyaları → manuel düğüm + kenar işaretlemesi", "kaynak"],
    ["02", "Çizge", "JSON komşuluk listesi · 267 düğüm · 587 kenar", "data"],
    ["03", "Dijkstra Pathfinding", "FastAPI · Python · merdivensiz tercih bayrağı", "backend"],
    ["04", "MiniMax LLM", "Ham Türkçe adımları yeniden yazar — landmark odaklı", "llm"],
    ["05", "Next.js Web App", "Mobil öncelikli arayüz · adım adım UI · ilerleme çubuğu", "frontend"],
  ] as [string, string, string, string][],

  techEyebrow: "Teknoloji",
  techTitle: "Sade, modern, doğrulanabilir bir yığın.",
  tech: ["Python", "FastAPI", "Dijkstra", "JSON graph", "MiniMax LLM", "Next.js", "TypeScript", "Tailwind CSS"],
  techHl: ["MiniMax LLM", "Dijkstra"],

  teamEyebrow: "Ekip · Grup 53",
  teamTitle: "Dört bilgisayar mühendisi, bir danışman, bir hastane.",
  team: ["Mert Çetin", "Azra Sena Kansu", "Bora Dere", "Berkay Yıldız"],
  supervisor: "Prof. Dr. Mehmet Önder Efe",
  supervisorRole: "Danışman",

  exhibTagline: "Posteri görmek için sergiye bekleriz.",
  exhibLede:
    "Demo cihazda canlı çalışacak. Mimari panoları, çizge görselleştirmesi ve LLM çıktısı yan yana.",
  exhibLabel: "Sergi",
  exhibWhen: [
    ["Tarih", "15 Mayıs 2026"],
    ["Saat", "14:00"],
    ["Yer", "Bilgisayar Mühendisliği Binası"],
    ["Ders", "BBM479"],
  ] as [string, string][],

  footMeta:
    "© 2026 · Grup 53 · Yalnızca akademik amaçlı bir öğrenci projesidir. Hacettepe Üniversitesi Hastaneleri’nin resmi bir ürünü değildir.",
};

export function initials(name: string): string {
  return name
    .replace("Prof. Dr. ", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}
