'use strict';
/* ============ 訂閱泡泡 · app.js ============ */

const KEY = 'subble.v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- 圖示 ---------- */
const ICONS = {
  search: '<path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
  add: '<path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/>',
  add_circle: '<path d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4zm1 5q-2.08 0-3.9-.79-1.83-.79-3.18-2.13T2.79 15.9Q2 14.08 2 12t.79-3.9q.79-1.83 2.13-3.18T8.1 2.79Q9.93 2 12 2t3.9.79q1.83.79 3.18 2.13t2.13 3.18Q22 9.93 22 12t-.79 3.9q-.79 1.83-2.13 3.18t-3.18 2.13Q14.08 22 12 22zm0-2q3.35 0 5.68-2.33T20 12t-2.33-5.68T12 4 6.33 6.33 4 12t2.33 5.68T12 20z"/>',
  bubbles: '<circle cx="8.5" cy="14.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="7.5" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18.5" cy="17.5" r="2" />',
  insights: '<path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>',
  settings: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>',
  check: '<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
  close: '<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
  edit: '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/>',
  delete: '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>',
  pause: '<path d="M6 19h4V5H6zm8-14v14h4V5z"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  upload: '<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>',
  download: '<path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z"/>',
  bell: '<path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"/>',
  tip: '<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>',
  restart: '<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>',
  grid: '<path d="M4 11h7V4H4zm0 9h7v-7H4zm9 0h7v-7h-7zm0-16v7h7V4z"/>',
  // 底部導覽：線條圖示（部分路徑改寫自 Lucide，ISC License）
  nav_bubbles: '<g class="ln"><circle cx="8.5" cy="14.5" r="5.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="18.5" cy="17.8" r="2"/></g>',
  nav_calendar: '<g class="ln"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></g>',
  nav_chart: '<g class="ln"><path d="M21 12c.55 0 1-.45.95-1A10 10 0 0 0 13 2.05c-.55-.05-1 .4-1 .95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/></g>',
  nav_settings: '<g class="ln"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></g>',
  nav_plus: '<g class="ln"><path d="M12 5v14M5 12h14"/></g>',
  back: '<g class="ln"><path d="M15 18l-6-6 6-6"/></g>',
  chev_l: '<g class="ln"><path d="M15 18l-6-6 6-6"/></g>',
  chev_r: '<g class="ln"><path d="M9 18l6-6-6-6"/></g>',
};
const ico = n => `<span class="ico"><svg viewBox="0 0 24 24">${ICONS[n] || ''}</svg></span>`;
function hydrateIcons(root = document) { $$('[data-ico]', root).forEach(el => { el.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[el.dataset.ico]}</svg>`; el.removeAttribute('data-ico'); }); }

/* ---------- 狀態 ---------- */
const DEFAULT_SETTINGS = { usdRate: 32.5, budget: 2000, remindDays: 3, theme: 'system', tint: true, shake: true, period: 'month', group: 'all', onboarded: false, lastNotify: '' };
let state = load();
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.subs)) return { subs: s.subs, settings: { ...DEFAULT_SETTINGS, ...s.settings } };
  } catch (e) {}
  return { subs: [], settings: { ...DEFAULT_SETTINGS } };
}
/* ---------- 本機伺服器同步 ----------
 * 資料以主機電腦上的 data/state.json 為準（server.js），所有連線裝置共用；
 * 瀏覽器 localStorage 只當快取，離線時先存著，恢復連線後再上傳。
 * 每次寫入帶上 baseRev，若其他裝置已先更新（409）就改用伺服器版本。 */
const store = {
  get: (k, d = null) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
};
// Android App（Capacitor）：純離線版，資料只存在手機的原生儲存（Capacitor Preferences），不連任何伺服器
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const Prefs = () => NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences;
const apiUrl = () => 'api/state';
const sync = { mode: 'local', rev: +store.get(KEY + '.rev', 0), at: store.get(KEY + '.at'), dirty: store.get(KEY + '.dirty') === '1', timer: 0, busy: false };
const normalize = s => ({ subs: Array.isArray(s?.subs) ? s.subs : [], settings: { ...DEFAULT_SETTINGS, ...(s?.settings || {}) } });
function save() {
  store.set(KEY, JSON.stringify(state));
  if (NATIVE) { const p = Prefs(); if (p) p.set({ key: KEY, value: JSON.stringify(state) }).catch(() => {}); return; }
  if (sync.mode === 'local') return;
  sync.dirty = true; store.set(KEY + '.dirty', '1');
  clearTimeout(sync.timer); sync.timer = setTimeout(push, 350);
}
function markSynced(rev, at) {
  Object.assign(sync, { rev, at, dirty: false, mode: 'server' });
  store.set(KEY + '.rev', String(rev)); store.set(KEY + '.at', at); store.set(KEY + '.dirty', null);
  updateSyncUi();
}
function adopt(remote, msg) {
  state = normalize(remote.state); store.set(KEY, JSON.stringify(state));
  markSynced(remote.rev, remote.updatedAt);
  if (pool) render();
  if (msg) snack(msg);
}
async function push() {
  if (NATIVE) return;
  if (sync.busy) { clearTimeout(sync.timer); sync.timer = setTimeout(push, 300); return; }
  sync.busy = true;
  try {
    const r = await fetch(apiUrl(), { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ baseRev: sync.rev, state }) });
    if (r.status === 409) adopt(await r.json(), '其他裝置剛更新過資料，已載入最新版本');
    else if (r.ok) { const j = await r.json(); markSynced(j.rev, j.updatedAt); }
    else throw new Error(r.status);
  } catch (e) { sync.mode = 'offline'; updateSyncUi(); }
  sync.busy = false;
}
async function pull() {
  if (NATIVE) return;
  if (sheetOpen || sync.busy) return; // 編輯中不打斷
  let remote;
  try { const r = await fetch(apiUrl(), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); remote = await r.json(); }
  catch (e) { if (sync.mode !== 'local') { sync.mode = 'offline'; updateSyncUi(); } return; }
  if (!remote.state) { // 主機上還沒有資料：把這台裝置現有的資料搬上去
    sync.mode = 'server'; sync.rev = remote.rev;
    if (state.subs.length || S().onboarded) await push(); else updateSyncUi();
    return;
  }
  if (sync.dirty && remote.rev === sync.rev) { sync.mode = 'server'; return push(); } // 離線時的變更，主機沒被別人改過 → 上傳
  if (remote.rev !== sync.rev) adopt(remote, sync.dirty ? '離線期間其他裝置也改過資料，已改用主機上的版本' : sync.mode === 'server' ? '已同步其他裝置的變更' : '');
  else { sync.mode = 'server'; updateSyncUi(); }
}
function syncText() {
  const t = sync.at ? new Date(sync.at).toLocaleString('zh-TW', { hour12: false, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  return sync.mode === 'server' ? `已連線主機 · 資料存在主機電腦，所有裝置共用 · 最後更新 ${t}`
    : sync.mode === 'device' ? '離線版：資料只存在這支手機，不會連到任何伺服器。換手機或重灌前請先「匯出備份」'
    : sync.mode === 'offline' ? '暫時連不到主機，變更先存在這台裝置，恢復連線後自動上傳'
    : '未連到主機伺服器，資料只存在這台裝置的瀏覽器';
}
if (NATIVE) sync.mode = 'device';
// 讀取手機原生儲存；1.0 版存在 WebView 的資料會在第一次開啟時搬過來
async function loadNative() {
  const p = Prefs(); if (!p) return;
  try {
    const { value } = await p.get({ key: KEY });
    if (value) {
      const s = normalize(JSON.parse(value));
      if (JSON.stringify(s) !== JSON.stringify(state)) { state = s; store.set(KEY, value); if (pool) render(); }
    } else if (state.subs.length || S().onboarded) await p.set({ key: KEY, value: JSON.stringify(state) });
    for (const k of ['.host', '.rev', '.at', '.dirty']) store.set(KEY + k, null); // 清掉 1.0 版的同步紀錄
  } catch (e) {}
}
function updateSyncUi() { const el = $('#syncStatus'); if (el) { el.textContent = syncText(); el.dataset.mode = sync.mode; } }
const S = () => state.settings;
const svc = id => SERVICES.find(s => s.id === id);
const catName = id => id === 'inst' ? '信用卡分期' : (CATS.find(c => c.id === id) || { name: '其他' }).name;

/* ---------- 日期 ---------- */
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const parseD = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const fmtD = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const WD = '日一二三四五六';
const md = d => `${d.getMonth() + 1}/${d.getDate()}`;
function addCycle(a, cycle, k) {
  if (cycle === 'week') return new Date(a.getFullYear(), a.getMonth(), a.getDate() + 7 * k);
  const m = a.getMonth() + (cycle === 'year' ? 12 * k : k);
  const last = new Date(a.getFullYear(), m + 1, 0).getDate();
  return new Date(a.getFullYear(), m, Math.min(a.getDate(), last));
}
function billDates(sub, from, to) { // 回傳 [from, to] 間的扣款日
  const out = [];
  if (sub.paused || sub.paidOff) return out;
  let a = parseD(sub.start);
  if (sub.trial && sub.trialEnd) { const te = parseD(sub.trialEnd); if (te >= from) a = te; }
  const maxK = isInst(sub) ? sub.periods : 2000;
  for (let k = 0; k < maxK; k++) {
    const d = addCycle(a, sub.cycle, k);
    if (d > to) break;
    if (d >= from) out.push(d);
  }
  return out;
}
function nextBill(sub) {
  const t = today();
  const far = new Date(t.getFullYear() + 2, t.getMonth(), t.getDate());
  return billDates(sub, t, far)[0] || null;
}
const daysTo = d => Math.round((d - today()) / 864e5);
const dueText = n => n === 0 ? '今天' : n === 1 ? '明天' : `${n} 天後`;

/* ---------- 金額 ---------- */
const CYCLE = { month: '月', year: '年', week: '週' };
const rate = cur => cur === 'USD' ? S().usdRate : 1;
const perCharge = sub => sub.price * rate(sub.cur) / Math.max(1, sub.split || 1);
const monthly = sub => sub.paused || instDone(sub) ? 0 : perCharge(sub) * (sub.cycle === 'year' ? 1 / 12 : sub.cycle === 'week' ? 52 / 12 : 1);
// 一年內實際會付的金額：分期只算到最後一期
const yearly = sub => isInst(sub) ? (instDone(sub) ? 0 : sub.price * Math.min(12, instLeft(sub))) : monthly(sub) * 12;
const money = n => 'NT$ ' + Math.round(n).toLocaleString('zh-TW');
const short = n => n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : Math.round(n).toLocaleString('zh-TW');
const totalMonthly = () => state.subs.reduce((a, s) => a + monthly(s), 0);
const totalYearly = () => state.subs.reduce((a, s) => a + yearly(s), 0);

/* ---------- 信用卡分期 ---------- */
// 分期：{ type:'inst', name, icon, color, total, periods, price(每期), start(第一期扣款日), card, cycle:'month', cat:'inst' }
const INST_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];
const isInst = s => s.type === 'inst';
function instPaid(s) { // 已扣款期數（扣款日 ≤ 今天）；提前清償視為全部繳完
  if (s.paidOff) return s.periods;
  const a = parseD(s.start), t = today(); let k = 0;
  while (k < s.periods && addCycle(a, 'month', k) <= t) k++;
  return k;
}
const instLeft = s => s.periods - instPaid(s);
const instDone = s => isInst(s) && instPaid(s) >= s.periods;
const instEnd = s => addCycle(parseD(s.start), 'month', s.periods - 1);
const instNo = (s, d) => { const a = parseD(s.start); return (d.getFullYear() - a.getFullYear()) * 12 + d.getMonth() - a.getMonth() + 1; };
const ym = d => `${d.getFullYear()}/${d.getMonth() + 1}`;
// 由總價、每期金額、期數反推實質年利率（%）
function instApr(total, per, n) {
  if (!(total > 0) || per * n <= total + 1) return 0;
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2, pv = per * (1 - (1 + m) ** -n) / m; pv > total ? lo = m : hi = m; }
  return lo * 1200;
}
// 每期四捨五入造成的差額（每期 ≤ 1 元）不算手續費
const feeOf = (total, per, n) => { const f = per * n - (total || per * n); return f > n ? f : 0; };
const instFee = s => feeOf(s.total, s.price, s.periods);
const planPrice = p => p.cur === 'USD' ? `US$ ${p.price}` : money(p.price);

/* ---------- 顏色 ---------- */
function hexRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
const rgbHex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
function lum(hex) { const c = hexRgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
function rgbHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s * 100, l * 100];
}
const hexHsl = h => rgbHsl(...hexRgb(h));
const darkText = sub => { const c2 = sub.color2 || sub.color; return (lum(sub.color) + lum(c2)) / 2 > 0.5; };
const fill = sub => sub.color2 ? `linear-gradient(135deg, ${sub.color} 15%, ${sub.color2})` : sub.color;
const deep = sub => lum(sub.color) < 0.03;
// LOGO：自訂上傳 > 內建品牌 PNG（glyph = 白色單色向量，tile = 官方全彩 App 圖示）
function logoOf(x) {
  if (x.logo) return { src: x.logo, kind: 'tile' };
  const id = x.serviceId || (svc(x.id) === x ? x.id : null);
  return id && svc(id) ? { src: `icons/brands/${id}.png`, kind: LOGO_GLYPH.has(id) ? 'glyph' : 'tile' } : null;
}
const logoImg = (x, extra = '') => { const l = logoOf(x); return l ? `<img class="lg ${l.kind}" src="${l.src}" alt="" draggable="false" loading="lazy"${extra}>` : ''; };
const avatar = (s, cls = 'av', after = '') => `<span class="${cls}${darkText(s) ? ' dark-text' : ''}${deep(s) ? ' deep' : ''}" style="background:${fill(s)}">${isInst(s) ? instSvg(s.icon) : logoImg(s) || esc(s.mono || s.name.slice(0, 2))}${after}</span>`;

// 從 LOGO 圖片萃取品牌主色（排除透明、近白、近黑與低飽和像素，以「數量 × 飽和度」加權）
function extractColors(img) {
  const N = 64, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, N, N);
  const px = ctx.getImageData(0, 0, N, N).data, buckets = new Map(); let fallback = new Map();
  for (let i = 0; i < px.length; i += 4) {
    const [r, g, b, a] = [px[i], px[i + 1], px[i + 2], px[i + 3]];
    if (a < 128) continue;
    const [h, s, l] = rgbHsl(r, g, b);
    const key = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
    const tgt = (s < 18 || l > 94 || l < 6) ? fallback : buckets;
    const e = tgt.get(key) || { n: 0, r: 0, g: 0, b: 0, h, s };
    e.n++; e.r += r; e.g += g; e.b += b; tgt.set(key, e);
  }
  const src = buckets.size ? buckets : fallback;
  const ranked = [...src.values()].map(e => ({ hex: rgbHex(e.r / e.n, e.g / e.n, e.b / e.n), h: e.h, w: e.n * (0.4 + e.s / 100) })).sort((a, b) => b.w - a.w);
  if (!ranked.length) return { color: '#777777' };
  const main = ranked[0];
  const second = ranked.find(c => Math.min(Math.abs(c.h - main.h), 360 - Math.abs(c.h - main.h)) > 40 && c.w > main.w * 0.25);
  return { color: main.hex, color2: second ? second.hex : undefined };
}

/* ---------- 主題：依最貴訂閱的品牌色著色 (Material You 風格) ---------- */
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const mode = S().theme === 'system' ? (mq.matches ? 'dark' : 'light') : S().theme;
  document.documentElement.dataset.theme = mode;
  let seed = '#4b55c8';
  if (S().tint) { const top = [...state.subs].filter(s => !s.paused).sort((a, b) => monthly(b) - monthly(a))[0]; if (top) seed = top.color; }
  let [h, s] = hexHsl(seed);
  s = s < 12 ? 6 : clamp(s, 35, 70);
  const H = (sat, l) => `hsl(${h.toFixed(0)} ${sat}% ${l}%)`;
  const v = mode === 'dark' ? {
    primary: H(s, 80), 'on-primary': H(s, 18), 'primary-container': H(s * .8, 28), 'on-primary-container': H(s, 92),
    'secondary-container': H(s * .35, 26), surface: H(s * .15, 7), 'surface-1': H(s * .18, 10.5), 'surface-2': H(s * .18, 13.5),
    'surface-3': H(s * .18, 18), 'on-surface': H(s * .12, 91), 'on-surface-var': H(s * .12, 70), outline: H(s * .1, 38),
  } : {
    primary: H(s, 38), 'on-primary': '#fff', 'primary-container': H(s, 91), 'on-primary-container': H(s, 15),
    'secondary-container': H(s * .45, 88), surface: H(s * .35, 98.5), 'surface-1': H(s * .4, 95.5), 'surface-2': H(s * .4, 93),
    'surface-3': H(s * .35, 89.5), 'on-surface': H(s * .15, 11), 'on-surface-var': H(s * .12, 38), outline: H(s * .12, 72),
  };
  const root = document.documentElement.style;
  for (const k in v) root.setProperty('--' + k, v[k]);
  $('meta[name=theme-color]').content = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || v.surface;
}
mq.addEventListener('change', applyTheme);

/* ============ 泡泡物理引擎 ============ */
class Pool {
  constructor(stage) {
    this.stage = stage; this.nodes = new Map(); this.W = 300; this.H = 400; this.raf = 0; this.drag = null; this.anchors = {};
    this.trash = $('#trash'); this.labels = $('#stageLabels');
    new ResizeObserver(() => this.measure()).observe(stage);
    this.measure();
    stage.addEventListener('pointerdown', e => this.down(e));
    stage.addEventListener('pointermove', e => { this.move(e); this.mouseShake(e); });
    stage.addEventListener('pointerup', e => this.up(e));
    stage.addEventListener('pointercancel', e => this.up(e, true));
    document.addEventListener('visibilitychange', () => document.hidden ? this.stop() : this.start());
  }
  measure() {
    const r = this.stage.getBoundingClientRect(); if (!r.width) return;
    // 泡泡池延伸到浮動導覽列後方，但泡泡的活動範圍停在導覽列上緣
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 92;
    this.W = r.width; this.H = Math.max(160, r.height - nav); this.rescale(); this.start();
  }
  sync(subs) {
    const ids = new Set(subs.map(s => s.id));
    for (const [id, n] of this.nodes) if (!ids.has(id)) { n.el.classList.add('pop'); setTimeout(() => n.el.remove(), 260); this.nodes.delete(id); }
    for (const s of subs) {
      let n = this.nodes.get(s.id);
      if (!n) {
        const el = document.createElement('div'); el.className = 'bubble'; el.dataset.id = s.id;
        const ang = Math.random() * Math.PI * 2;
        n = { id: s.id, el, x: this.W / 2 + Math.cos(ang) * this.W * .5, y: this.H / 2 + Math.sin(ang) * this.H * .5, vx: 0, vy: 0, r: 6, tr: 30, seed: Math.random() * 10, rShown: 0 };
        this.stage.appendChild(el); this.nodes.set(s.id, n);
      }
      n.sub = s; this.paint(n);
    }
    this.rescale(); this.start();
  }
  paint(n) {
    const s = n.sub, el = n.el;
    el.style.background = fill(s);
    el.style.setProperty('--glow', s.color + '88');
    el.style.setProperty('--ring', s.color);
    el.classList.toggle('dark-text', darkText(s));
    el.classList.toggle('deep', deep(s));
    el.classList.toggle('paused', !!s.paused);
    el.classList.toggle('trial', !!s.trial);
    el.classList.toggle('inst', isInst(s));
    const nb = nextBill(s);
    el.classList.toggle('due', !!nb && daysTo(nb) <= S().remindDays);
    n.rShown = 0; n.key = ''; // 強制重畫內容
  }
  label(n) {
    const r = n.r, s = n.sub;
    if (Math.abs(r - n.rShown) < 1.5) return;
    n.rShown = r;
    if (isInst(s)) { // 分期：Material 圖示 + 繳款進度環 + 「金額 · 已繳/總期數」
      const paid = instPaid(s), showPrice = r >= 34;
      const priceTxt = '$' + short(S().period === 'year' ? yearly(s) : monthly(s)) + (r >= 46 ? ` · ${paid}/${s.periods}` : '');
      const key = `inst|${s.icon}|${paid}|${showPrice ? priceTxt : ''}`;
      if (n.key !== key) {
        n.key = key;
        const C = 2 * Math.PI * 46.5, f = paid / s.periods;
        n.el.innerHTML = `<svg class="iring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46.5" class="trk"/><circle cx="50" cy="50" r="46.5" class="val" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}"/></svg>
          <div class="bi">${instSvg(s.icon, 'ms bl')}${showPrice ? `<span class="bp">${priceTxt}</span>` : ''}</div>`;
        n.img = n.el.querySelector('.bl'); n.bp = n.el.querySelector('.bp');
      }
      n.img.style.width = n.img.style.height = (r * (showPrice ? .72 : .95)).toFixed(1) + 'px';
      if (n.bp) n.bp.style.fontSize = clamp(r * .19, 10, 14).toFixed(1) + 'px';
      return;
    }
    const lg = logoOf(s);
    if (lg) {
      const showPrice = r >= 34, priceTxt = s.paused ? '暫停中' : '$' + short(S().period === 'year' ? monthly(s) * 12 : monthly(s));
      const key = lg.src + '|' + (showPrice ? priceTxt : '');
      if (n.key !== key) {
        n.key = key;
        n.el.innerHTML = `<div class="bi">${logoImg(s)}${showPrice ? `<span class="bp">${priceTxt}</span>` : ''}</div>`;
        n.img = n.el.querySelector('img'); n.bp = n.el.querySelector('.bp');
      }
      const k = lg.kind === 'glyph' ? (showPrice ? .78 : .98) : (showPrice ? .74 : .92);
      n.img.style.width = n.img.style.height = (r * k).toFixed(1) + 'px';
      if (n.bp) n.bp.style.fontSize = clamp(r * .2, 10, 15).toFixed(1) + 'px';
      return;
    }
    n.key = '';
    const full = s.name, w = [...full].reduce((a, c) => a + (/[　-鿿]/.test(c) ? 1 : .58), 0);
    let fs = Math.min(r * .34, (r * 1.55) / w), text = full;
    if (fs < 11) { text = s.mono || full.slice(0, 2); const mw = [...text].reduce((a, c) => a + (/[　-鿿]/.test(c) ? 1 : .62), 0); fs = Math.min(r * .62, (r * 1.4) / mw); }
    const per = S().period === 'year' ? monthly(s) * 12 : monthly(s);
    const price = r >= 38 ? `<span class="bp" style="font-size:${clamp(r * .2, 10, 15).toFixed(1)}px">${s.paused ? '暫停中' : '$' + short(per)}</span>` : '';
    n.el.innerHTML = `<div class="bi"><span class="bn" style="font-size:${fs.toFixed(1)}px">${esc(text)}</span>${price}</div>`;
  }
  rescale() {
    const arr = [...this.nodes.values()]; if (!arr.length) return;
    const vals = arr.map(n => monthly(n.sub)), avg = vals.reduce((a, b) => a + b, 0) / arr.length || 1;
    const eff = vals.map(v => Math.max(v, avg * .12, 1));
    const sum = eff.reduce((a, b) => a + b, 0);
    const area = this.W * this.H * (arr.length < 3 ? .3 : S().group === 'cat' ? .3 : .42);
    const maxR = Math.min(this.W, this.H) * .34;
    arr.forEach((n, i) => { n.tr = clamp(Math.sqrt(area * eff[i] / sum / Math.PI), 22, maxR); });
    // 分類錨點
    const cats = [...new Set(arr.map(n => n.sub.cat || 'other'))];
    const cx = this.W / 2, cy = this.H / 2; this.anchors = {};
    cats.forEach((c, i) => {
      if (cats.length === 1) { this.anchors[c] = { x: cx, y: cy, dx: 0, dy: -1 }; return; }
      const a = -Math.PI / 2 + i * 2 * Math.PI / cats.length;
      this.anchors[c] = { x: cx + Math.cos(a) * this.W * .3, y: cy + Math.sin(a) * this.H * .31, dx: Math.cos(a), dy: Math.sin(a) };
    });
    this.labels.innerHTML = cats.map(c => `<span data-cat="${c}">${esc(catName(c))}</span>`).join('');
    this.labelEls = $$('span', this.labels);
  }
  // 分類標籤跟著群集的頂端移動，避免蓋住泡泡
  placeLabels(arr) {
    for (const el of this.labelEls || []) {
      const m = arr.filter(n => (n.sub.cat || 'other') === el.dataset.cat); if (!m.length) continue;
      let top = Infinity, sx = 0, sw = 0;
      for (const n of m) { top = Math.min(top, n.y - n.r); sx += n.x * n.r; sw += n.r; }
      el.style.left = clamp(sx / sw, 36, this.W - 36).toFixed(0) + 'px';
      el.style.top = clamp(top - 10, 12, this.H - 12).toFixed(0) + 'px';
    }
  }
  /* 搖晃：設備往一邊加速，泡泡因慣性往反方向晃（小泡泡比較輕，晃得比較多） */
  impulse(ix, iy) {
    if (!S().shake || view !== 'pool') return;
    for (const n of this.nodes.values()) {
      if (this.drag && this.drag.n === n) continue;
      const m = clamp(46 / n.r, .55, 1.7) * (.8 + (n.seed % 1) * .4);
      n.vx = clamp(n.vx + ix * m, -40, 40); n.vy = clamp(n.vy + iy * m, -40, 40);
    }
    this.shakeT = performance.now(); this.start();
  }
  // 電腦：滑鼠在泡泡池快速來回晃動（不按鍵）
  mouseShake(e) {
    if (e.pointerType !== 'mouse' || e.buttons || this.drag) return;
    const now = performance.now(), m = this.ms || (this.ms = { x: e.clientX, y: e.clientY, t: now, sx: 0, sy: 0, rev: [] });
    const dt = Math.max(8, now - m.t), vx = (e.clientX - m.x) / dt * 16, vy = (e.clientY - m.y) / dt * 16;
    m.x = e.clientX; m.y = e.clientY; m.t = now;
    const sx = Math.sign(Math.abs(vx) > 6 ? vx : 0), sy = Math.sign(Math.abs(vy) > 6 ? vy : 0);
    if ((sx && m.sx && sx !== m.sx) || (sy && m.sy && sy !== m.sy)) m.rev.push(now);
    if (sx) m.sx = sx; if (sy) m.sy = sy;
    m.rev = m.rev.filter(t => now - t < 700);
    if (m.rev.length >= 3) this.impulse(-clamp(vx, -60, 60) * .12, -clamp(vy, -60, 60) * .12);
  }
  // 電腦：拖動瀏覽器視窗時，泡泡留在原地 → 相對視窗往反方向晃
  windowShake() {
    const x = window.screenX, y = window.screenY;
    if (this.wx != null && (x !== this.wx || y !== this.wy)) {
      const dx = clamp(x - this.wx, -80, 80), dy = clamp(y - this.wy, -80, 80);
      if (Math.abs(dx) + Math.abs(dy) < 200) this.impulse(-dx * .35, -dy * .35);
    }
    this.wx = x; this.wy = y;
  }
  start() { if (!this.raf && !document.hidden && !this.stage.closest('[hidden]')) this.raf = requestAnimationFrame(t => this.tick(t)); }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
  tick(t) {
    this.raf = 0;
    this.windowShake();
    const arr = [...this.nodes.values()], W = this.W, H = this.H, cat = S().group === 'cat', time = t / 1000;
    const shaking = this.shakeT && t - this.shakeT < 600, bounce = shaking ? .75 : .5; let hit = 0;
    for (const n of arr) {
      n.r += (n.tr - n.r) * .12;
      if (this.drag && this.drag.n === n) continue;
      const A = cat ? (this.anchors[n.sub.cat || 'other'] || { x: W / 2, y: H / 2 }) : { x: W / 2, y: H / 2 };
      const k = cat ? .006 : .0035;
      n.vx += (A.x - n.x) * k + Math.sin(time * .7 + n.seed) * .018;
      n.vy += (A.y - n.y) * k + Math.cos(time * .55 + n.seed * 1.7) * .018;
      n.vx *= .86; n.vy *= .86;
      n.x += n.vx; n.y += n.vy;
    }
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i], b = arr[j]; let dx = b.x - a.x, dy = b.y - a.y; let d = Math.hypot(dx, dy);
        const min = a.r + b.r + 4;
        if (d >= min) continue;
        if (d < .01) { dx = Math.random() - .5; dy = Math.random() - .5; d = Math.hypot(dx, dy); }
        const ov = (min - d) / d, ma = a.r * a.r, mb = b.r * b.r;
        let wa = mb / (ma + mb), wb = ma / (ma + mb);
        if (this.drag) { if (this.drag.n === a) { wa = 0; wb = 1; } else if (this.drag.n === b) { wa = 1; wb = 0; } }
        a.x -= dx * ov * wa * .5; a.y -= dy * ov * wa * .5; b.x += dx * ov * wb * .5; b.y += dy * ov * wb * .5;
      }
    }
    for (const n of arr) {
      if (n.x < n.r || n.x > W - n.r) { if (shaking) hit = Math.max(hit, Math.abs(n.vx)); n.x = clamp(n.x, n.r, W - n.r); n.vx = (n.x <= n.r ? 1 : -1) * Math.abs(n.vx) * bounce; }
      if (n.y < n.r || n.y > H - n.r) { if (shaking) hit = Math.max(hit, Math.abs(n.vy)); n.y = clamp(n.y, n.r, H - n.r); n.vy = (n.y <= n.r ? 1 : -1) * Math.abs(n.vy) * bounce; }
      const sz = (n.r * 2).toFixed(1);
      if (n.el.style.width !== sz + 'px') { n.el.style.width = n.el.style.height = sz + 'px'; }
      n.el.style.transform = `translate3d(${(n.x - n.r).toFixed(1)}px, ${(n.y - n.r).toFixed(1)}px, 0)`;
      this.label(n);
    }
    if (cat) this.placeLabels(arr);
    // 搖晃時泡泡撞到邊緣：App 上輕震一下
    if (hit > 10 && NATIVE && t - (this.hitT || 0) > 140) { this.hitT = t; haptic(); }
    if (arr.length) this.start();
  }
  /* 拖曳：點擊開啟詳情、甩動、拖到垃圾桶刪除 */
  local(e) { const r = this.stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  down(e) {
    const el = e.target.closest('.bubble'); if (!el) return;
    const n = this.nodes.get(el.dataset.id); if (!n) return;
    const p = this.local(e);
    this.drag = { n, ox: p.x - n.x, oy: p.y - n.y, sx: p.x, sy: p.y, lx: p.x, ly: p.y, lt: performance.now(), vx: 0, vy: 0, moved: false };
    el.setPointerCapture(e.pointerId); el.classList.add('dragging');
  }
  move(e) {
    const d = this.drag; if (!d) return;
    const p = this.local(e), now = performance.now(), dt = Math.max(8, now - d.lt);
    if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > 7) { d.moved = true; this.trash.classList.add('show'); }
    if (!d.moved) return;
    d.vx = (p.x - d.lx) / dt * 16; d.vy = (p.y - d.ly) / dt * 16; d.lx = p.x; d.ly = p.y; d.lt = now;
    d.n.x = p.x - d.ox; d.n.y = p.y - d.oy;
    const hot = this.overTrash(p); this.trash.classList.toggle('hot', hot); d.n.el.classList.toggle('over-trash', hot);
    this.start();
  }
  overTrash(p) { const tr = this.trash.getBoundingClientRect(), sr = this.stage.getBoundingClientRect(); return Math.hypot(p.x - (tr.left - sr.left + tr.width / 2), p.y - (tr.top - sr.top + tr.height / 2)) < 56; }
  up(e, cancel) {
    const d = this.drag; if (!d) return; this.drag = null;
    d.n.el.classList.remove('dragging', 'over-trash'); this.trash.classList.remove('show', 'hot');
    if (cancel) return;
    if (!d.moved) { openDetail(d.n.id); return; }
    if (this.overTrash(this.local(e))) { removeSub(d.n.id); return; }
    d.n.vx = clamp(d.vx, -30, 30); d.n.vy = clamp(d.vy, -30, 30);
  }
}

/* ============ 畫面 ============ */
let pool, view = 'pool';
function render() {
  applyTheme();
  renderPool();
  if (view === 'explore') renderExplore();
  if (view === 'bills') renderBills();
  if (view === 'insight') renderInsight();
  if (view === 'settings') renderSettings();
  scheduleNative(); // 資料變動後重排 App 通知
}

function renderPool() {
  const M = totalMonthly(), yr = S().period === 'year';
  const hasInst = state.subs.some(s => isInst(s) && !instDone(s));
  $('#totalLabel').textContent = (yr ? '未來一年' : '每月') + (hasInst ? '訂閱＋分期' : '訂閱支出');
  $('#totalNum').innerHTML = `${money(yr ? totalYearly() : M)}<small>/${yr ? '年' : '月'}</small>`;
  const b = S().budget, bd = $('#budget');
  bd.hidden = !b;
  if (b) {
    const pct = M / b * 100; bd.classList.toggle('over', pct > 100);
    $('#budgetFill').style.width = clamp(pct, 0, 100) + '%';
    $('#budgetText').textContent = pct > 100 ? `超出預算 ${money(M - b)}` : `月預算 ${money(b)} · 已用 ${Math.round(pct)}%`;
  }
  const live = state.subs.filter(s => !instDone(s)); // 已繳清的分期不再佔泡泡
  const nSub = live.filter(s => !s.paused && !isInst(s)).length, nInst = live.filter(isInst).length;
  const due = live.map(s => ({ s, d: nextBill(s) })).filter(x => x.d && daysTo(x.d) <= S().remindDays);
  $('#poolMeta').innerHTML = live.length
    ? `<span>${nSub} 項訂閱${nInst ? ` · ${nInst} 筆分期` : ''}</span>${due.length ? `<span class="due">${due.length} 筆 ${S().remindDays} 天內扣款</span>` : ''}` : '';
  $$('#groupSeg button').forEach(x => x.classList.toggle('on', x.dataset.mode === S().group));
  $('#stage').classList.toggle('cat', S().group === 'cat');
  $('#poolEmpty').hidden = live.length > 0;
  $('#groupSeg').style.visibility = live.length > 1 ? '' : 'hidden';
  pool.sync(live);
}

/* ---------- 探索 / 新增 ---------- */
let exploreCat = 'all', query = '';
function renderExplore() {
  $('#catChips').innerHTML = [{ id: 'all', name: '全部' }, ...CATS].map(c => `<button class="chip${exploreCat === c.id ? ' on' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');
  const q = query.trim().toLowerCase();
  const list = SERVICES.filter(s => (exploreCat === 'all' || s.cat === exploreCat) && (!q || s.name.toLowerCase().includes(q) || s.id.includes(q)));
  const has = new Set(state.subs.map(s => s.serviceId));
  const item = s => {
    const p = [...s.plans].sort((a, b) => a.price * rate(a.cur) - b.price * rate(b.cur))[0];
    return `<button class="item" data-svc="${s.id}">${avatar(s)}<div class="tx"><div class="t1">${esc(s.name)}</div><div class="t2">${s.plans.length} 種方案 · ${planPrice(p)} 起/${CYCLE[p.cycle]}</div></div>
      ${has.has(s.id) ? `<span class="added">${ico('check')}已加入</span>` : ''}</button>`;
  };
  let html = `<button class="custom-card inst-card" id="instBtn"><span class="av">${instSvg('card')}</span><div class="tx"><div class="t1">信用卡分期</div><div class="t2" style="font-size:13px;color:var(--on-surface-var)">記錄買了什麼、分幾期，併入每月支出</div></div></button>
    <button class="custom-card" id="customBtn"><span class="av">${ico('add')}</span><div class="tx"><div class="t1">自訂訂閱</div><div class="t2" style="font-size:13px;color:var(--on-surface-var)">上傳 LOGO，自動取色</div></div></button>
    <button class="custom-card" id="multiBtn" style="border-style:solid;border-color:transparent;background:var(--surface-1)"><span class="av" style="background:var(--primary-container);color:var(--on-primary-container)">${ico('grid')}</span><div class="tx"><div class="t1">快速多選</div><div class="t2" style="font-size:13px;color:var(--on-surface-var)">一次勾選多個常用訂閱</div></div></button>`;
  if (exploreCat === 'all' && !q) html += CATS.map(c => `<div class="list-sub">${c.name}</div>` + list.filter(s => s.cat === c.id).map(item).join('')).join('');
  else html += list.map(item).join('') || `<p class="muted" style="padding:24px 16px">找不到「${esc(query)}」，試試自訂訂閱</p>`;
  $('#serviceList').innerHTML = html;
  $('#priceNote').textContent = `價格為 ${PRICE_AS_OF} 台灣地區參考牌價（美元方案以 1 USD = ${S().usdRate} TWD 換算，可在設定修改）。各平台會不定期調價，加入後可隨時編輯成你實際的扣款金額。`;
}

