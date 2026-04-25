# Navigasyon Uygulaması — UI Tasarımı

## Genel Konsept

React Native + Expo ile yazılan mobil bir uygulama (iOS & Android).  
Kullanıcı A ve B noktasını seçer; sistem adımları bir kart yığını (stack) olarak sunar.  
Her adım tamamlandığında "Tamamlandı" butonuna basılır, bir sonraki edge'e geçilir.

---

## Ekranlar

### 1. Başlangıç Seçim Ekranı

```
┌─────────────────────────────┐
│         Neredesiniz?        │
│                             │
│  Başlangıç (A)              │
│  ┌───────────────────────┐  │
│  │  Zemin Kat · Giriş ▼  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │       Devam Et        │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Bileşenler:**
- Dropdown A: Tüm node'lar, `bolum` + `description` ile gruplu
- "Devam Et" butonu → bir sonraki ekrana (Varış Seçimi) geçer

---

### 2. Varış Seçim Ekranı

```
┌─────────────────────────────┐
│  ←                          │
│   Nereye gitmek istiyorsunuz?│
│                             │
│  Varış (B)                  │
│  ┌───────────────────────┐  │
│  │  Kat seçin...      ▼  │  │
│  └───────────────────────┘  │
│                             │
│  ⬜ Merdivensiz rotayı seç   │
│                             │
│  ┌───────────────────────┐  │
│  │      Yol Bul          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Bileşenler:**
- Geri butonu (←) → Başlangıç Seçim ekranına döner
- Dropdown B: Tüm node'lar, `bolum` + `description` ile gruplu
- Toggle: "Merdivensiz rotayı seç" → `avoid_stairs` parametresi
- "Yol Bul" butonu → API çağrısı yapar, navigasyon ekranına geçer

---

### 3. Navigasyon Ekranı (Stack UI)

```
┌─────────────────────────────┐
│  ← Giriş → Kardiyoloji      │
│  ████████░░░░░  3 / 7 adım  │
├─────────────────────────────┤
│                             │
│  ╔═════════════════════╗    │
│  ║  [mevcut adım]      ║    │  ← aktif kart (büyük)
│  ║                     ║    │
│  ║  🚶  koridor        ║    │
│  ║                     ║    │
│  ║  Koridorda düz      ║    │
│  ║  devam edin, yolun  ║    │
│  ║  sonuna kadar       ║    │
│  ║  ilerleyin.         ║    │
│  ╚═════════════════════╝    │
│                             │
│  ┌─────────────────────┐    │  ← sonraki adım (soluk/küçük)
│  │  Asansöre girin.    │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │  ← +1 sonraki (daha soluk)
│  │  1. kattan çıkın.   │    │
│  └─────────────────────┘    │
│                             │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │   ✓  Tamamlandı       │  │  ← ana buton
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Stack Davranışı:**
- Aktif kart → tam görünür, büyük font
- Sonraki 2 kart → arkada soluk/küçültülmüş (peek efekti)
- "Tamamlandı" → aktif kart yukarı doğru kayarak kaybolur, stack aşağı iner
- Son adımda "Tamamlandı" → Varış ekranına geçer

**Adım Kartı İçeriği:**
- Talimat metni (instruction)
- Tip ikonu: 🚶 koridor, 🛗 asansör, 🪜 merdiven
- Kat bilgisi (node değiştiyse: "Kat 1 → Kat 2")

**İlerleme Çubuğu:**
- `tamamlanan / toplam_adım` sayısı
- Yüzde doluluk animasyonlu progress bar

---

### 4. Varış Ekranı

```
┌─────────────────────────────┐
│                             │
│          ✅                 │
│                             │
│   Hedefinize Ulaştınız!     │
│                             │
│   Kardiyoloji Polikliniği   │
│   Kat 1                     │
│                             │
│  ┌───────────────────────┐  │
│  │    Yeni Arama Yap     │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

## Veri Akışı

```
[Başlangıç Seçim Ekranı]
        │
        │ start seçildi
        ▼
[Varış Seçim Ekranı]
        │
        │ POST /api/route
        │ { start, goal, avoid_stairs }
        ▼
[navigator.find_route()]
        │
        │ { path: [...], instructions: [...] }
        ▼
[Navigasyon Ekranı]
        │
        │ currentIndex: 0 → 1 → 2 → ... → n
        │ (her "Tamamlandı" butonunda +1)
        ▼
[Varış Ekranı]
```

**State (frontend):**
```js
{
  steps: [
    { instruction: "Düz ilerleyin.", description: "Koridorda düz devam edin, yolun sonuna kadar ilerleyin.", type: "corridor", nodeId: "ZEMIN_KAT_5" },
    { instruction: "Asansöre girin.", description: "Sağ tarafınızda asansörü göreceksiniz. Asansöre binip 1. kata çıkın.", type: "elevator", nodeId: "ZEMIN_KAT_58" },
    ...
  ],
  currentIndex: 0,
  totalSteps: 7
}
```

---

## API Endpoint

**Backend: Flask veya FastAPI**

```
POST /api/route
Body: { "start": "ZEMIN_KAT_1", "goal": "KAT_1_6", "avoid_stairs": true }

Response:
{
  "steps": [
    { "nodeId": "ZEMIN_KAT_5", "instruction": "Düz ilerleyin.", "type": "corridor" },
    { "nodeId": "ZEMIN_KAT_58", "instruction": "Asansöre girin.", "type": "elevator" },
    ...
  ]
}
```

---

## Teknik Stack

