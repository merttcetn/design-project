# Zemin Kat — 1. Kat Node Eşleme

Zemin kat: **Mert Cetin**
1. kat: **Azra Sena Kansu**

✓ = `diger_katlara_gecis: true` | ✗ = false

| # | Zemin Kat | Açıklama | ↔ | Kat 1 | Açıklama | Tip | Not |
|---|---|---|---|---|---|---|---|
| 1 | `ZEMIN_KAT_5` | Giriş asansör | ↔ | `KAT_1_35` | Beyin Cerrahi AD asansor | asansör | |
| 2 | `ZEMIN_KAT_6` | Zemin kat merdiven | ↔ | `KAT_1_36` | Beyin Cerrahi AD merdiven | merdiven | |
| 3 | `ZEMIN_KAT_9` | Nükleer tıp merdiven | ↔ | `KAT_1_33` | Beyin Cerrahi merdiven | merdiven | |
| 4 | `ZEMIN_KAT_11` | Nükleer tıp koridor asansör | ↔ | `KAT_1_32` | Beyin Cerrahi asansor | asansör | |
| 5 | `ZEMIN_KAT_14` | Nükleer tıp asansör ve merdiven | ↔ | `KAT_1_28` | Beyin Cerrahi koridor | ? | `diger_katlara_gecis: true` eklenecek |
| 6 | `ZEMIN_KAT_29` | Ortopedi koridor | ↔ | `KAT_1_54` | Plastik Cerrahi merdiven | merdiven | |
| 7 | `ZEMIN_KAT_36` | merdiven | ↔ | `KAT_1_10` | Çocuk Hastalıkları merdiven | merdiven | |
| 8 | `ZEMIN_KAT_42` | Radyoloji merdiven | ↔ | `KAT_1_10` | Çocuk Hastalıkları merdiven | merdiven | ⚠️ Emin değil, aynı node'a iki zemin bağlanıyor |
| 9 | `ZEMIN_KAT_50` | merdiven | ↔ | `KAT_1_19` | Beyin Cerrahi merdiven | merdiven | |
| 10 | `ZEMIN_KAT_65` | merdiven | ↔ | `KAT_1_8` | Kardiyoloji merdiven | merdiven | description "merdiven" olarak güncellendi |
| 11 | `ZEMIN_KAT_60` | Romatoloji asansör | ↔ | `KAT_1_4` | Kardiyoloji asansor | asansör | |
| 12 | `ZEMIN_KAT_58` | merdiven | ↔ | `KAT_1_3` | Kardiyoloji merdiven | merdiven | |
| 13 | `ZEMIN_KAT_64` | Genel asansör | ↔ | `KAT_1_7` | Kardiyoloji asansor | asansör | |
| 14 | `ZEMIN_KAT_71` | merdiven | ↔ | `KAT_1_50` | gogus hastaliklari merdiven | merdiven | |
| 15 | `ZEMIN_KAT_74` | Kadın doğum asansör ve merdiven | ↔ | `KAT_1_57` | dogumhane merdiven | merdiven | |
| 16 | `ZEMIN_KAT_74` | Kadın doğum asansör ve merdiven | ↔ | `KAT_1_57_1` | dogumhane asansör | asansör | |

## Bekleyen Kararlar

- [ ] **#8** — `ZEMIN_KAT_36` ve `ZEMIN_KAT_42` ikisi de `KAT_1_10`'a bağlanıyor. Zemin katta aynı merdiven boşluğunun iki girişi var mı? Emin olunmadı.
- [x] **#10** — `ZEMIN_KAT_65` description'ı "merdiven" olarak güncellenecek
- [x] **#15** — `KAT_1_57_1` (dogumhane asansör) de `ZEMIN_KAT_74`'e bağlanacak
- [x] **#5** — `KAT_1_28`'e `diger_katlara_gecis: true` eklenecek

## Eşlenmemiş Kat 1 Node'ları

Zemin kat karşılığı bulunamayan, Azra'nın girmesi gereken node'lar:

| Node | Açıklama |
|---|---|
| `KAT_1_18` | Radyoloji merdiven | Zemin katta karşılığı görünmüyor — eşleme yok |
| `KAT_1_22` | Beyin Cerrahi merdiven | ⚠️ Belirsiz — ZEMIN_KAT_48'den kuzeye gidince duvar içinden merdiven var mı? |
| `KAT_1_29_1` | Beyin Cerrahi merdiven | İşlevi KAT_1_28 üstlendi — `diger_katlara_gecis` kaldırıldı |
| `KAT_1_51` | Plastik Cerrahi asansor | Planda asansör yok — `diger_katlara_gecis` kaldırıldı |
| `KAT_1_61` | dogumhane merdiven | Zemin kattan geçiş yok — boşta bırakıldı |