function openAdd(serviceId) {
  const s = svc(serviceId); let pi = 0;
  const draw = () => {
    openSheet(`<div class="d-head">${avatar(s, 'd-orb')}<div><div class="d-title">${esc(s.name)}</div><div class="d-sub">${catName(s.cat)}</div></div></div>
      <div class="field"><label>選擇方案</label></div>
      <div class="plans">${s.plans.map((p, i) => `<button class="plan${i === pi ? ' on' : ''}" data-pi="${i}"><b>${esc(p.name)}</b><span>${planPrice(p)} / ${CYCLE[p.cycle]}${p.cur === 'USD' ? `<span class="usd">≈ ${money(p.price * S().usdRate)}</span>` : ''}</span></button>`).join('')}</div>
      ${commonFields({ start: fmtD(today()), split: 1, trial: false, trialEnd: fmtD(new Date(Date.now() + 7 * 864e5)) })}
      <button class="btn filled block" id="doAdd">加入泡泡池</button>`);
    $$('.plan').forEach(b => b.onclick = () => { pi = +b.dataset.pi; $$('.plan').forEach(x => x.classList.toggle('on', x === b)); });
    bindCommon();
    $('#doAdd').onclick = () => {
      const p = s.plans[pi], f = readCommon();
      addSub({ id: uid(), serviceId: s.id, name: s.name, mono: s.mono, cat: s.cat, color: s.color, color2: s.color2, planName: p.name, price: p.price, cur: p.cur, cycle: p.cycle, ...f });
    };
  };
  draw();
}

