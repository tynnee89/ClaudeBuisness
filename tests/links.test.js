// Prüft, dass alle lokalen Links/Skripte/Styles in den HTML-Seiten existieren.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "docs");
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html") && f !== "404.html") pages.push(p);
  }
})(root);

for (const page of pages) {
  test(`Links in ${path.relative(root, page)}`, () => {
    const html = fs.readFileSync(page, "utf8");
    const refs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map((m) => m[1])
      .filter((r) => !/^(https?:|mailto:|data:)/.test(r));
    for (const ref of refs) {
      let target = path.resolve(path.dirname(page), ref);
      if (ref.endsWith("/")) target = path.join(target, "index.html");
      assert.ok(fs.existsSync(target), `${ref} fehlt`);
    }
    assert.match(html, /<title>[^<]+<\/title>/);
  });
}
