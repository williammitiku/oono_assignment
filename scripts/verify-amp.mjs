#!/usr/bin/env node
/**
 * Verifies that /api/amp-story/[slug] returns valid AMP Story HTML.
 * Usage: Start the app (npm run dev), then:
 *   node scripts/verify-amp.mjs
 *   node scripts/verify-amp.mjs https://localhost:3000 nov-25 "COLLECTION_CODE-collection-slug"
 */
const base = process.env.BASE_URL || "http://localhost:3000";
const slug = process.argv[2] || "nov-25";
const c = process.argv[3];

async function main() {
  if (!c) {
    console.log("Usage: node scripts/verify-amp.mjs [baseUrl] [slug] <c>");
    console.log("  Example: node scripts/verify-amp.mjs http://localhost:3000 nov-25 \"abc123-my-collection\"");
    console.log("  Get a valid 'c' from the app: open a collection, copy the 'c' query param from the URL.");
    process.exit(1);
  }

  const url = `${base}/api/amp-story/${slug}?${new URLSearchParams({ c, story: "1" }).toString()}`;
  const res = await fetch(url);
  const html = await res.text();
  if (!res.ok) {
    console.error("Request failed:", res.status, html.slice(0, 200));
    process.exit(1);
  }

  const checks = [
    ["DOCTYPE html", /<!DOCTYPE\s+html>/i],
    ["AMP root (⚡ or amp)", /<html[^>]*\s(⚡|amp)\b/],
    ["lang attribute", /<html[^>]*\blang=/],
    ["amp-story script", /amp-story-1\.0\.js/],
    ["v0.js", /cdn\.ampproject\.org\/v0\.js/],
    ["amp-story element", /<amp-story\b/],
    ["amp-story-page", /<amp-story-page\b/],
  ];

  let failed = 0;
  for (const [name, re] of checks) {
    const ok = re.test(html);
    console.log(ok ? "✓" : "✗", name);
    if (!ok) failed++;
  }

  if (failed > 0) {
    console.log("\nAMP verification failed:", failed, "check(s) failed.");
    process.exit(1);
  }
  console.log("\nAMP structure verified. For full validation, open the story in the app and check the browser console for \"AMP validation successful.\" (Dev mode uses #development=1)");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