function commonFields(v) {
  return `<div class="row2"><div class="field"><label>${v.trial ? '訂閱開始日' : '扣款日（首次或最近一次）'}</label><input type="date" id="fStart" value="${v.start}"></div>
    <div class="field"><label>分攤人數</label><div class="stepper"><button type="button" id="spMinus">−</button><output id="fSplit">${v.split}</output><button type="button" id="spPlus">+</button></div></div></div>
    <div class="switch-row"><div class="tx">免費試用中<small>試用結束日自動視為首次扣款</small></div><label class="switch"><input type="checkbox" id="fTrial" ${v.trial ? 'checked' : ''}><i></i></label></div>
    <div class="field" id="trialField" ${v.trial ? '' : 'hidden'}><label>試用結束日</label><input type="date" id="fTrialEnd" value="${v.trialEnd || ''}"></div>`;
}
function bindCommon() {
  const o = $('#fSplit');
  $('#spMinus').onclick = () => o.textContent = Math.max(1, +o.textContent - 1);
  $('#spPlus').onclick = () => o.textContent = Math.min(12, +o.textContent + 1);
  $('#fTrial').onchange = e => { $('#trialField').hidden = !e.target.checked; };
}
function readCommon() {
  const trial = $('#fTrial').checked;
  return { start: $('#fStart').value || fmtD(today()), split: +$('#fSplit').textContent || 1, trial, trialEnd: trial ? $('#fTrialEnd').value : '' };
}

