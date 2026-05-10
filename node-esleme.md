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


# 1. Kat — 2. Kat Node Eşleme

1. kat: **Azra Sena Kansu**
2. kat: **Azra Sena Kansu**

✓ = `diger_katlara_gecis: true` | ✗ = false

| # | Kat 1 | Açıklama | ↔ | Kat 2 | Açıklama | Tip |
|---|---|---|---|---|---|---|
| 1 | `KAT_1_3` | Kardiyoloji merdiven | ↔ | `KAT_2_1` | Alerji ve Ergen Sağlığı merdiven | merdiven |
| 2 | `KAT_1_8` | Kardiyoloji merdiven | ↔ | `KAT_2_5` | Alerji ve Ergen Sağlığı merdiven | merdiven |
| 3 | `KAT_1_10` | Çocuk Hastalıkları merdiven | ↔ | `KAT_2_11` | Baş Asistanlık merdiven | merdiven |
| 4 | `KAT_1_18` | Radyoloji merdiven | ↔ | `KAT_2_15` | 3. Blok merdiven | merdiven |
| 5 | `KAT_1_19_1` | Beyin Cerrahi asansör | ↔ | `KAT_2_16` | 3. Blok asansör | asansör |
| 6 | `KAT_1_19` | Beyin Cerrahi merdiven | ↔ | `KAT_2_17` | 3. Blok merdiven | merdiven |
| 7 | `KAT_1_22` | Beyin Cerrahi merdiven | ↔ | `KAT_2_20` | Ç. Ortopedi - Üroloji merdiven | merdiven |
| 8 | `KAT_1_29_2` | Beyin Cerrahi asansör | ↔ | `KAT_2_24` | 5. Blok asansör | asansör |
| 9 | `KAT_1_29_1` | Beyin Cerrahi merdiven | ↔ | `KAT_2_25` | 5. Blok merdiven | merdiven |
| 10 | `KAT_1_51` | Plastik Cerrahi asansör | ↔ | `KAT_2_27` | Göz asansör | asansör |
| 11 | `KAT_1_54` | Plastik Cerrahi merdiven | ↔ | `KAT_2_30` | Göz merdiven | merdiven |
| 12 | `KAT_1_32` | Beyin Cerrahi asansör | ↔ | `KAT_2_35` | 6. Blok asansör | asansör |
| 13 | `KAT_1_33` | Beyin Cerrahi merdiven | ↔ | `KAT_2_36` | 6. Blok merdiven | merdiven |
| 14 | `KAT_1_36` | Beyin Cerrahi AD merdiven | ↔ | `KAT_2_37` | 6. Blok merdiven | merdiven |
| 15 | `KAT_1_50` | Göğüs Hastalıkları merdiven | ↔ | `KAT_2_41` | Beyin Cerrahi, Dermatoloji merdiven | merdiven |
| 16 | `KAT_1_57` | Doğumhane merdiven | ↔ | `KAT_2_45` | Kadın Doğum merdiven | merdiven |


# 3. Kat — 4. Kat Node Eşleme

3. kat: **Bora Dere**
4. kat: **Azra Sena Kansu**

| # | Zemin Kat | Açıklama | ↔ | Kat 1 | Açıklama | Tip | Not |
|---|---|---|---|---|---|---|---|
| 1 | `KAT_3_1` | Nefroloji asansör | ↔ | `KAT_4_1` | cocuk ruh sagligi asansör | asansör | |
| 2 | `KAT_3_2` | Nefroloji merdiven | ↔ | `KAT_4_2` | cocuk ruh sagligi merdiven | merdiven | |
| 3 | `KAT_3_6` | Endokrin asansör | ↔ | `KAT_4_6` | cocuk ruh sagligi asansör | asansör | |
| 4 | `KAT_3_11` | Enstitü dergi merdiven | ↔ | `KAT_4_11` | cocuk ruh sagligi merdiven | merdiven | |
| 5 | `KAT_3_13` | KBB merdiven | ↔ | `KAT_4_25` | Psikiyatri merdiven | merdiven | |
| 6 | `KAT_3_14` | KBB asansör | ↔ | `KAT_4_26` | Psikiyatri asansör | asansör | |
| 7 | `KAT_3_21` | Genel cerrahi asansör | ↔ | `KAT_4_33` | kalp damar asansör | asansör | |
| 8 | `KAT_3_22` | Genel cerrahi merdiven | ↔ | `KAT_4_32` | kalp damar merdiven | merdiven | |
| 9 | `KAT_3_27` | Çocuk kalp damar merdiven | ↔ | `KAT_4_26` | cocuk servisi merdiven | merdiven | |
| 10 | `KAT_3_29` | Çocuk kalp damar merdiven | ↔ | `KAT_4_22` | cocuk ruh sagligi merdiven | merdiven | |
| 11 | `KAT_3_30` | Çocuk kalp damar asansör | ↔ | `KAT_4_21` | cocuk servisi asansör | asansör | |
| 12 | `KAT_3_33` | Genel cerrahi asansör | ↔ | `KAT_4_39` | nöroloji asansör | asansör | |
| 13 | `KAT_3_34` | Genel cerrahi merdiven | ↔ | `KAT_4_40` | nöroloji merdiven | merdiven | |
| 14 | `KAT_3_37` | Doğum servisi merdiven | ↔ | `KAT_4_50` | Üroloji merdiven | merdiven | |
| 15 | `KAT_3_39` | Doğum servisi asansör | ↔ | `KAT_4_56` | Üroloji asansör | asansör | |
| 16 | `KAT_3_40` | Doğum servisi merdiven | ↔ | `KAT_4_55` | Üroloji merdiven | merdiven | |
| 17 | `KAT_3_26` | Doğum servisi merdiven | ↔ | `KAT_4_48` | nöroloji merdiven | merdiven | |
| 18 | `KAT_3_45` | Yanık asansör | ↔ | `KAT_4_43` | nöroloji asansör | asansör | |
| 19 | `KAT_3_48` | Yanık merdiven | ↔ | `KAT_4_44` | nöroloji merdiven | merdiven | |
| 20 | `KAT_3_54` | Giriş merdiven | ↔ | `KAT_4_62` | romatoloji merdiven | merdiven | |
| 21 | `KAT_3_78` | Kardiyoloji asansör | ↔ | `KAT_4_68` | cocuk ruh sagligi asansör | asansör | |
| 22 | `KAT_3_79` | Kardiyoloji merdiven | ↔ | `KAT_4_67` | cocuk ruh sagligi merdiven | merdiven | |


## Eşlenmemiş Kat 4 Node'ları

4. katta karşılığı bulunmayan, Azra'nın girmesi gereken node'lar:

| Node | Açıklama |
|---|---|
| `KAT_3_10` | Enstitü dergi asansör | 4. katta karşılığı görünmüyor — eşleme yok |
| `KAT_3_64` | Nefroloji asansör | 4. katta karşılığı görünmüyor — eşleme yok |
| `KAT_3_72` | Giriş merdiven | 4. katta döner sermayenin hemen alıntdaki merdiven — eşleme yok |