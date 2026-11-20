import { mkdir, readdir, readFile, copyFile, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Keep failure output generic so filesystem details cannot enter deployment logs.
process.on('uncaughtException', () => {
  console.error('Build failed. Check public configuration, simulator entry point, file permissions, asset types, and symbolic links.');
  process.exitCode = 1;
});

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'assets/site-config.js'), 'utf8'), context);
const config = context.window.TRAINING_CONFIG;
if (!/^[0-9]{4}$/.test(config?.pin) || typeof config.simulatorEnabled !== 'boolean') {
  throw new Error('Set a four-digit string PIN and boolean simulatorEnabled in assets/site-config.js.');
}
if (config.simulatorEnabled && !(await lstat(path.join(root, 'simulator/index.html')).catch(() => null))?.isFile()) {
  throw new Error('Simulator enabled, but simulator/index.html is missing or is not a regular file.');
}

const allowed = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.mp3', '.wav', '.ogg', '.mp4', '.webm', '.wasm']);
async function copyPublic(relative) {
  const source = path.join(root, relative);
  const info = await lstat(source);
  if (info.isSymbolicLink()) throw new Error('Symbolic links are not permitted in website output.');
  if (info.isDirectory()) {
    for (const entry of await readdir(source)) {
      if (entry.startsWith('.') || entry.toLowerCase() === 'readme.md') continue;
      await copyPublic(path.join(relative, entry));
    }
    return;
  }
  if (!info.isFile() || !allowed.has(path.extname(relative).toLowerCase()) || /(?:^|[\/_.-])(secrets?|credentials?)(?:[\/_.-]|$)/i.test(relative)) {
    throw new Error('Unexpected file in a public asset directory. Review the public file allowlist.');
  }
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyPublic('index.html');
await copyPublic('assets');
if (config.simulatorEnabled) await copyPublic('simulator');
await copyFile(path.join(root, '.nojekyll'), path.join(output, '.nojekyll'));
console.log(`Website built in dist/. Simulator ${config.simulatorEnabled ? 'enabled' : 'not yet supplied'}.`);