function addSub(sub) {
  state.subs.push(sub); save(); closeSheet(true);
  go('pool'); render();
  if (instDone(sub)) snack(`${sub.name} 已全部繳清，可在「洞察」查看`, '查看', () => openDetail(sub.id));
  else snack(`已加入 ${sub.name}`, '查看', () => openDetail(sub.id));
}
function removeSub(id) {
  const i = state.subs.findIndex(s => s.id === id); if (i < 0) return;
  const [s] = state.subs.splice(i, 1); save(); closeSheet(true); render();
  snack(`已刪除 ${s.name}`, '復原', () => { state.subs.splice(i, 0, s); save(); render(); });
}

/* 自訂 / 編輯表單（共用） */
function openEditor(sub) {
  const isNew = !sub;
  const v = sub ? { ...sub } : { id: uid(), name: '', mono: '', cat: 'life', color: '#6750A4', planName: '', price: '', cur: 'TWD', cycle: 'month', start: fmtD(today()), split: 1, trial: false, trialEnd: '' };
  const preview = () => { const sw = $('#swatch'); if (sw) { sw.style.background = fill(v); sw.classList.toggle('dark-text', darkText(v)); $('#swLogo').innerHTML = logoImg(v); } };
  openSheet(`<h2>${isNew ? '自訂訂閱' : '編輯訂閱'}</h2>
    <div class="color-row"><span class="sw" id="swatch"><span id="swLogo"></span><input type="color" id="fColor" value="${v.color}"></span>
      <div class="tx">泡泡顏色<br>${v.serviceId ? '已套用品牌色，可手動調整' : '上傳 LOGO 自動萃取品牌色'}</div>
      <button class="btn tonal" id="logoBtn">${ico('upload')}LOGO</button><input type="file" id="logoFile" accept="image/*" hidden></div>
    <div class="row3"><div class="field"><label>名稱</label><input id="fName" value="${esc(v.name)}" placeholder="例如：健身房"></div>
      <div class="field"><label>泡泡縮寫</label><input id="fMono" value="${esc(v.mono)}" maxlength="4" placeholder="自動"></div></div>
    <div class="row2"><div class="field"><label>方案</label><input id="fPlan" value="${esc(v.planName)}" placeholder="選填"></div>
      <div class="field"><label>分類</label><select id="fCat">${CATS.map(c => `<option value="${c.id}" ${c.id === v.cat ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div></div>
    <div class="row-price"><div class="field"><label>每期金額</label><input id="fPrice" type="number" inputmode="decimal" min="0" step="any" value="${v.price}" placeholder="0"></div>
      <div class="field"><label>幣別</label><select id="fCur"><option ${v.cur === 'TWD' ? 'selected' : ''}>TWD</option><option ${v.cur === 'USD' ? 'selected' : ''}>USD</option></select></div>
      <div class="field"><label>週期</label><select id="fCycle">${Object.entries(CYCLE).map(([k, n]) => `<option value="${k}" ${k === v.cycle ? 'selected' : ''}>每${n}</option>`).join('')}</select></div></div>
    ${commonFields(v)}
    <button class="btn filled block" id="doSave">${isNew ? '加入泡泡池' : '儲存'}</button>`);
  preview(); bindCommon();
  $('#fColor').oninput = e => { v.color = e.target.value; delete v.color2; preview(); };
  $('#logoBtn').onclick = () => $('#logoFile').click();
  $('#logoFile').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const img = new Image(); img.onload = () => {
      const c = extractColors(img); v.color = c.color; v.color2 = c.color2; $('#fColor').value = c.color;
      // 保存縮小後的 LOGO（256px PNG）顯示在泡泡上
      const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
      const k = N / Math.max(img.width, img.height), w = img.width * k, h = img.height * k;
      cv.getContext('2d').drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
      v.logo = cv.toDataURL('image/png');
      preview(); URL.revokeObjectURL(img.src);
      snack('已依 LOGO 自動調色');
    };
    img.src = URL.createObjectURL(f);
  };
  $('#doSave').onclick = () => {
    const name = $('#fName').value.trim(), price = parseFloat($('#fPrice').value);
    if (!name) { $('#fName').focus(); return snack('請輸入名稱'); }
    if (!(price >= 0)) { $('#fPrice').focus(); return snack('請輸入金額'); }
    Object.assign(v, { name, mono: $('#fMono').value.trim() || ([...name].length <= 3 ? name : name.slice(0, /[　-鿿]/.test(name[0]) ? 1 : 2)), planName: $('#fPlan').value.trim(), cat: $('#fCat').value, price, cur: $('#fCur').value, cycle: $('#fCycle').value, ...readCommon() });
    if (isNew) addSub(v);
    else { const i = state.subs.findIndex(s => s.id === v.id); state.subs[i] = v; save(); render(); openDetail(v.id); }
  };
}

/* ---------- 信用卡分期：新增／編輯 ---------- */
function openInst(sub) {
  const isNew = !sub;
  const v = sub ? { ...sub } : { id: uid(), type: 'inst', cat: 'inst', cycle: 'month', cur: 'TWD', split: 1, name: '', icon: 'card',
    color: INST_COLORS[state.subs.filter(isInst).length % INST_COLORS.length], total: '', periods: 12, price: '', start: fmtD(today()), card: '' };
  let iconPicked = !isNew, perEdited = !isNew && v.total > 0 && Math.round(v.total / v.periods) !== v.price;
  const cards = [...new Set(state.subs.filter(s => isInst(s) && s.card).map(s => s.card))];
  const PERIODS = [3, 6, 10, 12, 18, 24, 30, 36];
  openSheet(`<h2>${isNew ? '新增信用卡分期' : '編輯分期'}</h2>
    <div class="inst-hero"><span class="d-orb" id="iOrb"></span><div class="field"><label>買了什麼</label><input id="iName" value="${esc(v.name)}" placeholder="例如：iPhone 17 Pro、Dyson 吸塵器" autocomplete="off"></div></div>
    <div class="field"><label>泡泡圖示 <span id="iAuto" class="auto-tag"></span></label></div>
    <div class="icon-grid" id="iIcons">${INST_ICONS.map(i => `<button type="button" data-k="${i.k}" class="${i.k === v.icon ? 'on' : ''}">${instSvg(i.k)}<span>${i.n}</span></button>`).join('')}</div>
    <div class="field"><label>顏色</label><div class="swatches" id="iColors">${INST_COLORS.map(c => `<button type="button" data-c="${c}" style="background:${c}" class="${c === v.color ? 'on' : ''}" aria-label="顏色 ${c}"></button>`).join('')}</div></div>
    <div class="row2"><div class="field"><label>商品總價</label><input id="iTotal" type="number" inputmode="numeric" min="0" value="${v.total}" placeholder="0"></div>
      <div class="field"><label>每期金額</label><input id="iPer" type="number" inputmode="numeric" min="0" value="${v.price}" placeholder="自動計算"></div></div>
    <div class="field"><label>分幾期</label><div class="chips wrap" id="iPeriods">${PERIODS.map(p => `<button type="button" class="chip${p === v.periods ? ' on' : ''}" data-p="${p}">${p} 期</button>`).join('')}<input id="iPeriodsX" class="chip-input" type="number" inputmode="numeric" min="2" max="120" placeholder="自訂" value="${PERIODS.includes(v.periods) ? '' : v.periods}"></div></div>
    <p class="inst-calc" id="iCalc"></p>
    <div class="row2"><div class="field"><label>第一期扣款日</label><input type="date" id="iStart" value="${v.start}"></div>
      <div class="field"><label>信用卡（選填）</label><input id="iCard" list="iCardList" value="${esc(v.card || '')}" placeholder="例如：國泰 CUBE"><datalist id="iCardList">${cards.map(c => `<option value="${esc(c)}">`).join('')}</datalist></div></div>
    <p class="hint-text">已經在繳的分期，填第一期的日期就會自動算出已繳幾期。每期金額若比「總價 ÷ 期數」高，會自動算出手續費與年利率。</p>
    <button class="btn filled block" id="iSave">${isNew ? '加入泡泡池' : '儲存'}</button>`);
  const orb = () => { const o = $('#iOrb'); o.style.background = v.color; o.className = 'd-orb' + (darkText(v) ? ' dark-text' : ''); o.innerHTML = instSvg(v.icon); };
  const calc = () => {
    const total = parseFloat($('#iTotal').value) || 0, n = v.periods;
    if (!perEdited && total && n) $('#iPer').value = Math.round(total / n);
    const per = parseFloat($('#iPer').value) || 0;
    if (!per) { $('#iCalc').innerHTML = ''; return; }
    const pay = per * n, fee = feeOf(total, per, n);
    const end = addCycle(parseD($('#iStart').value || fmtD(today())), 'month', n - 1);
    $('#iCalc').innerHTML = `每月 <b>${money(per)}</b> × ${n} 期 = 總付 ${money(pay)}，${ym(end)} 繳清<br>`
      + (fee > 0 ? `<span class="warn">手續費／利息 ${money(fee)} · 年利率約 ${instApr(total, per, n).toFixed(1)}%</span>` : `<span class="ok">0 利率</span>`);
  };
  orb(); calc();
  const pickIcon = k => { v.icon = k; $$('#iIcons button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); orb(); };
  $('#iName').oninput = e => { if (iconPicked) return; const k = guessIcon(e.target.value); pickIcon(k); $('#iAuto').textContent = k !== 'card' ? '已依品項自動選擇' : ''; };
  $('#iIcons').onclick = e => { const b = e.target.closest('button'); if (!b) return; iconPicked = true; $('#iAuto').textContent = ''; pickIcon(b.dataset.k); };
  $('#iColors').onclick = e => { const b = e.target.closest('button'); if (!b) return; v.color = b.dataset.c; $$('#iColors button').forEach(x => x.classList.toggle('on', x === b)); orb(); };
  $('#iPeriods').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; v.periods = +b.dataset.p; $('#iPeriodsX').value = ''; $$('#iPeriods .chip').forEach(x => x.classList.toggle('on', x === b)); calc(); };
  $('#iPeriodsX').oninput = e => { const n = parseInt(e.target.value, 10); if (n >= 2 && n <= 120) { v.periods = n; $$('#iPeriods .chip').forEach(x => x.classList.remove('on')); calc(); } };
  $('#iTotal').oninput = calc;
  $('#iPer').oninput = () => { perEdited = !!$('#iPer').value; calc(); };
  $('#iStart').onchange = calc;
  $('#iSave').onclick = () => {
    const name = $('#iName').value.trim(), total = parseFloat($('#iTotal').value) || 0, per = parseFloat($('#iPer').value) || 0;
    if (!name) { $('#iName').focus(); return snack('請輸入買了什麼'); }
    if (!(per > 0)) { $('#iTotal').focus(); return snack('請輸入總價或每期金額'); }
    Object.assign(v, { name, total: total || per * v.periods, price: per, start: $('#iStart').value || fmtD(today()), card: $('#iCard').value.trim() });
    delete v.paidOff;
    if (isNew) addSub(v);
    else { const i = state.subs.findIndex(s => s.id === v.id); state.subs[i] = v; save(); render(); openDetail(v.id); }
  };
}

function openInstDetail(s) {
  const paid = instPaid(s), left = s.periods - paid, nb = nextBill(s), fee = instFee(s), done = left <= 0;
  openSheet(`<div class="d-head">${avatar(s, 'd-orb')}<div><div class="d-title">${esc(s.name)}</div><div class="d-sub">信用卡分期${s.card ? ' · ' + esc(s.card) : ''}${s.paidOff ? ' · 已提前清償' : done ? ' · 已繳清' : ''}</div></div></div>
    <div class="d-hero"><div><span>每期</span><b>$${short(s.price)}</b></div><div><span>已繳</span><b>${paid}/${s.periods} 期</b></div><div><span>剩餘待繳</span><b>$${short(left * s.price)}</b></div></div>
    <div class="iprog" role="progressbar" aria-valuenow="${paid}" aria-valuemax="${s.periods}"><i style="width:${(paid / s.periods * 100).toFixed(1)}%;background:${s.color}"></i></div>
    <div class="d-rows">
      <div><span>下次扣款</span><span>${nb ? `${md(nb)}（週${WD[nb.getDay()]}）· 第 ${instNo(s, nb)} 期 · ${dueText(daysTo(nb))}` : '—'}</span></div>
      <div><span>最後一期</span><span>${fmtD(instEnd(s)).replace(/-/g, '/')}</span></div>
      <div><span>商品總價</span><span>${money(s.total)}</span></div>
      <div><span>利率</span><span>${fee > 0 ? `手續費 ${money(fee)} · 年利率約 ${instApr(s.total, s.price, s.periods).toFixed(1)}%` : '0 利率'}</span></div>
      ${done ? '' : `<div><span>佔每月支出</span><span>${totalMonthly() ? Math.round(monthly(s) / totalMonthly() * 100) : 0}%</span></div>`}
    </div>
    <div class="d-actions">
      <button class="btn tonal" id="dEdit">${ico('edit')}編輯</button>
      ${done ? '' : `<button class="btn outlined" id="dPayoff">${ico('check')}清償</button>`}
      <button class="btn outlined danger" id="dDel">${ico('delete')}刪除</button>
    </div>`);
  $('#dEdit').onclick = () => openInst(s);
  $('#dDel').onclick = () => removeSub(s.id);
  if (!done) $('#dPayoff').onclick = () => {
    s.paidOff = fmtD(today()); save(); closeSheet(true); render();
    snack(`${s.name} 已標記清償（一次繳 ${money(left * s.price)}）`, '復原', () => { delete s.paidOff; save(); render(); });
  };
}

/* 詳情 */
function openDetail(id) {
  const s = state.subs.find(x => x.id === id); if (!s) return;
  if (isInst(s)) return openInstDetail(s);
  const nb = nextBill(s), m = monthly(s);
  openSheet(`<div class="d-head">${avatar(s, 'd-orb')}<div><div class="d-title">${esc(s.name)}</div><div class="d-sub">${esc(s.planName || catName(s.cat))}${s.paused ? ' · 暫停中' : s.trial ? ' · 試用中' : ''}</div></div></div>
    <div class="d-hero"><div><span>每期</span><b>${s.cur === 'USD' ? 'US$' + s.price : '$' + short(s.price)}</b></div><div><span>我的月成本</span><b>$${short(m)}</b></div><div><span>一年</span><b>$${short(yearly(s))}</b></div></div>
    <div class="d-rows">
      <div><span>下次扣款</span><span>${nb ? `${md(nb)}（週${WD[nb.getDay()]}）· ${dueText(daysTo(nb))}` : '—'}</span></div>
      <div><span>週期</span><span>每${CYCLE[s.cycle]}</span></div>
      ${s.cur === 'USD' ? `<div><span>換算</span><span>${money(s.price * S().usdRate)}（匯率 ${S().usdRate}）</span></div>` : ''}
      <div><span>分攤</span><span>${s.split > 1 ? `${s.split} 人分攤 · 每人 ${money(perCharge(s))}` : '自己負擔'}</span></div>
      ${s.trial ? `<div><span>試用結束</span><span>${s.trialEnd || '—'}</span></div>` : ''}
      <div><span>佔總支出</span><span>${totalMonthly() ? Math.round(m / totalMonthly() * 100) : 0}%</span></div>
    </div>
    <div class="d-actions">
      <button class="btn tonal" id="dEdit">${ico('edit')}編輯</button>
      <button class="btn outlined" id="dPause">${ico(s.paused ? 'play' : 'pause')}${s.paused ? '恢復' : '暫停'}</button>
      <button class="btn outlined danger" id="dDel">${ico('delete')}刪除</button>
    </div>`);
  $('#dEdit').onclick = () => openEditor(s);
  $('#dPause').onclick = () => { s.paused = !s.paused; save(); render(); openDetail(id); };
  $('#dDel').onclick = () => removeSub(id);
}

/* ---------- 快速多選 ---------- */
function openOnboard(first) {
  const picked = new Set(state.subs.map(s => s.serviceId).filter(Boolean)), had = new Set(picked);
  const el = $('#onboard'); el.hidden = false;
  el.innerHTML = `<div class="ob-head"><h1>${first ? '你訂閱了哪些？' : '快速多選'}</h1><p>點選圖示加入，之後可在泡泡上調整方案與扣款日</p></div>
    <div class="ob-scroll">${CATS.map(c => `<div class="ob-cat">${c.name}</div><div class="ob-grid">${SERVICES.filter(s => s.cat === c.id).map(s =>
      `<button class="ob-pick${picked.has(s.id) ? ' on' : ''}" data-id="${s.id}">${avatar(s, 'av', `<span class="ck">${ico('check')}</span>`)}${esc(s.name)}</button>`).join('')}</div>`).join('')}</div>
    <div class="ob-foot"><span class="cnt" id="obCnt"></span><button class="btn text" id="obSkip">${first ? '略過' : '取消'}</button><button class="btn filled" id="obDone">完成</button></div>`;
  const cnt = () => $('#obCnt').textContent = `已選 ${picked.size} 項`;
  cnt();
  $$('.ob-pick', el).forEach(b => b.onclick = () => { const id = b.dataset.id; picked.has(id) ? picked.delete(id) : picked.add(id); b.classList.toggle('on'); cnt(); if (navigator.vibrate) navigator.vibrate(8); });
  const close = () => { el.hidden = true; S().onboarded = true; save(); };
  $('#obSkip').onclick = close;
  $('#obDone').onclick = () => {
    const t = fmtD(today());
    state.subs = state.subs.filter(s => !s.serviceId || picked.has(s.serviceId));
    picked.forEach(id => { if (had.has(id)) return; const s = svc(id), p = s.plans[0];
      state.subs.push({ id: uid(), serviceId: s.id, name: s.name, mono: s.mono, cat: s.cat, color: s.color, color2: s.color2, planName: p.name, price: p.price, cur: p.cur, cycle: p.cycle, start: t, split: 1, trial: false, trialEnd: '' }); });
    close(); go('pool'); render();
    if (picked.size) snack('點任一泡泡可修改方案與扣款日');
  };
}

/* ---------- 洞察 ---------- */
function renderInsight() {
  const subs = state.subs, M = totalMonthly();
  if (!subs.length) { $('#insightBody').innerHTML = `<div class="card"><p class="muted">加入訂閱後，這裡會顯示支出結構、扣款時間軸與省錢建議。</p></div>`; return; }
  // 分類
  const byCat = [...CATS, { id: 'inst', name: '信用卡分期' }].map(c => {
    const list = subs.filter(s => s.cat === c.id && !instDone(s));
    const v = list.reduce((a, s) => a + monthly(s), 0);
    const top = [...list].sort((a, b) => monthly(b) - monthly(a))[0];
    return { c, v, n: list.length, color: top ? top.color : '#999' };
  }).filter(x => x.n).sort((a, b) => b.v - a.v);
  // 時間軸 30 天
  const t = today(), end = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 30), days = new Map(); let sum30 = 0;
  subs.forEach(s => billDates(s, t, end).forEach(d => { const k = fmtD(d); if (!days.has(k)) days.set(k, { d, items: [] }); days.get(k).items.push(s); sum30 += perCharge(s); }));
  const tl = [...days.values()].sort((a, b) => a.d - b.d);
  // 建議
  const tips = [];
  const inCat = id => subs.filter(s => s.cat === id && !s.paused);
  const video = inCat('video');
  if (video.length >= 3) tips.push(`你同時訂了 <b>${video.length} 個影音平台</b>，每月 ${money(video.reduce((a, s) => a + monthly(s), 0))}。試試「輪流訂閱」：一次只留 1–2 個，追完再換。`);
  const music = inCat('music');
  if (music.length >= 2) { const c = [...music].sort((a, b) => monthly(a) - monthly(b))[0]; tips.push(`<b>${music.map(s => esc(s.name)).join('、')}</b> 功能重疊，只留一個每年可省約 ${money(monthly(c) * 12)}。`); }
  const ai = inCat('ai');
  if (ai.length >= 2) tips.push(`你有 <b>${ai.length} 個 AI 訂閱</b>（每月 ${money(ai.reduce((a, s) => a + monthly(s), 0))}），檢查一下是否每個都常用。`);
  subs.filter(s => !s.paused && s.split <= 1 && /家庭|雙人|Family|Duo/i.test(s.planName || '')).forEach(s =>
    tips.push(`<b>${esc(s.name)} ${esc(s.planName)}</b> 目前由你獨自負擔，找人分攤可降到每月 ${money(perCharge(s) / (/雙人|Duo/i.test(s.planName) ? 2 : 4))} 左右。`));
  subs.filter(s => s.trial && s.trialEnd && daysTo(parseD(s.trialEnd)) >= 0 && daysTo(parseD(s.trialEnd)) <= 7).forEach(s =>
    tips.push(`<b>${esc(s.name)}</b> 試用將於 ${md(parseD(s.trialEnd))} 結束，之後會扣款 ${money(perCharge(s))}。不想續用記得先取消。`));
  subs.filter(s => s.cycle === 'year' && !s.paused).forEach(s => { const d = nextBill(s); if (d && daysTo(d) <= 30) tips.push(`<b>${esc(s.name)}</b> 年費 ${money(perCharge(s))} 將在 ${md(d)} 扣款，續約前想一想今年用了幾次。`); });
  const paused = subs.filter(s => s.paused);
  if (paused.length) tips.push(`暫停中的 ${paused.map(s => esc(s.name)).join('、')} 每月幫你省下 ${money(paused.reduce((a, s) => a + perCharge(s) * (s.cycle === 'year' ? 1 / 12 : s.cycle === 'week' ? 52 / 12 : 1), 0))}。`);
  if (S().budget && M > S().budget) tips.unshift(`本月已超出預算 <b>${money(M - S().budget)}</b>。最大的泡泡是 <b>${esc([...subs].sort((a, b) => monthly(b) - monthly(a))[0].name)}</b>，可從它開始檢視。`);
  const inst = instSection(M);
  tips.push(...inst.tips);
  if (!tips.length) tips.push('目前的訂閱組合很精簡，沒有明顯重疊 👍');

  const top3 = [...subs].filter(s => !s.paused).sort((a, b) => monthly(b) - monthly(a)).slice(0, 3);
  $('#insightBody').innerHTML = `
    <div class="card"><div class="kpis">
      <div class="kpi"><span>每月</span><b>${money(M)}</b></div><div class="kpi"><span>未來一年</span><b>${money(totalYearly())}</b></div>
      <div class="kpi"><span>每天</span><b>${money(M / 30.4)}</b></div><div class="kpi"><span>未來 30 天將扣</span><b>${money(sum30)}</b></div></div>
      <div class="boba">未來一年的固定支出 ≈ <b>${Math.round(totalYearly() / 60).toLocaleString()}</b> 杯手搖飲（以 NT$60 計）${top3.length ? `<br>前三大：${top3.map(s => esc(s.name)).join('、')}，佔 ${Math.round(top3.reduce((a, s) => a + monthly(s), 0) / (M || 1) * 100)}%` : ''}</div></div>
    <div class="card"><h3>支出結構</h3>
      <div class="stack">${byCat.filter(x => x.v > 0).map(x => `<i style="flex:${x.v};background:${x.color}"></i>`).join('')}</div>
      <div class="legend">${byCat.map(x => `<div><span class="dot" style="background:${x.color}"></span>${x.c.name}<small style="color:var(--on-surface-var)">${x.n} 項</small><span class="v">${money(x.v)} · ${M ? Math.round(x.v / M * 100) : 0}%</span></div>`).join('')}</div></div>
    ${inst.html}
    <div class="card"><h3>省錢建議</h3><div class="tips">${tips.map(x => `<div class="tip">${ico('tip')}<div>${x}</div></div>`).join('')}</div></div>`;
  showBar(0);
}

/* ---------- 扣款月曆 ---------- */
let billsMonth = null, billsSel = null;
function renderBills() {
  const t = today(), tk = fmtD(t);
  if (!billsMonth) billsMonth = new Date(t.getFullYear(), t.getMonth(), 1);
  if (!billsSel) billsSel = tk;
  const y = billsMonth.getFullYear(), m = billsMonth.getMonth();
  const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
  const byDay = new Map(); let total = 0, paid = 0, n = 0;
  state.subs.forEach(s => billDates(s, first, last).forEach(d => {
    const k = fmtD(d); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(s);
    const v = perCharge(s); total += v; n++; if (d <= t) paid += v;
  }));
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push('<span class="cal-cell blank"></span>');
  for (let d = 1; d <= last.getDate(); d++) {
    const k = fmtD(new Date(y, m, d)), items = byDay.get(k) || [];
    const cls = ['cal-cell', k === tk && 'today', k === billsSel && 'sel', k < tk && 'past', items.length && 'has'].filter(Boolean).join(' ');
    const dots = items.slice(0, 3).map(s => `<i style="background:${s.color}"></i>`).join('') + (items.length > 3 ? '<em>+</em>' : '');
    cells.push(`<button class="${cls}" data-day="${k}"><span class="dn">${d}</span><span class="dots">${dots}</span></button>`);
  }
  const sel = parseD(billsSel), selItems = byDay.get(billsSel) || [];
  const row = (s, d) => `<button class="bill-row" data-open="${s.id}">${avatar(s)}<div class="tx"><div class="t1">${esc(s.name)}</div>
      <div class="t2">${isInst(s) ? `分期 第 ${instNo(s, d)}/${s.periods} 期` : esc(s.planName || catName(s.cat))}${s.split > 1 ? ` · ${s.split} 人分攤` : ''}</div></div>
      <b class="amt">${money(perCharge(s))}</b></button>`;
  const days = [...byDay.keys()].sort();
  $('#billsBody').innerHTML = `
    <div class="card bills-sum">
      <div class="kpis">
        <div class="kpi"><span>${m + 1} 月合計 · ${n} 筆</span><b>${money(total)}</b></div>
        <div class="kpi"><span>${y === t.getFullYear() && m === t.getMonth() ? '本月還要扣' : first > t ? '尚未扣款' : '已全部扣款'}</span><b>${money(first > t ? total : last < t ? 0 : total - paid)}</b></div>
      </div>
      ${total > 0 && y === t.getFullYear() && m === t.getMonth() ? `<div class="paid-bar" title="已扣 ${money(paid)}"><i style="width:${(paid / total * 100).toFixed(1)}%"></i></div>` : ''}
    </div>
    <div class="card cal">
      <div class="cal-head">
        <button class="icon-btn" data-mon="-1" aria-label="上個月">${ico('chev_l')}</button>
        <b>${y} 年 ${m + 1} 月</b>
        <button class="icon-btn" data-mon="1" aria-label="下個月">${ico('chev_r')}</button>
        ${y === t.getFullYear() && m === t.getMonth() ? '' : '<button class="today-btn" data-mon="0">今天</button>'}
      </div>
      <div class="cal-grid cal-wd">${[...'日一二三四五六'].map(w => `<span>${w}</span>`).join('')}</div>
      <div class="cal-grid">${cells.join('')}</div>
    </div>
    <div class="card">
      <h3>${sel.getMonth() + 1} 月 ${sel.getDate()} 日 週${WD[sel.getDay()]}${selItems.length ? `<span class="h3-sub">${money(selItems.reduce((a, s) => a + perCharge(s), 0))}</span>` : ''}</h3>
      ${selItems.length ? `<div class="bill-list">${selItems.map(s => row(s, sel)).join('')}</div>` : '<p class="muted">這天沒有扣款</p>'}
    </div>
    ${days.length ? `<div class="card"><h3>${m + 1} 月扣款明細</h3>${days.map(k => { const d = parseD(k);
      return `<div class="bill-day${k < tk ? ' past' : ''}"><div class="bd-date"><b>${d.getDate()}</b><span>週${WD[d.getDay()]}</span></div><div class="bill-list">${byDay.get(k).map(s => row(s, d)).join('')}</div></div>`; }).join('')}</div>` : ''}`;
}
$('#billsBody').onclick = e => {
  const day = e.target.closest('[data-day]');
  if (day) { billsSel = day.dataset.day; haptic(); return renderBills(); }
  const mon = e.target.closest('[data-mon]');
  if (mon) {
    const dlt = +mon.dataset.mon, t = today();
    billsMonth = dlt ? new Date(billsMonth.getFullYear(), billsMonth.getMonth() + dlt, 1) : new Date(t.getFullYear(), t.getMonth(), 1);
    const isCur = billsMonth.getFullYear() === t.getFullYear() && billsMonth.getMonth() === t.getMonth();
    billsSel = isCur ? fmtD(t) : fmtD(billsMonth);
    return renderBills();
  }
  const it = e.target.closest('[data-open]'); if (it) openDetail(it.dataset.open);
};

/* ---------- 洞察：信用卡分期 ---------- */
let instMonths = [];
function instSection(M) {
  const all = state.subs.filter(isInst), act = all.filter(s => !instDone(s)), done = all.filter(instDone);
  if (!all.length) return { tips: [], html: `<div class="card"><h3>信用卡分期</h3><p class="muted">還沒有分期。到「新增」→「信用卡分期」記下買了什麼、分幾期，這裡會算出每月負擔何時下降、還剩多少要繳。</p></div>` };
  const mon = act.reduce((a, s) => a + s.price, 0), left = act.reduce((a, s) => a + instLeft(s) * s.price, 0);
  const lastEnd = act.length ? new Date(Math.max(...act.map(s => +instEnd(s)))) : null;
  // 未來 12 個月（含本月）每月分期負擔，依品項堆疊
  const t = today();
  instMonths = [...Array(12)].map((_, i) => {
    const a = new Date(t.getFullYear(), t.getMonth() + i, 1), b = new Date(t.getFullYear(), t.getMonth() + i + 1, 0);
    const items = act.map(s => ({ s, v: billDates(s, a, b).length * s.price })).filter(x => x.v > 0);
    return { a, items, sum: items.reduce((x, y) => x + y.v, 0) };
  });
  const max = Math.max(...instMonths.map(m => m.sum), 1);
  const bars = instMonths.map((m, i) => `<button class="ibar${i === 0 ? ' on' : ''}" data-bar="${i}" aria-label="${m.a.getMonth() + 1} 月分期 ${money(m.sum)}">
      <span class="col">${m.items.map(x => `<i style="height:${(x.v / max * 100).toFixed(1)}%;background:${x.s.color}"></i>`).join('')}</span>
      <span class="ml">${m.a.getMonth() === 0 || i === 0 ? `${m.a.getFullYear() % 100}/` : ''}${m.a.getMonth() + 1}</span></button>`).join('');
  const rows = [...act].sort((a, b) => instEnd(a) - instEnd(b)).map(s => { const p = instPaid(s);
    return `<button class="irow" data-open="${s.id}"><span class="iav${darkText(s) ? ' dark-text' : ''}" style="background:${s.color}">${instSvg(s.icon)}</span>
      <div class="tx"><div class="t1"><span class="nm">${esc(s.name)}</span><span class="v">${money(s.price)}/月</span></div>
      <div class="iprog sm"><i style="width:${(p / s.periods * 100).toFixed(1)}%;background:${s.color}"></i></div>
      <div class="t2">${p}/${s.periods} 期 · 剩 ${money(instLeft(s) * s.price)} · ${ym(instEnd(s))} 繳清${s.card ? ' · ' + esc(s.card) : ''}</div></div></button>`; }).join('');
  const byCard = {};
  act.forEach(s => { const k = s.card || '未填卡片'; const c = byCard[k] || (byCard[k] = { mon: 0, left: 0, n: 0 }); c.mon += s.price; c.left += instLeft(s) * s.price; c.n++; });
  const cardKeys = Object.keys(byCard).sort((a, b) => byCard[b].left - byCard[a].left);
  const cardHtml = act.some(s => s.card) ? `<h4>各卡分期額度占用</h4><div class="cards-list">${cardKeys.map(k => `<div><span>${esc(k)}<small>${byCard[k].n} 筆 · 每月 ${money(byCard[k].mon)}</small></span><b>${money(byCard[k].left)}</b></div>`).join('')}</div>
    <p class="muted small">剩餘待繳金額會持續佔用該卡的信用額度。</p>` : '';

  // 分期建議
  const tips = [];
  if (M > 0 && mon / M >= .3) tips.push(`分期佔每月固定支出 <b>${Math.round(mon / M * 100)}%</b>。開新的分期前，先看「信用卡分期」圖表的負擔什麼時候會降下來。`);
  for (let i = 1; i < instMonths.length; i++) {
    const p = instMonths[i - 1], c = instMonths[i];
    if (c.sum < p.sum - 1) {
      const ended = p.items.filter(x => !c.items.some(y => y.s === x.s)).map(x => esc(x.s.name));
      tips.push(`<b>${c.a.getFullYear()}/${c.a.getMonth() + 1}</b> 起分期負擔從 ${money(p.sum)} 降到 ${money(c.sum)}${ended.length ? `（${ended.join('、')} 繳清）` : ''}，每月多出 ${money(p.sum - c.sum)}。`);
      break;
    }
  }
  act.filter(s => instLeft(s) <= 2).forEach(s => tips.push(`<b>${esc(s.name)}</b> 只剩 ${instLeft(s)} 期，${ym(instEnd(s))} 繳清 🎉`));
  act.filter(s => instFee(s) > 0).forEach(s => tips.push(`<b>${esc(s.name)}</b> 不是 0 利率：手續費 ${money(instFee(s))}，年利率約 <b>${instApr(s.total, s.price, s.periods).toFixed(1)}%</b>。手頭寬裕時可問銀行提前清償，通常能省下尚未攤提的利息。`));

  const html = `<div class="card inst-card-ins"><h3>信用卡分期</h3>
    <div class="kpis">
      <div class="kpi"><span>每月分期</span><b>${money(mon)}</b><small>${M ? `佔固定支出 ${Math.round(mon / M * 100)}%` : ''}</small></div>
      <div class="kpi"><span>剩餘待繳</span><b>${money(left)}</b><small>${act.length} 筆進行中</small></div>
    </div>
    ${act.length ? `<h4>未來 12 個月每月分期負擔</h4>
    <div class="ibars-wrap"><span class="ymax">${short(max)}</span><div class="ibars" id="ibars">${bars}</div></div>
    <div class="ibar-tip" id="ibarTip"></div>
    ${lastEnd ? `<p class="muted small">全部分期將於 <b>${ym(lastEnd)}</b> 繳清</p>` : ''}
    <div class="irows">${rows}</div>${cardHtml}` : ''}
    ${done.length ? `<div class="done-row"><span>已繳清 ${done.length} 筆：${done.map(s => esc(s.name)).join('、')}</span><button class="btn text" id="clearDone">清除</button></div>` : ''}
  </div>`;
  return { html, tips };
}
function showBar(i) {
  const m = instMonths[i], el = $('#ibarTip'); if (!m || !el) return;
  $$('#ibars .ibar').forEach((b, k) => b.classList.toggle('on', k === i));
  el.innerHTML = `<b>${m.a.getFullYear()}/${m.a.getMonth() + 1}</b> 分期合計 <b>${money(m.sum)}</b>`
    + (m.items.length ? `<div class="tip-items">${m.items.map(x => `<span><i style="background:${x.s.color}"></i>${esc(x.s.name)} ${money(x.v)}</span>`).join('')}</div>` : '<div class="tip-items">這個月沒有分期 🎉</div>');
}

/* ---------- 設定 ---------- */
function shakeTip() {
  const phone = NATIVE || matchMedia('(pointer:coarse)').matches;
  if (!phone) return '拖動瀏覽器視窗，或滑鼠在泡泡池快速來回晃動';
  if (!NATIVE && !window.isSecureContext) return '需用 HTTPS 網址開啟（例如 Tailscale 網址）才能讀取動作感應';
  if (Motion.perm === 'ask') return '點此開關後允許「動作與方向」，就能搖晃手機';
  if (Motion.perm === 'denied') return '動作感應未被允許；重新整理頁面後再開一次';
  if (!Motion.ok) return '搖晃手機，泡泡會跟著晃動（尚未收到感應器資料）';
  return '搖晃手機，泡泡會跟著晃動';
}
function renderSettings() {
  const st = S();
  const sw = (id, on) => `<label class="switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></label>`;
  const perm = NATIVE ? nativePerm : 'Notification' in window ? Notification.permission : 'unsupported';
  $('#settingsBody').innerHTML = `
    <div class="set-title">預算與換算</div>
    <div class="set-group">
      <div class="set-item"><div class="tx"><div>每月預算</div><small>0 表示不設定</small></div><input class="num" id="sBudget" type="number" inputmode="numeric" min="0" value="${st.budget}"></div>
      <div class="set-item"><div class="tx"><div>美元匯率</div><small>1 USD 兌換 TWD</small></div><input class="num" id="sRate" type="number" inputmode="decimal" step="0.01" min="1" value="${st.usdRate}"></div>
    </div>
    <div class="set-title">提醒</div>
    <div class="set-group">
      <div class="set-item"><div class="tx"><div>扣款前提醒</div><small>泡泡外圈會脈動，並發送通知</small></div><input class="num" id="sRemind" type="number" min="0" max="14" value="${st.remindDays}" style="width:80px"></div>
      <button class="set-item" id="sNotify">${ico('bell')}<div class="tx"><div>系統通知</div><small>${perm === 'granted' ? (NATIVE ? '已開啟：扣款前會在早上 9 點通知（App 關閉時也會）' : '已開啟：開啟 App 時通知即將扣款項目') : perm === 'denied' ? '已被封鎖，請至瀏覽器設定開啟' : perm === 'unsupported' ? '此瀏覽器不支援' : '點此允許通知'}</small></div></button>
    </div>
    <div class="set-title">外觀</div>
    <div class="set-group">
      <div class="set-item"><div class="tx"><div>主題</div></div><div class="seg" id="sTheme">${[['system', '系統'], ['light', '淺色'], ['dark', '深色']].map(([k, n]) => `<button data-v="${k}" class="${st.theme === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
      <div class="set-item"><div class="tx"><div>品牌色主題</div><small>介面隨你最貴的訂閱品牌色變化</small></div>${sw('sTint', st.tint)}</div>
      <div class="set-item"><div class="tx"><div>搖晃泡泡</div><small id="shakeTip">${shakeTip()}</small></div>${sw('sShake', st.shake)}</div>
    </div>
    <div class="set-title">資料</div>
    <div class="set-group">
      <button class="set-item" id="sExport">${ico('download')}<div class="tx"><div>匯出備份</div><small>${NATIVE ? '存成 JSON 檔，可存到雲端硬碟或傳給自己' : '下載 JSON 檔'}</small></div></button>
      <button class="set-item" id="sImport">${ico('upload')}<div class="tx"><div>匯入備份</div><small>從 JSON 檔還原</small></div></button>
      <button class="set-item" id="sOnboard">${ico('grid')}<div class="tx"><div>快速多選訂閱</div><small>重新勾選你有的服務</small></div></button>
      <button class="set-item danger" id="sReset">${ico('restart')}<div class="tx"><div>清除所有資料</div><small>刪除全部訂閱與設定</small></div></button>
    </div>
    <p class="footnote"><span class="sync-dot"></span><span id="syncStatus">${syncText()}</span><br>價格參考 ${PRICE_AS_OF}，請以各平台公告為準。</p>`;
  updateSyncUi();
  const num = (id, key, min = 0) => $(id).onchange = e => { const v = parseFloat(e.target.value); st[key] = isFinite(v) ? Math.max(min, v) : DEFAULT_SETTINGS[key]; save(); render(); };
  num('#sBudget', 'budget'); num('#sRate', 'usdRate', 1); num('#sRemind', 'remindDays');
  $$('#sTheme button').forEach(b => b.onclick = () => { st.theme = b.dataset.v; save(); render(); });
  $('#sTint').onchange = e => { st.tint = e.target.checked; save(); applyTheme(); };
  $('#sShake').onchange = e => {
    st.shake = e.target.checked; save();
    if (st.shake) Motion.request();
    $('#shakeTip').textContent = shakeTip();
  };
  $('#sNotify').onclick = async () => {
    if (NATIVE) { await requestNativeNotify(); return renderSettings(); }
    if (!('Notification' in window)) return; const p = await Notification.requestPermission(); if (p === 'granted') { st.lastNotify = ''; save(); notifyDue(); } renderSettings(); };
  $('#sExport').onclick = async () => {
    if (NATIVE) { // App：寫成檔案後用 Android 分享面板存到雲端硬碟、檔案或傳給自己
      const { Filesystem, Share } = window.Capacitor.Plugins;
      const name = `subble-backup-${fmtD(today())}.json`;
      try {
        const r = await Filesystem.writeFile({ path: name, data: JSON.stringify(state, null, 2), directory: 'CACHE', encoding: 'utf8' });
        await Share.share({ title: '訂閱泡泡備份', files: [r.uri], dialogTitle: '儲存或傳送備份檔' });
      } catch (e) { if (!/cancel/i.test(String(e && e.message))) snack('匯出失敗：' + (e && e.message || e)); }
      return;
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
    a.download = `subble-backup-${fmtD(today())}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#sImport').onclick = () => $('#importFile').click();
  $('#sOnboard').onclick = () => openOnboard(false);
  $('#sReset').onclick = () => {
    openSheet(`<h2>清除所有資料？</h2><p class="muted" style="margin-bottom:20px">會刪除這台裝置上的 ${state.subs.length} 筆訂閱與所有設定，無法復原。建議先匯出備份。</p>
      <div class="d-actions"><button class="btn outlined" id="rNo">取消</button><button class="btn filled" id="rYes" style="background:var(--error);color:#fff">清除</button></div>`);
    $('#rNo').onclick = () => closeSheet();
    $('#rYes').onclick = () => { state = { subs: [], settings: { ...DEFAULT_SETTINGS, onboarded: true } }; save(); closeSheet(true); go('pool'); render(); snack('已清除'); };
  };
}
$('#importFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  f.text().then(t => { const d = JSON.parse(t); if (!Array.isArray(d.subs)) throw 0;
    state = { subs: d.subs, settings: { ...DEFAULT_SETTINGS, ...d.settings } }; save(); go('pool'); render(); snack(`已匯入 ${d.subs.length} 筆訂閱`);
  }).catch(() => snack('檔案格式不正確')).finally(() => { e.target.value = ''; });
};

