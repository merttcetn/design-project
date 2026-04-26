# Hastane İçi Navigasyon Sistemi

Kenar verilerinden bir adjacency list grafı oluşturup Dijkstra algoritmasıyla iki nokta arasındaki en kısa yolu bulan hastane içi navigasyon sistemi. `nodes/` dosyaları kat bazlı düğüm metadatasını tutar; varsayılan rota grafı `edges/` dosyalarından üretilir.

## Proje Yapısı

```
├── nodes/                  # Kat bazlı düğüm metadata tanımları
│   ├── zemin_kat_nodes.json
│   ├── kat_1_nodes.json
│   ├── kat_2_nodes.json
│   ├── kat_3_nodes.json
│   └── kat_4_nodes.json
├── edges/                  # Kat bazlı kenar tanımları
│   ├── zemin_kat_edges.json
│   ├── kat_1_edges.json
│   ├── kat_2_edges.json
│   ├── kat_3_edges.json
│   └── vertical_edges.json # Katlar arası geçiş kenarları (asansör, merdiven)
├── build_graph.py          # Kenar dosyalarını birleştirip graph.json üretir
├── navigator.py            # Dijkstra tabanlı rota bulma
├── llm_navigation_service.py # Talimatları LLM ile zenginleştirme servisi
├── prompts/                # LLM prompt şablonları
├── backend/                # FastAPI backend
│   ├── main.py             # FastAPI app, CORS, static files
│   ├── router.py           # /api/nodes ve /api/route endpoint'leri
│   ├── dev_router.py       # Opt-in geliştirme endpoint'leri
│   ├── models.py           # Pydantic request/response modelleri
│   ├── config.py           # Environment ve path ayarları
│   └── requirements.txt    # Backend bağımlılıkları
├── frontend/               # Next.js web frontend
│   ├── src/app/            # App Router sayfaları
│   ├── src/components/     # UI bileşenleri
│   ├── src/data/           # Node listeleme/formatlama helper'ları
│   ├── public/             # Statik asset'ler
│   └── package.json        # Frontend bağımlılıkları ve script'leri
├── test_navigator.py       # Rota bulma testleri
├── test_llm_service.py     # LLM çıktı parse ve entegrasyon testleri
└── test_config.py          # Backend config testleri
```

## Kurulum

Backend:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Frontend:

```bash
cd frontend
npm install
```

## Kullanım

### 1. Grafı Oluştur

Navigasyondan önce bir kez çalıştırılması gerekir. Kenar dosyaları değiştiğinde tekrar çalıştırılmalıdır.

```bash
python build_graph.py
```

### 2. Rota Bul

```python
from navigator import find_route

# Merdivenden kaçınarak rota bul (asansör tercihli)
find_route("graph.json", "ZEMIN_KAT_30", "ZEMIN_KAT_34", avoid_stairs=True)

# Merdiven dahil en kısa rota
find_route("graph.json", "ZEMIN_KAT_1", "KAT_1_6", avoid_stairs=False)
```

`find_route` şu dict'i döndürür:

```python
{
    "path": ["ZEMIN_KAT_30", "ZEMIN_KAT_32", "ZEMIN_KAT_34"],
    "instructions": ["Koridordan devam edin.", "Rampadan devam edin."]
}
```

Düğüm bulunamazsa veya rota yoksa `None` döner. `avoid_stairs=True` merdiven kenarlarına çok yüksek maliyet verir; mümkünse asansörlü rota seçilir.

## Backend'i Çalıştırma

Backend FastAPI ile local çalışır ve `graph.json` dosyasını kullanır. Kurulum adımındaki sanal ortam aktif olmalıdır.

Eğer `graph.json` yoksa veya kenar verileri değiştiyse grafı yeniden oluşturun:

```bash
python build_graph.py
```

Backend'i repo kökünden başlatın:

```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Çalıştığını kontrol etmek için:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

Manuel route testi:

```bash
curl -X POST http://127.0.0.1:8000/api/route \
  -H "Content-Type: application/json" \
  -d '{"start":"ZEMIN_KAT_30","goal":"ZEMIN_KAT_34","avoid_stairs":true}'
```

Frontend'in kullandığı konum listesini test etmek için:

```bash
curl http://127.0.0.1:8000/api/nodes
```

`/api/nodes`, repo kökündeki `nodes/` dosyalarını backend üzerinden okuyup frontend'e sıralı konum listesi olarak döndürür.

`MINIMAX_API_KEY` tanımlı değilken beklenen response formatı:

```json
{
  "path": ["ZEMIN_KAT_30", "ZEMIN_KAT_32", "ZEMIN_KAT_34"],
  "instructions": [
    {
      "index": 1,
      "from_node": "ZEMIN_KAT_30",
      "to_node": "ZEMIN_KAT_32",
      "instruction": "Koridordan devam edin.",
      "type": "corridor"
    },
    {
      "index": 2,
      "from_node": "ZEMIN_KAT_32",
      "to_node": "ZEMIN_KAT_34",
      "instruction": "Rampadan devam edin.",
      "type": "corridor"
    }
  ],
  "enhanced_instructions": [
    "Koridordan devam edin.",
    "Rampadan devam edin."
  ]
}
```

LLM zenginleştirme için `.env` içinde `MINIMAX_API_KEY` tanımlı olmalıdır. API key yoksa backend yine çalışır; `enhanced_instructions` ham talimatlardan fallback olarak üretilir. Varsayılan text modeli `MiniMax-M2.7` ve varsayılan servis adresi `https://api.minimax.io/v1` değeridir.

Örnek `.env` ayarları:

```bash
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_MODEL=MiniMax-M2.7
MINIMAX_BASE_URL=https://api.minimax.io/v1
```

## Frontend'i Çalıştırma

Frontend Next.js App Router ile yazılmış web uygulamasıdır. Mobil/Expo projesi artık tutulmaz.

Backend çalışırken ayrı bir terminalde:

```bash
cd frontend
npm run dev
```

Uygulama varsayılan olarak şu adreste açılır:

```text
http://localhost:3000
```

Frontend API adresi varsayılan olarak `http://127.0.0.1:8000` değerini kullanır. Farklı bir backend için `frontend/.env.local` oluşturun:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Web arayüzü konum listesini `/api/nodes`, rota hesaplamasını `/api/route` üzerinden alır. Bu yüzden frontend'i kullanırken backend'in ayakta olması gerekir.

Frontend doğrulama komutları:

```bash
cd frontend
npm run lint
npm run build
```

`frontend/public/hacettepe-logo.svg` Wikimedia Commons üzerinden alınan Hacettepe Üniversitesi logosudur. Logo kullanımı kurum marka/trademark kurallarına tabi olabilir.

### Backend Üzerinden Graph Build

Aşağıdaki endpoint'ler local geliştirme içindir ve varsayılan olarak kapalıdır. Açmak için `.env` içine şunu ekleyip backend'i yeniden başlatın:

```bash
ENABLE_DEV_ENDPOINTS=true
```

`graph.json` dosyasını backend endpoint'i ile yeniden üretmek için:

```bash
curl -X POST http://127.0.0.1:8000/api/graph/build
```

Response örneği:

```json
{
  "graph_path": "/path/to/graph.json",
  "edge_files": [
    "/path/to/edges/kat_1_edges.json",
    "/path/to/edges/kat_2_edges.json",
    "/path/to/edges/kat_3_edges.json",
    "/path/to/edges/zemin_kat_edges.json",
    "/path/to/edges/vertical_edges.json"
  ],
  "node_count": 268,
  "edge_count": 482,
  "message": "Graph rebuilt successfully."
}
```

### Backend Üzerinden Test Çalıştırma

Varsayılan olarak `test_navigator.py` çalışır:

```bash
curl -X POST http://127.0.0.1:8000/api/tests/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

Belirli test dosyalarını çalıştırmak için:

```bash
curl -X POST http://127.0.0.1:8000/api/tests/run \
  -H "Content-Type: application/json" \
  -d '{"targets":["test_navigator.py"],"verbose":true}'
```

Response içinde `passed`, `returncode`, `stdout` ve `stderr` alanları döner.

## Promptları Düzenleme

LLM promptları `prompts/` klasöründedir:

| Dosya | Kullanım |
|---|---|
| `prompts/navigation_system.txt` | JSON sözleşmeli adım adım navigasyon system prompt'u |
| `prompts/navigation_user.txt` | Ham rota adımlarını LLM'e veren user prompt şablonu |

Şablon dosyalarındaki placeholder alanları kod tarafından doldurulur. Bu placeholder isimlerini değiştirmeyin; geri kalan prompt metnini serbestçe düzenleyebilirsiniz.

## Git'e Eklenmeyen Dosyalar

Repo `.gitignore` ve `frontend/.gitignore` ile şu dosyalar dışarıda bırakılır:

| Yol | Sebep |
|---|---|
| `.env`, `.env.*`, `frontend/.env.local` | Lokal secret ve ortam ayarları |
| `.venv/`, `venv/`, `env/` | Python sanal ortamları |
| `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`, `.ruff_cache/` | Python test/cache çıktıları |
| `graph.json` | `build_graph.py` ile yeniden üretilebilen çıktı |
| `frontend/node_modules/` | npm bağımlılıkları |
| `frontend/.next/`, `frontend/out/`, `frontend/build/` | Next.js build/dev çıktıları |
| `frontend/next-env.d.ts` | Next.js tarafından yeniden üretilebilen TypeScript ortam dosyası |
| `frontend/.playwright-cli/` | Lokal Playwright doğrulama çıktıları |
| `.claude/`, `.vscode/`, `.idea/`, `.cursor/` | Lokal editör/ajan ayarları |

## Testleri Çalıştırma

Hızlı ve ağsız testler:

```bash
# Önce grafı oluştur
python build_graph.py

python -m pytest test_config.py test_navigator.py \
  test_llm_service.py::TestStripThinkTags \
  test_llm_service.py::TestParseStepsJson -q
```

LLM entegrasyon testleri `MINIMAX_API_KEY` yoksa skip edilir. API key tanımlıysa gerçek MiniMax API çağrısı yaparlar:

```bash
python -m pytest test_llm_service.py -v
```

### Test Kapsamı

| Kategori | Açıklama |
|---|---|
| Aynı kat | Zemin ve 1. katta bölüm içi navigasyon |
| Katlar arası | Zemin → 1. kat, asansörlü ve merdivenli |
| Geçersiz düğüm | Var olmayan start/goal için `None` dönmesi |
| Start == Goal | Boş path ve instruction dönmesi |
| Config | Dev endpoint varsayılanı ve opt-in davranışı |
| LLM parse | Markdown JSON, geçersiz JSON ve `steps: list[str]` doğrulaması |

## Düğüm ID Formatı

| Kat | Format | Örnek |
|---|---|---|
| Zemin | `ZEMIN_KAT_<n>` | `ZEMIN_KAT_1` |
| 1. Kat | `KAT_1_<n>` | `KAT_1_6` |
| 2. Kat | `KAT_2_<n>` | `KAT_2_3` |
| 3. Kat | `KAT_3_<n>` | `KAT_3_5` |
| 4. Kat | `KAT_4_<n>` | `KAT_4_1` |

Not: `nodes/kat_4_nodes.json` dosyası mevcut, ancak varsayılan `build_graph.py` şu anda kat 4 için ayrı bir edge dosyası kullanmıyor. Bu yüzden üretilen `graph.json` içinde kat 4 düğümleri bulunmayabilir.
