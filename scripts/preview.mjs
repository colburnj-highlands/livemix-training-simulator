import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../dist/', import.meta.url))).catch(() => {
  throw new Error('Run npm run build before previewing.');
});
const prefix = '/livemix-training-simulator/';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };
createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === prefix.slice(0, -1)) {
      response.writeHead(301, { Location: prefix });
      return response.end();
    }
    if (pathname.startsWith(prefix)) pathname = pathname.slice(prefix.length);
    let target = path.resolve(root, `.${pathname.startsWith('/') ? pathname : `/${pathname}`}`);
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    target = await realpath(target);
    if (!target.startsWith(root + path.sep)) throw new Error('Outside preview');
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Page not found');
  }
}).listen(4173, '127.0.0.1', () => {
  console.log('Local: http://127.0.0.1:4173/');
  console.log(`Repository subpath: http://127.0.0.1:4173${prefix}`);
});
