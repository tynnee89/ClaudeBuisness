/*
 * ZENTRALE MONETARISIERUNGS-KONFIGURATION
 * ---------------------------------------
 * Trage hier deine Links ein. Leere Links ("") werden auf der Seite
 * automatisch ausgeblendet – du kannst also Schritt für Schritt starten.
 */
window.WERKBANK_CONFIG = {
  siteName: "Werkbank",
  siteUrl: "https://tynnee89.github.io/ClaudeBuisness/",

  // Kanal 1: Digitales Produkt (Gumroad / Ko-fi Shop / Lemon Squeezy)
  product: {
    url: "", // z. B. "https://DEINNAME.gumroad.com/l/vorlagenpaket"
    title: "Freelancer-Vorlagenpaket",
    price: "9 €",
    pitch:
      "Angebots-, Mahnungs- und E-Mail-Vorlagen, Checklisten für die Gründung " +
      "und ein Preisfindungs-Leitfaden – sofort als PDF zum Download.",
  },

  // Kanal 2: Spenden
  donation: {
    url: "", // z. B. "https://ko-fi.com/DEINNAME" oder "https://paypal.me/DEINNAME"
    label: "Kaffee spendieren ☕",
  },

  // Kanal 3: Affiliate-Empfehlungen (werden nur angezeigt, wenn url gesetzt ist)
  affiliates: [
    // { name: "Buchhaltungs-Tool XY", url: "https://...", text: "Rechnungen & Belege automatisch verbuchen." },
  ],
};
