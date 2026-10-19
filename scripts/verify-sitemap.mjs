// Check the deployable artifact, not just the endpoint source. Run after npm run build.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const output = new URL("../dist/", import.meta.url);
const outputRoot = fileURLToPath(output);
const origin = "https://wxysculpture.com";
const xml = readFileSync(new URL("sitemap.xml", output), "utf8");
assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(xml, /<\/urlset>\s*$/);
assert(!/<(?:html|head|body)[\s>]/i.test(xml), "Sitemap must be XML, not the application HTML shell");
const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<\/url>/g)].map((match) => match[1]);
assert(urls.length > 0);
assert.equal(urls.length, new Set(urls).size, "Duplicate sitemap URLs");
assert.equal((xml.match(/<url>/g) ?? []).length, urls.length, "Malformed sitemap entry");
for (const value of urls) {
  const url = new URL(value);
  assert.equal(url.origin, origin, "Non-production origin in sitemap");
  assert(!url.search && !url.hash, "Query or fragment URL in sitemap");
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}
const expected = [];
for (const file of htmlFiles(outputRoot)) {
  const html = readFileSync(file, "utf8");
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue;
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert(canonical, `Public HTML is missing a canonical: ${file}`);
  const path = relative(outputRoot, file).replaceAll("\\", "/").replace(/index\.html$/, "");
  assert.equal(canonical[1], `${origin}/${path}`, `Canonical disagrees with built route: ${file}`);
  expected.push(canonical[1]);
}
assert.deepEqual([...urls].sort(), expected.sort(), "Sitemap must contain exactly the indexable built pages");
for (const path of ["/", "/works/", "/about/", "/cv/", "/contact/", "/works/somira/"]) {
  assert(urls.includes(origin + path), `Missing important public page: ${path}`);
}
const robots = readFileSync(new URL("robots.txt", output), "utf8");
assert.match(robots, /^User-agent: \*\r?\nAllow: \/$/m);
assert(!/^Disallow:\s*\S/m.test(robots), "Unexpected crawl block");
assert.match(robots, /^Sitemap: https:\/\/wxysculpture\.com\/sitemap\.xml$/m);
console.log(`Verified production artifacts: sitemap.xml (${urls.length} public URLs) and robots.txt.`);
