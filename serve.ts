// Leonida Trophy Guide — tiny static file server for local use only.
// Serves app/ at http://localhost:8080 (or $PORT). No build step, no network.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('app', import.meta.url)));
const port = Number(process.env.PORT ?? 8080);

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const rawPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const safe = normalize(join(root, rawPath === '/' ? 'index.html' : rawPath));
  if (!safe.startsWith(root) || !existsSync(safe) || !statSync(safe).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found\n');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(safe)] ?? 'application/octet-stream' });
  createReadStream(safe).pipe(res);
});

server.listen(port, () => {
  console.log('Leonida Trophy Guide at http://localhost:' + port);
});