/* ---------- 通知 ---------- */
// Android App：用系統排程通知，扣款日前 N 天早上 9 點提醒，App 關閉也會跳出
let nativePerm = 'prompt', schedT = 0;
const LN = () => NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
async function requestNativeNotify() {
  const ln = LN(); if (!ln) return;
  try { nativePerm = (await ln.requestPermissions()).display; } catch (e) {}
  scheduleNative();
}
function scheduleNative() { if (!LN()) return; clearTimeout(schedT); schedT = setTimeout(doScheduleNative, 800); }
async function doScheduleNative() {
  const ln = LN();
  try {
    nativePerm = (await ln.checkPermissions()).display;
    if (nativePerm !== 'granted') return;
    const pend = await ln.getPending();
    if (pend.notifications.length) await ln.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
    const t = today(), end = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 75), now = Date.now(), days = new Map();
    state.subs.forEach(s => billDates(s, t, end).forEach(d => {
      const at = new Date(d.getFullYear(), d.getMonth(), d.getDate() - S().remindDays, 9, 0);
      if (+at <= now) return;
      const k = fmtD(at); if (!days.has(k)) days.set(k, { at, items: [] });
      days.get(k).items.push({ s, d });
    }));
    const list = [...days.values()].sort((a, b) => a.at - b.at).slice(0, 60).map((g, i) => {
      const sum = g.items.reduce((a, x) => a + perCharge(x.s), 0);
      return {
        id: 7000 + i,
        title: g.items.length > 1 ? `${g.items.length} 筆即將扣款 · ${money(sum)}` : `${g.items[0].s.name} 即將扣款 ${money(sum)}`,
        body: g.items.map(x => `${x.s.name} ${money(perCharge(x.s))}・${md(x.d)}${isInst(x.s) ? ` 第 ${instNo(x.s, x.d)}/${x.s.periods} 期` : ''}`).join('\n'),
        schedule: { at: g.at, allowWhileIdle: true },
      };
    });
    if (list.length) await ln.schedule({ notifications: list });
  } catch (e) { console.warn('schedule failed', e); }
}
async function notifyDue() {
  if (NATIVE) return scheduleNative();
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const k = fmtD(today()); if (S().lastNotify === k) return;
  const due = state.subs.map(s => ({ s, d: nextBill(s) })).filter(x => x.d && daysTo(x.d) <= S().remindDays);
  if (!due.length) return;
  S().lastNotify = k; save();
  const body = due.map(x => `${x.s.name} ${money(perCharge(x.s))}（${dueText(daysTo(x.d))}）`).join('\n');
  const title = `${due.length} 筆訂閱即將扣款`;
  try { const reg = await navigator.serviceWorker?.getRegistration(); if (reg) reg.showNotification(title, { body, icon: 'icon.svg', tag: 'due' }); else new Notification(title, { body }); } catch (e) {}
}

