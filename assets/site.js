/* Gemeinsamer Header, Footer und Monetarisierungs-Blöcke für alle Seiten. */
(function () {
  "use strict";
  var cfg = window.WERKBANK_CONFIG || {};
  var root = document.body.getAttribute("data-root") || "./";

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var header = el(
    '<header class="site"><div class="wrap">' +
      '<a class="brand" href="' + root + '">Werk<span>bank</span></a>' +
      '<nav class="main">' +
        '<a href="' + root + 'tools/rechnung.html">Rechnung</a>' +
        '<a href="' + root + 'tools/mwst-rechner.html">MwSt</a>' +
        '<a href="' + root + 'tools/stundensatz-rechner.html">Stundensatz</a>' +
        '<a href="' + root + 'tools/kleinunternehmer-check.html">Kleinunternehmer</a>' +
        '<a href="' + root + 'tools/verzugszinsen-rechner.html">Verzugszinsen</a>' +
      "</nav></div></header>"
  );
  document.body.insertBefore(header, document.body.firstChild);

  // Produkt-/Spenden-/Affiliate-Block an Platzhalter <div data-promo></div>
  var p = cfg.product || {};
  var d = cfg.donation || {};
  var affs = (cfg.affiliates || []).filter(function (a) { return a && a.url; });
  document.querySelectorAll("[data-promo]").forEach(function (slot) {
    var parts = [];
    if (p.url) {
      parts.push(
        '<h3>' + esc(p.title) + ' <span class="price">– ' + esc(p.price) + "</span></h3>" +
        "<p>" + esc(p.pitch) + "</p>" +
        '<p style="margin-top:12px"><a class="btn" rel="noopener" href="' + esc(p.url) + '">Jetzt herunterladen</a></p>'
      );
    }
    if (affs.length) {
      parts.push(
        "<h3>Empfehlungen</h3><ul>" +
          affs.map(function (a) {
            return '<li><a rel="sponsored noopener" href="' + esc(a.url) + '">' + esc(a.name) + "</a> – " + esc(a.text || "") + "</li>";
          }).join("") +
          '</ul><p class="small" style="font-size:.8rem;color:var(--muted)">* Affiliate-Links: Bei einem Kauf erhalten wir ggf. eine Provision. Für dich entstehen keine Mehrkosten.</p>'
      );
    }
    if (d.url) {
      parts.push(
        "<p>Dir hat das Tool geholfen? Es bleibt kostenlos – über eine kleine Unterstützung freuen wir uns.</p>" +
        '<p><a class="btn secondary" rel="noopener" href="' + esc(d.url) + '">' + esc(d.label) + "</a></p>"
      );
    }
    if (!parts.length) { slot.remove(); return; }
    slot.className = "card promo no-print";
    slot.innerHTML = parts.join('<hr style="border:0;border-top:1px solid var(--line);margin:16px 0">');
  });

  var footer = el(
    '<footer class="site"><div class="wrap">' +
      '<p><a href="' + root + 'impressum.html">Impressum</a>' +
      '<a href="' + root + 'datenschutz.html">Datenschutz</a>' +
      (d.url ? '<a rel="noopener" href="' + esc(d.url) + '">Unterstützen</a>' : "") +
      "</p><p>Alle Berechnungen laufen ausschließlich in deinem Browser. Keine Cookies, kein Tracking. " +
      "Angaben ohne Gewähr – keine Steuerberatung.</p></div></footer>"
  );
  document.body.appendChild(footer);
})();
