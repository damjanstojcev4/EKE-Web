import http from 'node:http';
import https from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
// Optional local development proxy. Hosted staging uses Nginx, not this server.
const backend = process.env.API_PROXY_TARGET ? new URL(process.env.API_PROXY_TARGET) : null;
if (backend && (!['http:', 'https:'].includes(backend.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(backend.hostname) || backend.username || backend.password || backend.pathname !== '/' || backend.search || backend.hash)) {
  throw new Error('API_PROXY_TARGET must be a loopback HTTP(S) origin.');
}
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.ttf':'font/ttf', '.txt':'text/plain', '.json':'application/json', '.pdf':'application/pdf' };
const server = http.createServer(async (req,res) => {
  if (req.url?.startsWith('/api/')) {
    if (!backend) {
      res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify({ message: 'Configure API_PROXY_TARGET to connect the local backend.' }));
      return;
    }
    const transport = backend.protocol === 'https:' ? https : http;
    const upstream = transport.request({ hostname: backend.hostname, port: backend.port, method: req.method, path: req.url, headers: { ...req.headers, host: req.headers.host || backend.host } }, response => {
      res.writeHead(response.statusCode || 502, { ...response.headers, 'cache-control': 'no-store' });
      response.pipe(res);
    });
    upstream.setTimeout(30000, () => upstream.destroy(new Error('Backend request timed out')));
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502, { 'Content-Type':'application/json', 'Cache-Control':'no-store' });
      res.end(JSON.stringify({ message: 'The local backend is unavailable.' }));
    });
    req.on('aborted', () => upstream.destroy());
    req.pipe(upstream);
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/html' }).end(await readFile(path.join(root,'404.html')).catch(()=>'Not found'));
  }
});
server.listen(Number(process.env.PORT || 3100), '127.0.0.1', () => console.log('Static preview: http://127.0.0.1:' + server.address().port));