/* ============ 外殼：導覽、底部面板、Snackbar、返回鍵 ============ */
// 輕觸回饋：App 內用原生震動，瀏覽器用 vibrate（不支援就略過）
function haptic(kind = 'light') {
  try {
    const H = NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
    if (H) H.impact({ style: kind === 'medium' ? 'MEDIUM' : 'LIGHT' });
    else if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(kind === 'medium' ? 12 : 6);
  } catch (e) {}
}
// 選中指示：上方小橫條以彈簧曲線滑到目前分頁
function moveIndicator() {
  const ind = $('#dockInd'), on = $('#navbar .tab.on');
  if (!on) { ind.classList.add('off'); return; }
  const bar = $('#navbar .dock-bar').getBoundingClientRect(), r = on.getBoundingClientRect();
  ind.classList.remove('off');
  ind.style.transform = `translateX(${(r.left - bar.left + r.width / 2 - 12).toFixed(1)}px)`;
}
function go(v) {
  const changed = v !== view;
  view = v;
  $$('.view').forEach(x => x.hidden = x.id !== 'view-' + v);
  $$('#navbar .tab').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  moveIndicator();
  if (changed) $('#views').scrollTop = 0;
  if (v === 'pool') { pool.measure(); pool.start(); } else pool.stop();
  if (v === 'explore') renderExplore();
  if (v === 'bills') renderBills();
  if (v === 'insight') renderInsight();
  if (v === 'settings') renderSettings();
}
$$('#navbar .tab').forEach(b => b.onclick = () => { if (b.dataset.view !== view) haptic(); go(b.dataset.view); });
$('#dockAdd').onclick = () => { haptic('medium'); openAddMenu(); };
$('#exploreBack').onclick = () => go(lastTab);
window.addEventListener('resize', moveIndicator);
let lastTab = 'pool';

