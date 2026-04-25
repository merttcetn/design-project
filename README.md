# Hastane İçi Navigasyon Sistemi

Düğüm ve kenar verilerinden bir adjacency list grafı oluşturup Dijkstra algoritmasıyla iki nokta arasındaki en kısa yolu bulan navigasyon sistemi.

## Proje Yapısı

```
├── nodes/                  # Kat bazlı düğüm tanımları
│   ├── zemin_kat_nodes.json
│   ├── kat_1_nodes.json
│   ├── kat_2_nodes.json
│   ├── kat_3_nodes.json
│   └── kat_4_nodes.json
├── edges/                  # Kat bazlı kenar tanımları
│   ├── zemin_kat_edges.json
│   ├── kat_1_edges.json
│   ├── kat_2_edges.json
│   └── kat_3_edges.json
├── vertical_edges.json     # Katlar arası geçiş kenarları (asansör, merdiven)
├── build_graph.py          # Kenar dosyalarını birleştirip graph.json üretir
├── navigator.py            # Dijkstra tabanlı rota bulma
└── test_navigator.py       # Pytest test dosyası
```

## Kurulum

```bash
pip install pytest
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
find_route("graph.json", "ZEMIN_KAT_1", "KAT_1_6", avoid_stairs=True)

# Merdiven dahil en kısa rota
find_route("graph.json", "ZEMIN_KAT_1", "KAT_1_6", avoid_stairs=False)
```

`find_route` şu dict'i döndürür:

```python
{
    "path": ["ZEMIN_KAT_1", "ZEMIN_KAT_5", "KAT_1_4", "KAT_1_6"],
    "instructions": ["Düz ilerle", "Asansöre bin", "Koridorda ilerle"]
}
```

Düğüm bulunamazsa `None` döner.

## Testleri Çalıştırma

```bash
# Önce grafı oluştur
python build_graph.py

# Tüm testleri çalıştır
python -m pytest test_navigator.py -v
```

### Test Kapsamı

| Kategori | Açıklama |
|---|---|
| Aynı kat | Zemin ve 1. katta bölüm içi navigasyon |
| Katlar arası | Zemin → 1. kat, asansörlü ve merdivenli |
| Geçersiz düğüm | Var olmayan start/goal için `None` dönmesi |
| Start == Goal | Boş path ve instruction dönmesi |

## Düğüm ID Formatı

| Kat | Format | Örnek |
|---|---|---|
| Zemin | `ZEMIN_KAT_<n>` | `ZEMIN_KAT_1` |
| 1. Kat | `KAT_1_<n>` | `KAT_1_6` |
| 2. Kat | `KAT_2_<n>` | `KAT_2_3` |
| 3. Kat | `KAT_3_<n>` | `KAT_3_5` |
