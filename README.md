# FindAllEasy v4.5 — Intelligent Emotion Edition

**Yenilikler**
- Smart Reactive Banner: Aynı kategoride tekrar aramada AI banner çıkar.
- Zaman-temelli tema: ✨ sabah, ☀️ öğle, 🌙 akşam, 🌜 gece.
- 4 kartlı AI vitrin (kişisel öneriler).
- Final footer metni: “Onun uygun fiyatı bulması, parmak şıklatman kadar kolay. ✨”

## Kurulum
```bash
cp .env.example .env
npm install
npm run build-client
npm start
# http://localhost:8080
```

## Admin (gizli)
- `/admin` endpoint'i sadece `ADMIN_SECRET` ile erişilir.
- Header: `x-admin-secret: <secret>`
