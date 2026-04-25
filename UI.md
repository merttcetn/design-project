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
  path: ["ZEMIN_KAT_1", "ZEMIN_KAT_2", "KAT_1_6"],
  instructions: [
    { index: 1, from_node: "ZEMIN_KAT_1", to_node: "ZEMIN_KAT_2", instruction: "Düz ilerleyin.", type: "corridor" },
    { index: 2, from_node: "ZEMIN_KAT_2", to_node: "KAT_1_6", instruction: "Asansör ile 1. kata çıkın.", type: "elevator" },
    ...
  ],
  enhancedInstructions: [
    "Koridorda düz devam edin.",
    "Asansöre binip 1. kata çıkın."
  ],
  currentIndex: 0,
  totalSteps: 2
}
```

---

## API Endpoint

**Backend: FastAPI**

```
POST /api/route
Body: { "start": "ZEMIN_KAT_1", "goal": "KAT_1_6", "avoid_stairs": true }

Response:
{
  "path": ["ZEMIN_KAT_1", "ZEMIN_KAT_2", "KAT_1_6"],
  "instructions": [
    {
      "index": 1,
      "from_node": "ZEMIN_KAT_1",
      "to_node": "ZEMIN_KAT_2",
      "instruction": "Düz ilerleyin.",
      "type": "corridor"
    }
  ],
  "enhanced_instructions": [
    "Koridorda düz devam edin."
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
| Backend     | FastAPI                                    |
| API         | REST (JSON)                                |

---

## LLM Destekli Adım Açıklaması

Navigasyon rotasının ham `instruction` listesi MiniMax-M2.7'ye tek istekte gönderilir ve kullanıcıya doğal, konuşma diliyle açıklanacak `enhanced_instructions` listesi üretilir.

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

LLM'e gönderilen system prompt özeti:

```
Sen bir hastane iç mekan navigasyon asistanısın.
Ham rota adımlarını ziyaretçinin anlayacağı kısa ve güvenli Türkçe yönlendirmelere dönüştür.

Çıktı sözleşmesi:
- Yalnızca geçerli JSON object döndür
- Şema: {"steps": ["adım 1", "adım 2"]}
- Markdown, kod bloğu, düşünme süreci veya açıklama ekleme
```

User prompt:

```
Mevcut konum: {{current_location}}

Ham rota adımları:
{{steps_text}}

Ham adımları ziyaretçiye okunacak şekilde sadeleştir ve yalnızca {"steps": ["..."]} JSON object'i döndür.
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
  "path": ["ZEMIN_KAT_1", "...", "KAT_1_6"],
  "instructions": [
    {
      "index": 1,
      "from_node": "ZEMIN_KAT_1",
      "to_node": "ZEMIN_KAT_2",
      "instruction": "Düz ilerleyin.",
      "type": "corridor"
    }
  ],
  "enhanced_instructions": [
    "Koridorda düz devam edin.",
    "Asansöre ilerleyin ve 1. kata çıkın."
  ]
}
```

- `instruction`: orijinal ham talimat (kısa, teknik)
- `enhanced_instructions`: LLM tarafından üretilen doğal dil açıklama listesi

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

Kartta ilgili `enhanced_instructions` metni gösterilir, `instruction` ise dahili/teknik ham talimat olarak tutulur.

### Backend Implementasyon Notu

LLM çağrısı backend tarafında `/api/route` endpoint'inde yapılır:

1. `find_route()` ile ham adımlar hesaplanır
2. Tüm adımlar + başlangıç/hedef bilgisi tek bir prompt olarak LLM'e gönderilir
3. LLM, `{"steps": ["..."]}` şemasında açıklama listesini döner
4. Backend, `steps` listesini `enhanced_instructions` alanına koyar; parse veya model hatasında ham talimat fallback'i döner

Opsiyonel: Sık kullanılan rotalar için LLM çıktısı cache'lenebilir (Redis / in-memory).

### Teknik Stack Eklentisi

| Katman   | Teknoloji                          |
|----------|------------------------------------|
| LLM      | MiniMax-M2.7 (OpenAI-compatible API) |
| Cache    | Redis veya in-memory (opsiyonel)   |

---

## Animasyon Notları

- Kart geçişi: aktif kart `translateY: -screenHeight` + `opacity: 0` ile yukarı kayar (Reanimated `withTiming` / `withSpring`)
- Stack peek: sonraki kartlar `scale: 0.95` ve `0.9` ile küçük görünür; geçişte `scale: 1.0` olurlar
- Progress bar: `width` değeri Reanimated ile animasyonlu dolar
- Varış ekranı: ✅ ikonu `scale` + `fade-in` ile belirir