// 中央「＋」：選擇要新增的類型
function openAddMenu() {
  $('#dockAdd').classList.add('spin');
  setTimeout(() => $('#dockAdd').classList.remove('spin'), 420);
  if (view !== 'explore') lastTab = view;
  openSheet(`<h2>新增</h2>
    <div class="add-grid">
      <button data-add="sub"><span class="ai" style="--c:#2a78d6">${ico('search')}</span><b>新增訂閱</b><small>從 40 個常見服務挑選</small></button>
      <button data-add="inst"><span class="ai" style="--c:#eb6834">${instSvg('card')}</span><b>信用卡分期</b><small>買了什麼、分幾期</small></button>
      <button data-add="multi"><span class="ai" style="--c:#1baf7a">${ico('grid')}</span><b>快速多選</b><small>一次勾選多個服務</small></button>
      <button data-add="custom"><span class="ai" style="--c:#6250d6">${ico('upload')}</span><b>自訂訂閱</b><small>上傳 LOGO 自動取色</small></button>
    </div>`);
  $('#sheetBody .add-grid').onclick = e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    haptic();
    const k = b.dataset.add;
    if (k === 'sub') { closeSheet(); go('explore'); }
    else if (k === 'inst') openInst(null);
    else if (k === 'custom') openEditor(null);
    else { closeSheet(); openOnboard(false); }
  };
}

