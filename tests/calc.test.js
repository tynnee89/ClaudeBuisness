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
