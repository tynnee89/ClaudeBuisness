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


  /**
   * Basiszinssatz nach § 247 BGB (Deutsche Bundesbank), jeweils gültig ab Datum.
   * Bei jeder Anpassung (1.1. / 1.7.) hier oben einen neuen Eintrag ergänzen.
   */
  var BASE_RATES = [
    { from: "2024-01-01", rate: 3.62 },
    { from: "2024-07-01", rate: 3.37 },
    { from: "2025-01-01", rate: 2.27 },
    { from: "2025-07-01", rate: 1.27 },
    { from: "2026-01-01", rate: 1.27 },
    { from: "2026-07-01", rate: 1.52 },
  ];

  function dayNum(iso) {
    var p = iso.split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000;
  }

  function baseRateOn(iso) {
    var r = null;
    BASE_RATES.forEach(function (b) { if (b.from <= iso) r = b.rate; });
    return r;
  }

  /**
   * Verzugszinsen nach § 288 BGB, taggenau (act/365), mit Wechsel des Basiszinssatzes.
   * input: { amount, from, to, b2b }  – from = erster Verzugstag, to = letzter Zinstag (inklusive)
   */
  function defaultInterest(input) {
    var surcharge = input.b2b ? 9 : 5;
    var start = dayNum(input.from);
    var end = dayNum(input.to);
    if (!(end >= start) || BASE_RATES[0].from > input.from) {
      return { interest: 0, days: 0, periods: [], fee: 0, total: round2(input.amount || 0) };
    }
    var periods = [];
    var interest = 0;
    for (var i = 0; i < BASE_RATES.length; i++) {
      var pStart = Math.max(start, dayNum(BASE_RATES[i].from));
      var pEnd = i + 1 < BASE_RATES.length ? Math.min(end, dayNum(BASE_RATES[i + 1].from) - 1) : end;
      if (pEnd < pStart) continue;
      var days = pEnd - pStart + 1;
      var rate = Math.max(0, BASE_RATES[i].rate + surcharge);
      var z = input.amount * (rate / 100) * (days / 365);
      interest += z;
      periods.push({ days: days, rate: round2(rate), interest: round2(z) });
    }
    interest = round2(interest);
    var fee = input.b2b ? 40 : 0;
    return {
      interest: interest,
      days: end - start + 1,
      periods: periods,
      fee: fee,
      total: round2(input.amount + interest + fee),
    };
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
    BASE_RATES: BASE_RATES,
    baseRateOn: baseRateOn,
    defaultInterest: defaultInterest,
    KU_PREV_LIMIT: KU_PREV_LIMIT,
    KU_CURRENT_LIMIT: KU_CURRENT_LIMIT,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WerkbankCalc = api;
})(typeof window !== "undefined" ? window : this);