let sheetOpen = false;
function openSheet(html) {
  $('#sheetBody').innerHTML = html; $('#sheetBody').scrollTop = 0;
  if (!sheetOpen) { history.pushState({ sheet: 1 }, ''); sheetOpen = true; }
  $('#sheet').classList.add('show'); $('#scrim').classList.add('show');
}
function closeSheet(fromCode) {
  if (!sheetOpen) return; sheetOpen = false;
  $('#sheet').classList.remove('show'); $('#scrim').classList.remove('show'); $('#sheet').style.transform = '';
  if (fromCode !== 'pop') { skipPop = true; history.back(); }
}
let skipPop = false;
window.addEventListener('popstate', () => { if (skipPop) { skipPop = false; return; } if (sheetOpen) closeSheet('pop'); else if (!$('#onboard').hidden) $('#onboard').hidden = true; });
$('#scrim').onclick = () => closeSheet();
(() => { // 下滑關閉
  const h = $('#sheetHandle'), sh = $('#sheet'); let y0 = null, dy = 0;
  h.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; h.setPointerCapture(e.pointerId); sh.classList.add('dragging'); });
  h.addEventListener('pointermove', e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
  const end = () => { if (y0 == null) return; y0 = null; sh.classList.remove('dragging'); sh.style.transform = ''; if (dy > 90) closeSheet(); };
  h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
})();

let snackT;
function snack(text, action, fn) {
  const el = $('#snack'); $('#snackText').textContent = text; const b = $('#snackAction'); b.textContent = action || '';
  b.onclick = () => { el.classList.remove('show'); fn && fn(); };
  el.classList.add('show'); clearTimeout(snackT); snackT = setTimeout(() => el.classList.remove('show'), action ? 5000 : 2600);
}

/* ---------- 事件 ---------- */
$('#totalBtn').onclick = () => { S().period = S().period === 'year' ? 'month' : 'year'; save(); renderPool(); [...pool.nodes.values()].forEach(n => n.rShown = 0); };
$$('#groupSeg button').forEach(b => b.onclick = () => { S().group = b.dataset.mode; save(); renderPool(); pool.rescale(); });
$('#trash').innerHTML = ico('delete');
$('#emptyAdd').onclick = () => openOnboard(true);
$('#catChips').onclick = e => { const c = e.target.closest('.chip'); if (c) { exploreCat = c.dataset.cat; renderExplore(); } };
$('#searchInput').oninput = e => { query = e.target.value; renderExplore(); };
$('#serviceList').onclick = e => {
  if (e.target.closest('#instBtn')) return openInst(null);
  if (e.target.closest('#customBtn')) return openEditor(null);
  if (e.target.closest('#multiBtn')) return openOnboard(false);
  const it = e.target.closest('[data-svc]'); if (it) openAdd(it.dataset.svc);
};
$('#insightBody').onclick = e => {
  const bar = e.target.closest('[data-bar]'); if (bar) return showBar(+bar.dataset.bar);
  if (e.target.closest('#clearDone')) {
    const gone = state.subs.filter(instDone); state.subs = state.subs.filter(s => !instDone(s)); save(); render();
    return snack(`已清除 ${gone.length} 筆繳清的分期`, '復原', () => { state.subs.push(...gone); save(); render(); });
  }
  const it = e.target.closest('[data-open]'); if (it) openDetail(it.dataset.open);
};
$('#insightBody').addEventListener('pointerover', e => { const bar = e.target.closest('[data-bar]'); if (bar && e.pointerType === 'mouse') showBar(+bar.dataset.bar); });

/* ---------- 啟動 ---------- */
hydrateIcons();
requestAnimationFrame(moveIndicator);
pool = new Pool($('#stage'));
/* 手機網頁與 App：讀取加速度感應器，搖晃手機時泡泡跟著晃 */
const Motion = {
  g: null, ok: false,
  // iOS Safari 必須在使用者點擊（click / touchend）當下請求權限；'granted' | 'denied' | 'ask' | 'none'
  perm: typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function' ? 'ask' : 'none',
  init() {
    if (!('DeviceMotionEvent' in window)) return;
    window.addEventListener('devicemotion', e => this.on(e));
    if (this.perm === 'ask') {
      const ask = () => { if (S().shake && this.perm === 'ask') this.request(); if (this.perm !== 'ask') { document.removeEventListener('touchend', ask); document.removeEventListener('click', ask); } };
      document.addEventListener('touchend', ask); document.addEventListener('click', ask);
    }
  },
  request() {
    if ((this.perm !== 'ask' && this.perm !== 'denied') || this.pending) return;
    try {
      this.pending = true;
      DeviceMotionEvent.requestPermission().finally(() => { this.pending = false; }).then(r => {
        this.perm = r === 'granted' ? 'granted' : 'denied';
        if (view === 'settings') renderSettings();
        if (r !== 'granted') snack('未允許動作感應，搖晃泡泡無法使用（重新整理頁面可再次詢問）');
      }).catch(() => {}); // 不是在點擊當下呼叫：保持 'ask'，下次點擊再試
    } catch (e) {}
  },
  on(e) {
    let a = e.acceleration, lx, ly;
    if (a && a.x != null) { lx = a.x; ly = a.y; }
    else { // 只有含重力的數值：用低通濾波估出重力再扣掉
      const ag = e.accelerationIncludingGravity; if (!ag || ag.x == null) return;
      if (!this.g) this.g = { x: ag.x, y: ag.y };
      this.g.x += (ag.x - this.g.x) * .1; this.g.y += (ag.y - this.g.y) * .1;
      lx = ag.x - this.g.x; ly = ag.y - this.g.y;
    }
    this.ok = true;
    if (Math.hypot(lx, ly) < 1.5) return; // 忽略手持的細微晃動
    // 裝置座標（x 右、y 上）轉成螢幕座標（x 右、y 下），考慮橫向旋轉
    const ang = ((screen.orientation && screen.orientation.angle) ?? window.orientation ?? 0) * Math.PI / 180;
    const sx = lx * Math.cos(ang) + ly * Math.sin(ang), sy = -(-lx * Math.sin(ang) + ly * Math.cos(ang));
    const k = .45 * (e.interval > 0 ? clamp(e.interval * (e.interval < 1 ? 1000 : 1) / 16, .5, 3) : 1);
    pool.impulse(-sx * k, -sy * k);
  },
};
Motion.init();
render();
(async () => {
  if (NATIVE) await loadNative(); else await pull(); // 先載入最新資料，再決定是否顯示首次引導
  if (!S().onboarded && !state.subs.length) openOnboard(true);
  if (state.subs.length) { $('#poolHint').hidden = false; }
  notifyDue();
})();
setInterval(() => { renderPool(); }, 60 * 60 * 1000); // 跨日時更新扣款倒數
setInterval(() => { if (!document.hidden) pull(); }, 20000); // 其他裝置的變更
document.addEventListener('visibilitychange', () => { if (!document.hidden) pull(); });
window.addEventListener('online', pull);
if (!NATIVE && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
if (NATIVE) {
  document.documentElement.classList.add('native');
  pool.measure(); // App 的選單較低，泡泡範圍隨之放大
  // Android 返回鍵：先關面板 → 再回上一頁 → 回到泡泡頁 → 最後才把 App 退到背景
  const AppP = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (AppP) AppP.addListener('backButton', () => {
    if (sheetOpen) return closeSheet();
    if (!$('#onboard').hidden) { $('#onboard').hidden = true; S().onboarded = true; save(); return; }
    if (view === 'explore') return go(lastTab);
    if (view !== 'pool') return go('pool');
    AppP.minimizeApp();
  });
  // 第一次開啟就詢問通知權限（Android 13 以上需要）
  (async () => { const ln = LN(); if (!ln) return; try { nativePerm = (await ln.checkPermissions()).display; if (nativePerm === 'prompt' || nativePerm === 'prompt-with-rationale') await requestNativeNotify(); } catch (e) {} })();
}
