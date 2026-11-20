#!/usr/bin/env node
/*
 * 訂閱泡泡 · 本機伺服器
 * - 提供網頁檔案，並把資料存成本機 JSON 檔（data/state.json），讓所有連線的裝置共用同一份資料
 * - 預設只綁定 127.0.0.1，由 Tailscale Serve 轉發給 tailnet 內的裝置；不需任何 npm 套件
 *
 *   PORT=5178 HOST=127.0.0.1 DATA_DIR=./data node server.js
 */
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const ROOT = __dirname;
const PORT = +(process.env.PORT || 5178);
const HOST = process.env.HOST || '127.0.0.1';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BODY = 8 * 1024 * 1024;      // 自訂 LOGO 以 dataURL 存放，預留空間
const KEEP_BACKUPS = 60;

// 只對外提供這些網頁檔案（避免把 data/、.git、伺服器原始碼送出去）
const PUBLIC = [/^\/$/, /^\/index\.html$/, /^\/sw\.js$/, /^\/manifest\.webmanifest$/, /^\/icon(-maskable)?\.svg$/,
  /^\/css\/[\w.-]+\.css$/, /^\/js\/[\w.-]+\.js$/, /^\/icons\/(brands\/)?[\w.-]+\.(png|svg)$/];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };

fs.mkdirSync(BACKUP_DIR, { recursive: true });

/* ---------- 資料存取：rev 遞增版本號，寫入用暫存檔 + rename 確保不會寫壞 ---------- */
let current = { rev: 0, updatedAt: null, state: null };
try { current = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { /* 首次啟動 */ }
let writing = Promise.resolve();

async function persist(next, who) {
  const tmp = STATE_FILE + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(next, null, 1));
  await fsp.rename(tmp, STATE_FILE);
  // 每小時最多一份備份
  const stamp = new Date().toISOString().slice(0, 13).replace(/[-:T]/g, '');
  const bk = path.join(BACKUP_DIR, `state-${stamp}.json`);
  if (!fs.existsSync(bk)) {
    await fsp.copyFile(STATE_FILE, bk);
    const all = (await fsp.readdir(BACKUP_DIR)).filter(f => f.startsWith('state-')).sort();
    for (const f of all.slice(0, Math.max(0, all.length - KEEP_BACKUPS))) await fsp.unlink(path.join(BACKUP_DIR, f));
  }
  log(`saved rev ${next.rev} (${next.state?.subs?.length ?? 0} items) by ${who}`);
}

/* ---------- HTTP ---------- */
const log = (...a) => console.log(new Date().toLocaleString('zh-TW', { hour12: false }), ...a);
const send = (res, code, body, type = 'application/json; charset=utf-8', extra = {}) => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const who = req => req.headers['tailscale-user-login'] || req.socket.remoteAddress;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function api(req, res, url) {
  if (url.pathname !== '/api/state') return send(res, 404, { error: 'not found' });
  if (req.method === 'GET') return send(res, 200, current);
  if (req.method !== 'PUT') return send(res, 405, { error: 'method not allowed' });
  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return send(res, e.code || 400, { error: e.code === 413 ? 'too large' : 'bad json' }); }
  if (!body || typeof body.state !== 'object' || !Array.isArray(body.state?.subs)) return send(res, 400, { error: 'invalid state' });
  // 樂觀鎖：其他裝置已更新過時回 409，前端會改用伺服器上的新版本
  if (body.baseRev !== current.rev) return send(res, 409, current);
  const next = { rev: current.rev + 1, updatedAt: new Date().toISOString(), state: body.state };
  current = next;
  writing = writing.then(() => persist(next, who(req))).catch(e => log('write failed:', e.message));
  await writing;
  return send(res, 200, { rev: next.rev, updatedAt: next.updatedAt });
}

async function serveFile(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (!PUBLIC.some(r => r.test(p))) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  try {
    const data = await fsp.readFile(file);
    const ext = path.extname(file);
    send(res, 200, data, TYPES[ext] || 'application/octet-stream', { 'cache-control': ext === '.png' ? 'public, max-age=86400' : 'no-cache' });
  } catch { send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain');
    return await serveFile(req, res, url);
  } catch (e) { log('error', e); send(res, 500, { error: 'server error' }); }
});

server.listen(PORT, HOST, () => {
  log(`訂閱泡泡 running at http://${HOST}:${PORT}`);
  log(`data file: ${STATE_FILE} (rev ${current.rev})`);
});
