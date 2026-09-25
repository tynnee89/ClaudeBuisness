/* Reine Rechenfunktionen – im Browser (window.WerkbankCalc) und in Node (Tests) nutzbar. */
(function (root) {
  "use strict";

  function round2(x) {
    return Math.round((x + Number.EPSILON) * 100) / 100;
  }

  /** Netto -> Brutto bzw. Brutto -> Netto. rate in Prozent (z. B. 19). */
  function vat(amount, rate, direction) {
    var r = rate / 100;
    if (direction === "gross-to-net") {
      var net = amount / (1 + r);
      return { net: round2(net), vat: round2(amount - net), gross: round2(amount) };
    }
    var v = amount * r;
    return { net: round2(amount), vat: round2(v), gross: round2(amount + v) };
  }

  /**
   * Stundensatz für Selbstständige.
   * input: { targetIncome, costs, weeksOff, sickDays, hoursPerWeek, billableShare }
   *  - targetIncome: gewünschtes Jahres-Bruttoeinkommen (vor Steuern, nach Betriebskosten) in €
   *  - costs: jährliche Betriebskosten + Versicherungen (Kranken-, Rentenvers. etc.) in €
   *  - weeksOff: Urlaubswochen pro Jahr
   *  - sickDays: Krankheitstage pro Jahr
   *  - hoursPerWeek: Arbeitsstunden pro Woche
   *  - billableShare: Anteil abrechenbarer Stunden in Prozent (Rest: Akquise, Verwaltung)
   */
  function hourlyRate(input) {
    var weeks = 52 - input.weeksOff - input.sickDays / 5;
    var totalHours = Math.max(0, weeks * input.hoursPerWeek);
    var billableHours = totalHours * (input.billableShare / 100);
    var revenueNeeded = input.targetIncome + input.costs;
    var rate = billableHours > 0 ? revenueNeeded / billableHours : NaN;
    return {
      workingWeeks: round2(weeks),
      billableHours: Math.round(billableHours),
      revenueNeeded: round2(revenueNeeded),
      rate: round2(rate),
      dayRate: round2(rate * 8),
    };
  }

  /**
   * Kleinunternehmerregelung § 19 UStG (Grenzen ab 01.01.2025):
   * Vorjahresumsatz <= 25.000 € UND laufender Umsatz <= 100.000 €.
   * Im Gründungsjahr gilt die 25.000-€-Grenze für das laufende Jahr.
   */
  var KU_PREV_LIMIT = 25000;
  var KU_CURRENT_LIMIT = 100000;

  function smallBusiness(input) {
    if (input.foundedThisYear) {
      var okFounding = input.currentRevenue <= KU_PREV_LIMIT;
      return {
        eligible: okFounding,
        reason: okFounding
          ? "Im Gründungsjahr liegt der erwartete Umsatz nicht über 25.000 €."
          : "Im Gründungsjahr darf der Umsatz 25.000 € nicht übersteigen.",
      };
    }
    if (input.previousRevenue > KU_PREV_LIMIT) {
      return { eligible: false, reason: "Der Vorjahresumsatz lag über 25.000 €." };
    }
    if (input.currentRevenue > KU_CURRENT_LIMIT) {
      return {
        eligible: false,
        reason: "Der Umsatz im laufenden Jahr übersteigt 100.000 € – ab dem Umsatz, mit dem die Grenze überschritten wird, gilt die Regelbesteuerung.",
      };
    }
    return {
      eligible: true,
      reason: "Vorjahresumsatz bis 25.000 € und laufender Umsatz bis 100.000 €.",
    };
  }

  /** Summiert Rechnungspositionen. items: [{qty, price}], vatRate in %, kleinunternehmer: bool */
  function invoiceTotals(items, vatRate, kleinunternehmer) {
    var net = 0;
    items.forEach(function (it) {
      var q = Number(it.qty) || 0;
      var p = Number(it.price) || 0;
      net += q * p;
    });
    net = round2(net);
    var v = kleinunternehmer ? 0 : round2(net * (vatRate / 100));
    return { net: net, vat: v, gross: round2(net + v) };
  }

  function formatEUR(x) {
    if (!isFinite(x)) return "–";
    return x.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  }

  var api = {
    round2: round2,
    vat: vat,
    hourlyRate: hourlyRate,
    smallBusiness: smallBusiness,
    invoiceTotals: invoiceTotals,
    formatEUR: formatEUR,
    KU_PREV_LIMIT: KU_PREV_LIMIT,
    KU_CURRENT_LIMIT: KU_CURRENT_LIMIT,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WerkbankCalc = api;
})(typeof window !== "undefined" ? window : this);