| Katman      | Teknoloji                                  |
|-------------|--------------------------------------------|
| Frontend    | React Native + Expo (iOS & Android)        |
| Navigasyon  | Expo Router veya React Navigation          |
| Animasyon   | React Native Reanimated (kart geçişleri)   |
| UI Bileşen  | React Native core + Expo Vector Icons      |
| HTTP        | fetch / axios                              |
| Backend     | Flask veya FastAPI                         |
| API         | REST (JSON)                                |

---

## LLM Destekli Adım Açıklaması

Her navigasyon adımında, ham `instruction` metni bir LLM'e gönderilir ve kullanıcıya doğal, konuşma diliyle açıklanır.

### Akış

```
[navigator.find_route()]
        │
        │ steps[] (ham instruction'lar)
        ▼
[LLM Enrichment]
        │
        │ Tüm adımlar tek bir LLM isteğinde
        │ toplu olarak gönderilir
        ▼
[Zenginleştirilmiş Response]
```

### Prompt Tasarımı (Tek İstek — Toplu)

Tüm adımlar tek bir LLM çağrısında gönderilir. Bu sayede:
- **Latency**: N adım için N istek yerine 1 istek
- **Bağlam**: LLM tüm rotayı görebildiği için adımlar arası tutarlı ve bağlamsal açıklamalar üretir
- **Maliyet**: Tek istek, daha az token overhead

LLM'e gönderilen system prompt:

```
Sen bir hastane içi navigasyon asistanısın. Kullanıcıya yol tarifi 
adımlarını sıcak, anlaşılır ve kısa bir dille açıklıyorsun.

Sana bir rota verilecek. Her adım için doğal dilde bir açıklama üret.

Kurallar:
- Türkçe konuş
- Her açıklamayı 1-2 cümle ile sınırla
- Gerekirse yön belirten ipuçları ekle (sağ, sol, düz)
- Asansör/merdiven adımlarında kat değişimini vurgula
- Engelli erişimi varsa bunu belirt
- Adımlar arası tutarlı bir dil kullan
- JSON dizisi olarak döndür: [{"index": 1, "description": "..."}, ...]
```

User prompt:

```
Başlangıç: {{start_name}}
Hedef: {{goal_name}}

Rota adımları:
{{#each steps}}
  {{index}}. [{{type}}] "{{instruction}}" (Kat: {{floor}})
{{/each}}

Her adım için kullanıcıya gösterilecek doğal dil açıklamasını üret.
JSON dizisi olarak döndür.
```

### Örnek Dönüşüm

| Ham instruction | LLM açıklaması |
|---|---|
| `"Düz ilerleyin."` | `"Koridorda düz devam edin, yolun sonuna kadar ilerleyin."` |
| `"Asansöre girin."` | `"Sağ tarafınızda asansörü göreceksiniz. Asansöre binip 1. kata çıkın."` |
| `"Merdivenden çıkın."` | `"Merdivenlerden bir kat yukarı çıkın. Dikkatli olun, basamaklar dar olabilir."` |

### API Değişikliği

```
POST /api/route
Body: { "start": "ZEMIN_KAT_1", "goal": "KAT_1_6", "avoid_stairs": true }

Response:
{
  "steps": [
    {
      "nodeId": "ZEMIN_KAT_5",
      "instruction": "Düz ilerleyin.",
      "description": "Koridorda düz devam edin, yolun sonuna kadar ilerleyin.",
      "type": "corridor"
    },
    {
      "nodeId": "ZEMIN_KAT_58",
      "instruction": "Asansöre girin.",
      "description": "Sağ tarafınızda asansörü göreceksiniz. Asansöre binip 1. kata çıkın.",
      "type": "elevator"
    },
    ...
  ]
}
```

- `instruction`: orijinal ham talimat (kısa, teknik)
- `description`: LLM tarafından üretilen doğal dil açıklaması (kullanıcıya gösterilen)

### UI Yansıması (Navigasyon Kartı)

```
╔═════════════════════════╗
║  Adım 3 / 7             ║
║                         ║
║  🛗  Asansör             ║
║                         ║
║  Sağ tarafınızda        ║
║  asansörü göreceksiniz. ║
║  Asansöre binip 1. kata ║
║  çıkın.                 ║
║                         ║
║  Zemin Kat → Kat 1      ║
╚═════════════════════════╝
```

Kartta `description` (LLM açıklaması) gösterilir, `instruction` ise dahili olarak tutulur.

### Backend Implementasyon Notu

LLM çağrısı backend tarafında `/api/route` endpoint'inde yapılır:

1. `find_route()` ile ham adımlar hesaplanır
2. Tüm adımlar + başlangıç/hedef bilgisi tek bir prompt olarak LLM'e gönderilir
3. LLM, JSON dizisi olarak tüm açıklamaları döner
4. Backend, açıklamaları ilgili step'lere eşler ve response'u oluşturur

Opsiyonel: Sık kullanılan rotalar için LLM çıktısı cache'lenebilir (Redis / in-memory).

### Teknik Stack Eklentisi

| Katman   | Teknoloji                          |
|----------|------------------------------------|
| LLM      | Claude API / OpenAI API            |
| Cache    | Redis veya in-memory (opsiyonel)   |

---

## Animasyon Notları

- Kart geçişi: aktif kart `translateY: -screenHeight` + `opacity: 0` ile yukarı kayar (Reanimated `withTiming` / `withSpring`)
- Stack peek: sonraki kartlar `scale: 0.95` ve `0.9` ile küçük görünür; geçişte `scale: 1.0` olurlar
- Progress bar: `width` değeri Reanimated ile animasyonlu dolar
- Varış ekranı: ✅ ikonu `scale` + `fade-in` ile belirir
