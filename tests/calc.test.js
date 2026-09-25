const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../docs/assets/calc.js");

test("MwSt netto -> brutto 19 %", () => {
  assert.deepEqual(C.vat(100, 19, "net-to-gross"), { net: 100, vat: 19, gross: 119 });
});

test("MwSt brutto -> netto 19 %", () => {
  assert.deepEqual(C.vat(119, 19, "gross-to-net"), { net: 100, vat: 19, gross: 119 });
});

test("MwSt brutto -> netto 7 % rundet auf Cent", () => {
  assert.deepEqual(C.vat(10, 7, "gross-to-net"), { net: 9.35, vat: 0.65, gross: 10 });
});

test("Stundensatz", () => {
  const r = C.hourlyRate({ targetIncome: 48000, costs: 18000, weeksOff: 6, sickDays: 10, hoursPerWeek: 40, billableShare: 50 });
  assert.equal(r.workingWeeks, 44);
  assert.equal(r.billableHours, 880);
  assert.equal(r.rate, 75);
  assert.equal(r.dayRate, 600);
});

test("Stundensatz ohne abrechenbare Stunden ergibt NaN statt Infinity", () => {
  const r = C.hourlyRate({ targetIncome: 1, costs: 0, weeksOff: 0, sickDays: 0, hoursPerWeek: 0, billableShare: 50 });
  assert.ok(Number.isNaN(r.rate));
});

test("Kleinunternehmer: Grenzen 25.000 / 100.000", () => {
  assert.equal(C.smallBusiness({ previousRevenue: 25000, currentRevenue: 100000 }).eligible, true);
  assert.equal(C.smallBusiness({ previousRevenue: 25001, currentRevenue: 1000 }).eligible, false);
  assert.equal(C.smallBusiness({ previousRevenue: 1000, currentRevenue: 100001 }).eligible, false);
});

test("Kleinunternehmer: Gründungsjahr 25.000", () => {
  assert.equal(C.smallBusiness({ foundedThisYear: true, currentRevenue: 25000 }).eligible, true);
  assert.equal(C.smallBusiness({ foundedThisYear: true, currentRevenue: 25001 }).eligible, false);
});

test("Rechnungssummen", () => {
  const items = [{ qty: 2, price: 50 }, { qty: "1.5", price: "10" }, { qty: "", price: "" }];
  assert.deepEqual(C.invoiceTotals(items, 19, false), { net: 115, vat: 21.85, gross: 136.85 });
  assert.deepEqual(C.invoiceTotals(items, 19, true), { net: 115, vat: 0, gross: 115 });
});

test("Basiszinssatz-Lookup", () => {
  assert.equal(C.baseRateOn("2026-06-30"), 1.27);
  assert.equal(C.baseRateOn("2026-07-01"), 1.52);
});

test("Verzugszinsen B2B über einen Zinswechsel", () => {
  // 30 Tage zu 10,27 % (1.6.–30.6.) + 31 Tage zu 10,52 % (1.7.–31.7.)
  const r = C.defaultInterest({ amount: 1000, from: "2026-06-01", to: "2026-07-31", b2b: true });
  assert.equal(r.days, 61);
  assert.equal(r.periods.length, 2);
  assert.equal(r.interest, C.round2(1000 * 0.1027 * 30 / 365 + 1000 * 0.1052 * 31 / 365));
  assert.equal(r.fee, 40);
});

test("Verzugszinsen Verbraucher ohne Pauschale", () => {
  const r = C.defaultInterest({ amount: 365, from: "2026-07-01", to: "2026-07-10", b2b: false });
  assert.equal(r.interest, C.round2(365 * 0.0652 * 10 / 365));
  assert.equal(r.fee, 0);
});

test("Verzugszinsen: Ende vor Beginn ergibt 0", () => {
  assert.equal(C.defaultInterest({ amount: 100, from: "2026-07-10", to: "2026-07-01", b2b: true }).interest, 0);
});
