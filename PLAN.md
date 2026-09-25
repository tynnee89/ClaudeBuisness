# Werkbank – Geschäftsplan (Startkapital: 0 €)

## Geschäftsmodell in einem Satz
Kostenlose, datenschutzfreundliche Online-Tools für Selbstständige und Freelancer im
deutschsprachigen Raum ziehen über Google-Suchen Besucher an. Diese Besucher werden
über drei Kanäle monetarisiert – ohne dass nach dem Aufsetzen laufende Arbeit nötig ist.

| Kanal | Wie | Kosten | Wer zahlt Gebühren |
|---|---|---|---|
| 1. Digitales Produkt | „Freelancer-Vorlagenpaket" (PDF) über Gumroad / Ko-fi / Lemon Squeezy | 0 € | Plattform nimmt Provision pro Verkauf |
| 2. Spenden | „Kaffee spendieren"-Button (Ko-fi / PayPal.me) | 0 € | Plattform |
| 3. Affiliate | Empfehlungslinks zu Buchhaltungs-/Bank-Tools für Selbstständige | 0 € | – |

**Warum das funktioniert:** Suchbegriffe wie „Rechnung erstellen kostenlos",
„Mehrwertsteuer berechnen" oder „Stundensatz berechnen Freelancer" haben in Deutschland
hohes Suchvolumen. Wer sie sucht, ist genau die Zielgruppe für ein Vorlagenpaket und
für Buchhaltungssoftware.

**Warum 0 € reichen:**
- Hosting: GitHub Pages (kostenlos, öffentliches Repo)
- Deployment: GitHub Actions (kostenlos für öffentliche Repos)
- Verkauf/Zahlung: Gumroad/Ko-fi – kein Abo, nur Provision pro Verkauf
- Kein Server, keine Datenbank, keine Cookies → minimaler Datenschutz-Aufwand

## Ehrliche Einordnung
„Automatisch Geld" heißt hier: Nach dem Setup läuft die Seite ohne Zutun, Verkäufe
werden von der Plattform automatisch abgewickelt und ausgeliefert. **Aber:**
- SEO-Traffic braucht erfahrungsgemäß 3–9 Monate, bis er spürbar wird.
- Einnahmen sind nicht garantiert. Realistisch zu Beginn: 0–50 €/Monat, mit Wachstum mehr.
- Rechtliches bleibt bei dir: Impressum (Pflicht in DE), Gewerbeanmeldung sobald
  regelmäßig verkauft wird, Einnahmen in der Steuererklärung angeben.

## Roadmap (Teilziele)

- [x] **Ziel 1** – Geschäftsmodell & Roadmap festlegen (dieses Dokument)
- [x] **Ziel 2** – Website-Grundgerüst, zentrale Monetarisierungs-Konfiguration (`docs/assets/config.js`),
      Impressum-/Datenschutz-Vorlagen
- [x] **Ziel 3** – Vier kostenlose Tools als Traffic-Magnet:
      Rechnungsgenerator, MwSt-Rechner, Stundensatz-Rechner, Kleinunternehmer-Check
- [x] **Ziel 4** – SEO (Meta-Tags, Sitemap, robots.txt, strukturierte Daten) +
      automatisches Deployment per GitHub Actions + automatische Tests
- [x] **Ziel 5** – Bezahlprodukt „Freelancer-Vorlagenpaket" (17 Seiten PDF) + Verkaufstext erstellt.
      Wurde dir direkt im Chat geschickt und liegt **bewusst nicht** im öffentlichen Repo
      (`produkt/` steht in `.gitignore`), sonst könnte es jeder gratis herunterladen.
- [ ] **Ziel 6 – DEINE Schritte** (kann niemand für dich erledigen, siehe unten)
- [ ] **Ziel 7** – Reichweite: Seite in Foren/Reddit/Communities teilen, Google Search Console
- [ ] **Ziel 8** – Ausbau: weitere Tools (z. B. Mahnungsgenerator, Brutto-Netto für Freelancer),
      je Tool = neue Suchbegriffe = mehr Traffic

## Ziel 6 – Deine To-dos (ca. 1 Stunde, 0 €)

1. **Branch nach `main` mergen** (Pull Request auf GitHub erstellen und mergen).
2. **GitHub Pages aktivieren:** Repo → *Settings* → *Pages* → *Source: GitHub Actions*.
   Danach ist die Seite erreichbar unter `https://tynnee89.github.io/ClaudeBuisness/`.
3. **Gumroad-Konto** (oder Ko-fi Shop / Lemon Squeezy) anlegen, das Vorlagenpaket-PDF
   hochladen, Titel und Beschreibung aus `Verkaufstext.md` übernehmen,
   Preis z. B. 9 € festlegen, Link kopieren.
4. **Ko-fi-Konto** für Spenden anlegen (optional), Link kopieren.
5. Links in `docs/assets/config.js` eintragen – Buttons erscheinen automatisch, sobald
   ein Link gesetzt ist.
6. **Impressum ausfüllen:** `docs/impressum.html` – Name und ladungsfähige Anschrift
   sind in Deutschland Pflicht (§ 5 DDG). Ohne Impressum nicht verkaufen!
7. **Google Search Console:** Seite anmelden und `sitemap.xml` einreichen
   (beschleunigt die Aufnahme bei Google deutlich).
8. Optional **Affiliate-Programme** (z. B. von Buchhaltungs-Software oder Geschäftskonten)
   beitreten und Links in `config.js` → `affiliates` eintragen.

## Kennzahlen, die du beobachten solltest
- Google Search Console: Impressionen & Klicks pro Seite
- Gumroad: Aufrufe der Produktseite → Verkäufe (Conversion)
- Ziel nach 6 Monaten: 1.000 Besucher/Monat, 1–2 % Kaufrate → 10–20 Verkäufe à 9 €
