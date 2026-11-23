// 把上層的網頁檔複製到 www/（純離線版：不含任何伺服器網址，資料只存在手機）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, '..');
const web = path.resolve(app, '..');
const www = path.join(app, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });
for (const d of ['css', 'js', 'icons']) fs.cpSync(path.join(web, d), path.join(www, d), { recursive: true });
for (const f of ['icon.svg', 'icon-maskable.svg']) fs.copyFileSync(path.join(web, f), path.join(www, f));

let html = fs.readFileSync(path.join(web, 'index.html'), 'utf8');
html = html.replace(/\s*<link rel="manifest"[^>]*>/, ''); // App 不需要 PWA manifest
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('www/ ready (offline build)');
