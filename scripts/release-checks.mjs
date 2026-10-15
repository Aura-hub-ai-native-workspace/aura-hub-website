#!/usr/bin/env node
// Release checks for aura-hub-website — ZERO dependencies (node builtins only).
// Proposed repo path: scripts/release-checks.mjs (run as `node scripts/release-checks.mjs`).
// Usage here: node /tmp/aura-release-candidate/checks.mjs --root /home/Groot/aura-hub-website [--headers <path>]
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const opt = (k, dflt) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(opt('--root', join(HERE, '..')));
const HEADERS_PATH = opt('--headers', join(ROOT, 'public', '_headers'));

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const read = (p) => readFileSync(p, 'utf8');
const mustRead = (rel) => {
  const p = join(ROOT, rel);
  check(`exists: ${rel}`, existsSync(p));
  return existsSync(p) ? read(p) : '';
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e)) out.push(p);
  }
  return out;
};

// --- 1. index.html head metadata ---
const index = mustRead('index.html');
if (index) {
  check('canonical https://aurahub.website/', index.includes('<link rel="canonical" href="https://aurahub.website/" />'));
  check('og:url https://aurahub.website/', index.includes('<meta property="og:url" content="https://aurahub.website/" />'));
  const ogImg = index.match(/<meta property="og:image" content="([^"]+)" \/>/);
  check('og:image absolute https + .png', !!ogImg && ogImg[1].startsWith('https://aurahub.website/') && ogImg[1].endsWith('.png'), ogImg ? ogImg[1] : 'missing');
  const twImg = index.match(/<meta name="twitter:image" content="([^"]+)" \/>/);
  check('twitter:image absolute https + .png', !!twImg && twImg[1].startsWith('https://aurahub.website/') && twImg[1].endsWith('.png'), twImg ? twImg[1] : 'missing');
  check('meta description present', /<meta name="description" content="[^"]{20,}"/.test(index));
  check('theme-color present', index.includes('name="theme-color"'));
  check('twitter:card summary_large_image', index.includes('name="twitter:card" content="summary_large_image"'));
  const ld = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let ldOk = false, ldDetail = 'missing';
  if (ld) {
    try {
      const data = JSON.parse(ld[1]);
      ldOk = data['@context'] === 'https://schema.org' && data.url === 'https://aurahub.website/';
      ldDetail = ldOk ? data['@type'] : 'url/context mismatch';
    } catch (e) { ldDetail = `invalid JSON: ${e.message}`; }
  }
  check('JSON-LD valid, url=https://aurahub.website/', ldOk, ldDetail);
  check('noscript fallback present', index.includes('<noscript>'));
  check('no stale is-a.dev references', !index.includes('is-a.dev'), index.includes('is-a.dev') ? 'FOUND stale domain' : '');
}

// --- 2. robots.txt / sitemap.xml ---
const robots = mustRead('public/robots.txt');
if (robots) {
  check('robots Allow: /', /^Allow: \/$/m.test(robots));
  check('robots Sitemap aurahub.website', robots.includes('Sitemap: https://aurahub.website/sitemap.xml'));
  check('robots no stale is-a.dev', !robots.includes('is-a.dev'));
}
const sitemap = mustRead('public/sitemap.xml');
if (sitemap) {
  check('sitemap urlset', sitemap.includes('<urlset'));
  check('sitemap loc https://aurahub.website/', sitemap.includes('<loc>https://aurahub.website/</loc>'));
  check('sitemap no stale is-a.dev', !sitemap.includes('is-a.dev'));
}

// --- 3. 404 page ---
const notFound = mustRead('public/404.html');
if (notFound) {
  check('404 noindex', notFound.includes('<meta name="robots" content="noindex" />'));
  check('404 links home', notFound.includes('href="/"'));
  check('404 favicon /brand/', notFound.includes('href="/brand/aura-logo.png"'));
}

// --- 4. asset references resolve under public/ ---
const refRe = /["'`](\/(?:brand|screenshots)\/[A-Za-z0-9._\-/]+)["'`]/g;
const refs = new Set();
for (const f of walk(join(ROOT, 'src'))) {
  const t = read(f);
  let m; refRe.lastIndex = 0;
  while ((m = refRe.exec(t))) refs.add(m[1]);
}
for (const f of ['index.html']) {
  const t = mustRead(f);
  let m; refRe.lastIndex = 0;
  while ((m = refRe.exec(t))) refs.add(m[1]);
}
check('asset refs found to verify', refs.size > 0, `${refs.size} refs`);
let missing = [];
for (const r of [...refs].sort()) {
  if (!existsSync(join(ROOT, 'public', r.slice(1)))) missing.push(r);
}
check('all /brand|/screenshots refs exist in public/', missing.length === 0, missing.length ? `MISSING: ${missing.join(', ')}` : `${refs.size} refs OK`);

// --- 5. no stale old-layout asset refs ---
let stale = [];
for (const f of [...walk(join(ROOT, 'src')), join(ROOT, 'index.html')]) {
  const t = read(f);
  if (t.includes('assets/brand') || t.includes('assets/screenshots')) stale.push(f.replace(ROOT + '/', ''));
}
check('no stale assets/brand|assets/screenshots refs', stale.length === 0, stale.length ? stale.join(', ') : '');

// --- 6. internal anchors resolve ---
const ids = new Set();
const anchors = new Set();
for (const f of walk(join(ROOT, 'src'))) {
  const t = read(f);
  for (const m of t.matchAll(/id=(["'])([A-Za-z][A-Za-z0-9_-]*)\1/g)) ids.add(m[2]);
  for (const m of t.matchAll(/href\s*[:=]\s*(["'])#([A-Za-z][A-Za-z0-9_-]*)\1/g)) anchors.add(m[2]);
}
const dangling = [...anchors].filter((a) => !ids.has(a));
check('internal anchors resolve', dangling.length === 0, anchors.size ? `anchors: ${[...anchors].sort().join(', ')}${dangling.length ? ` DANGLING: ${dangling.join(', ')}` : ''}` : 'no anchors');

// --- 7. _headers: security intact + immutable caching incl. /brand + /screenshots ---
if (existsSync(HEADERS_PATH)) {
  const h = read(HEADERS_PATH);
  check('_headers X-Content-Type-Options nosniff', h.includes('X-Content-Type-Options: nosniff'));
  check('_headers X-Frame-Options DENY', h.includes('X-Frame-Options: DENY'));
  check('_headers Referrer-Policy', h.includes('Referrer-Policy: strict-origin-when-cross-origin'));
  check('_headers Permissions-Policy', h.includes('Permissions-Policy:'));
  const block = (prefix) => new RegExp(`${prefix.replace(/[*/]/g, (c) => `\\${c}`)}\\s*\\n\\s*Cache-Control: public, max-age=31536000, immutable`).test(h);
  check('_headers /assets/* immutable', block('/assets/*'));
  check('_headers /brand/* immutable', block('/brand/*'));
  check('_headers /screenshots/* immutable', block('/screenshots/*'));
  check('_headers /*.html must-revalidate', /\/\*\.html\s*\n\s*Cache-Control: public, max-age=0, must-revalidate/.test(h));
} else {
  check(`_headers exists at ${HEADERS_PATH}`, false);
}

console.log(failures === 0 ? `\nALL ${'CHECKS'} PASSED` : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
