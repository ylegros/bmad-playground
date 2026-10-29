import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SnapshotService } from './service.ts';
import { DataError } from './jolpica.ts';

export function makeServer(service = new SnapshotService()) {
  return createServer(async (req, res) => {
    const send = (status: number, body: unknown) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (url.pathname === '/api/v1/seasons' && req.method === 'GET') { send(200, { data: await service.manifest() }); return; }
      const match = /^\/api\/v1\/seasons\/(\d{4})(\/refresh)?$/.exec(url.pathname);
      if (match && ((req.method === 'GET' && !match[2]) || (req.method === 'POST' && match[2]))) { send(200, { data: await service.get(Number(match[1]), !!match[2]) }); return; }
      if (url.pathname.startsWith('/api/')) { send(404, { error: { code: 'NOT_FOUND', message: 'API route not found.' } }); return; }
      if (req.method !== 'GET' && req.method !== 'HEAD') { send(405, { error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }); return; }
      const base = resolve('dist'); let file = resolve(base, '.' + decodeURIComponent(url.pathname));
      if (file !== base && !file.startsWith(base + sep)) { send(403, { error: { code: 'FORBIDDEN', message: 'Invalid path.' } }); return; }
      try { if (!(await stat(file)).isFile()) file = resolve(base, 'index.html'); } catch { file = resolve(base, 'index.html'); }
      const content = await readFile(file);
      const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
      res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' }); res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      const known = error instanceof DataError;
      send(known ? error.status : 500, { error: { code: known ? error.code : 'INTERNAL_ERROR', message: known ? error.message : 'The local server could not complete the request.' } });
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT ?? 3001);
  makeServer().listen(port, '127.0.0.1', () => console.info(`Pit Wall API listening on http://127.0.0.1:${port}`));
}
