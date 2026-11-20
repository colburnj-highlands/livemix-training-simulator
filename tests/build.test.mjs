import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, readdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const build = (directory) => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: directory, encoding: 'utf8' });
async function files(directory, prefix = '') {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(prefix, item.name);
    if (item.isDirectory()) result.push(...await files(path.join(directory, item.name), name));
    else result.push(name);
  }
  return result.sort();
}

test('isolated build respects publication boundaries and relative links', async () => {
  const isolated = await mkdtemp(path.join(tmpdir(), 'training-site-'));
  try {
    for (const name of ['index.html', 'assets', 'scripts', 'simulator', '.nojekyll']) {
      await cp(path.join(root, name), path.join(isolated, name), { recursive: true });
    }
    await writeFile(path.join(isolated, '.env'), 'EXAMPLE=never-publish\n');
    await writeFile(path.join(isolated, 'README.md'), 'Development-only documentation');
    await writeFile(path.join(isolated, 'assets/.local-settings'), 'Local only');
    let result = build(isolated);
    assert.equal(result.status, 0, 'Standalone build must succeed');
    const output = path.join(isolated, 'dist');
    const published = await files(output);
    for (const item of ['index.html', 'simulator/index.html', 'assets/site.css', 'assets/site.js', 'assets/site-config.js', 'assets/branding/highlands-logo.svg', '.nojekyll']) assert.ok(published.includes(item));
    assert.deepEqual(published.filter(item => item.endsWith('.html')), ['index.html', 'simulator/index.html']);
    assert.ok(published.every(item => item === 'index.html' || item === '.nojekyll' || item.startsWith('assets/') || item === 'simulator/index.html'));
    assert.ok(published.every(item => !item.includes('README') && !item.includes('.local-settings')));
    const html = await readFile(path.join(output, 'index.html'), 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (url.startsWith('#')) assert.ok(ids.has(url.slice(1)), 'Anchor must exist');
      else {
        assert.ok(url.startsWith('./'), 'Page assets must use relative URLs');
        for (const base of ['https://example.test/', 'https://example.test/repository/']) {
          const resolved = new URL(url, base);
          assert.ok(resolved.href.startsWith(base));
          assert.ok(published.includes(decodeURIComponent(resolved.href.slice(base.length))), 'Linked asset must be published');
        }
      }
    }
    assert.match(html, /Unlock simulator/);
    assert.doesNotMatch(html, /id="site"|id="training"|id="launch"/);
    assert.doesNotMatch(html, /(?:src|href)="(?:https?:)?\/\//);
    await rm(path.join(isolated, 'simulator/index.html'), { force: true });
    assert.notEqual(build(isolated).status, 0, 'Missing simulator must fail');
    await mkdir(path.join(isolated, 'simulator'), { recursive: true });
    await writeFile(path.join(isolated, 'simulator/index.html'), '<!doctype html><title>Test delivery</title>');
    result = build(isolated);
    assert.equal(result.status, 0);
    assert.ok((await files(output)).includes('simulator/index.html'));
    assert.ok(!(await files(output)).includes('simulator/README.md'));
    await writeFile(path.join(isolated, 'assets/private.key'), 'test fixture');
    assert.notEqual(build(isolated).status, 0, 'Unapproved asset types must fail');
    await rm(path.join(isolated, 'assets/private.key'));
    await symlink(path.join(isolated, '.env'), path.join(isolated, 'assets/linked.json'));
    assert.notEqual(build(isolated).status, 0, 'Symlinks must fail');
  } finally {
    await rm(isolated, { recursive: true, force: true });
  }
});

test('supplied simulator has self-contained assets and valid inline JavaScript', async () => {
  const html = await readFile(path.join(root, 'simulator/index.html'), 'utf8');
  for (const [, url] of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)/gi)) {
    assert.ok(url.startsWith('data:') || url.startsWith('#') || url === '../index.html', 'Simulator must not depend on external files');
  }
  assert.doesNotMatch(html, /(?:fetch|XMLHttpRequest|WebSocket|importScripts|sendBeacon)\s*\(/);
  assert.doesNotMatch(html, /file:\/\/|\/Users\/|BEGIN [A-Z ]*PRIVATE KEY/);
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0);
  for (const [, script] of scripts) {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: script, encoding: 'utf8' });
    assert.equal(result.status, 0, 'Embedded application JavaScript must parse');
  }
});
