# FindAllEasy v9.5 — Global Harmony Pro
- 8 dil (TR, EN, DE, FR, ES, RU, AR, JP) — otomatik algılama + manuel seçim
- Duygusal AI selam (vitrin sol üstü, emoji + zaman)
- Poppins Medium slogan + marka rengi (#0078FF)
- 4 yatay vitrin kartı, 200px yükseklik (minimal hover)
- PWA (manifest + service worker + ikonlar)
- **AI Engine Pro**: Ülke, kur (exchangerate.host), vergi (VAT tablosu) ile TR’ye göre **fiyat endeksi** hesaplar ve kart altına baloncuk yazar.

## Kurulum
Statik host (Render/Netlify/Vercel/GitHub Pages) yeterli. `index.html` kökte olmalı.

## Notlar
- Kur verileri `exchangerate.host` üzerinden çekilir (client-side). Erişim yoksa fallback oranları kullanılır.
- VAT tablosu `app.js` içinde düzenlenebilir.
