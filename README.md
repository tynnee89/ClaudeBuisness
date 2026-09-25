# Werkbank – Kostenlose Tools für Selbstständige

Ein Online-Business, das mit 0 € Startkapital auskommt: eine statische Website mit
kostenlosen Tools (Rechnungsgenerator, MwSt-Rechner, Stundensatz-Rechner,
Kleinunternehmer-Check). Sie bringt Besucher über Google und verdient Geld über ein digitales Produkt,
Spenden und Affiliate-Links.

- **Geschäftsplan, Roadmap & deine To-dos:** [PLAN.md](PLAN.md)
- **Zahlungslinks eintragen:** [`docs/assets/config.js`](docs/assets/config.js)
- **Live-Seite (nach Aktivierung von GitHub Pages):** https://tynnee89.github.io/ClaudeBuisness/

## Aufbau
```
docs/                 → wird 1:1 auf GitHub Pages veröffentlicht
  index.html          → Startseite
  tools/*.html        → die Tools
  assets/config.js    → Monetarisierungs-Links (Produkt, Spenden, Affiliate)
  assets/calc.js      → Rechenlogik (getestet)
  assets/site.js      → Header, Footer, Verkaufs-Box
tests/                → automatische Tests (npm test)
.github/workflows/    → testet jeden Push und veröffentlicht main automatisch
```

## Lokal testen
```bash
npm test
python3 -m http.server -d docs 8000   # dann http://localhost:8000 öffnen
```
