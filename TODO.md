# Wanderly Map — Görev Listesi

> Çalışma kuralı: Her görev bitince `tsc + eslint` doğrulaması yapılır ve
> **otomatik `git push`** edilir. Böylece Lovable üzerinden test edip geri
> bildirim verilebilir. History rewrite YOK (normal commit + push).

## Efsane

- `[x]` bitti + push'landı · `[>]` sıradaki · `[ ]` bekliyor

## Faz 0 — Stabilizasyon

- `[x]` **T0 — Yeşil build:** tip hataları kapatıldı, `tsc` + `eslint` temiz.

## Faz 1 — Harita (sıfır kurulum, anahtarsız)

- `[x]` **T1 — Harita yükleme garantisi:** Leaflet + OSM/CartoDB/Esri (anahtarsız) kalsın,
  Supabase yokken bile uygulama çökmesin (misafir modu). `api key required` hatası kapanmalı.
- `[x]` **T2 — Fotoğraflı pinler:** yuvarlak semboller yerine mekan/manzara fotoğrafı;
  sağ üstte organizatörün yuvarlak avatarı; avatara tıklayınca profil pop-up'ı.
- `[x]` **T3 — Mouse tekerleği zoom:** tekerlek + çift tık + +/- kontrolü çalışsın.

## Faz 2 — Filtreleme (Airbnb tarzı akordeon)

- `[x]` **T4 — 6 grup taksonomi:** Etkinlik & Deneyim (alt açılımlı), İçecek & Konsept,
  Kime Uygun, Bütçe (₺/₺₺/₺₺₺ + Ücretsiz), Tempo & Sağlık, Zaman & Mesafe (1–20 km).
- `[x]` **T5 — Akordeon + rozet:** her grup başlığında seçili sayısı, tek açık panel.
- `[x]` **T6 — Presetler:** Romantik Akşam / Ailecek Hafta Sonu / Genç & Hareketli.
- `[x]` **T7 — Footer:** "Tümünü Temizle" + canlı "X Etkinlik Göster".
- `[x]` **T8 — Pin-veri bağlama + Tarz Uyumu:** pinler anlık süzülsün; kartta `%` uyum;
  boş sonuçta en yakın 3 öneri.

## Faz 3 — Header + mesafe motoru

- `[x]` **T9 — Header:** arama (otomatik tamamlama) + "Haritaya Tıkla" modu +
  ikonlu hızlı filtre barı (Yeme & İçme, Doğa, Kültür, Gece Hayatı, Ücretsiz).
- `[x]` **T10 — Tıkla-pin ile etkinlik oluşturma:** haritaya tıklanan noktaya pin + sihirbaz.
- `[x]` **T11 — Mesafe motoru:** varsayılan 10 km (harita merkezli), zoom/kaydırmada
  viewport dahil etme, mesafeye göre sıralı kare kartlar + km rozeti,
  pin tıklayınca kart vurgulama.
- `[x]` **T12 — 12+ mock etkinlik:** İstanbul çevresine 5 yeni etkinlik (toplam 15).
- `[>]` **T13 — Mekan detayı:** canlı doluluk sayacı, masa krokisi (dolu/boş),
  menü kartı, yorum + beğeni/puan.
- `[ ]` **T14 — İstek Yolla / Kaydet / Hatırlat:** istek → organizatör onayı →
  anlık mesajlaşma açılır.

## Faz 5 — Sosyal + grup

- `[ ]` **T15 — Story'ler:** mekândan anlık story paylaşımı + görüntüleyici.
- `[ ]` **T16 — Yakın arkadaş + anket + lider:** toggle, bildirim, ret nedenleri
  (Menü/Kalabalık/Bütçe/Konum), lider ekranında oylar.
- `[ ]` **T17 — 6+ kişi grup indirimi:** mekâna bildirim + özel teklif akışı.
- `[ ]` **T18 — Gönüllü ev sahipliği:** 4.30+ puan kuralı + konaklama isteği akışı.

## Faz 6 — Opsiyonel

- `[ ]` **T19 — Tarih aralığı takvimi** (şu an "Bu Gece / Hafta Sonu" çipleri var).
- `[ ]` **T20 — Konum araması** (Nominatim, anahtarsız) + konumuma git butonu.
