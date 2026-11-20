/* 訂閱目錄：品牌色取自各品牌 LOGO 主色，價格為新台幣參考價（2026/11），使用者可自行修改 */
const PRICE_AS_OF = '2026/11';

const CATS = [
  { id: 'video', name: '影音' },
  { id: 'music', name: '音樂' },
  { id: 'ai',    name: 'AI' },
  { id: 'cloud', name: '雲端與工具' },
  { id: 'game',  name: '遊戲' },
  { id: 'life',  name: '生活' },
];

// icons/brands/<id>.png：512px。以下為白色單色向量 LOGO（Simple Icons / Wikimedia Commons），其餘為官方全彩 App 圖示
const LOGO_GLYPH = new Set(['netflix', 'ytp', 'appletv', 'spotify', 'applemusic', 'ytmusic', 'claude', 'gemini', 'perplexity', 'copilot',
  'icloud', 'dropbox', 'notion', 'psplus', 'arcade', 'appleone', 'uberone', 'pandapro', 'duolingo']);

// P(方案名, 價格, 週期 month|year|week, 幣別 TWD|USD)
const P = (name, price, cycle = 'month', cur = 'TWD') => ({ name, price, cycle, cur });

const SERVICES = [
  // 影音
  { id: 'netflix', name: 'Netflix', mono: 'N', cat: 'video', color: '#E50914',
    plans: [P('基本', 290), P('標準', 380), P('高級', 460)], verified: true },
  { id: 'disney', name: 'Disney+', mono: 'D+', cat: 'video', color: '#0B3D91', color2: '#13B8C8',
    plans: [P('標準', 270), P('高級', 320)] },
  { id: 'ytp', name: 'YouTube Premium', mono: 'YT', cat: 'video', color: '#FF0033',
    plans: [P('個人', 199), P('雙人', 299), P('家庭', 479), P('學生', 119)], verified: true },
  { id: 'hbomax', name: 'HBO Max', mono: 'HBO', cat: 'video', color: '#002BE7', color2: '#6A00F4',
    plans: [P('標準', 290), P('旗艦', 390)] },
  { id: 'prime', name: 'Prime Video', mono: 'PV', cat: 'video', color: '#1A98FF',
    plans: [P('月費', 99)] },
  { id: 'appletv', name: 'Apple TV', mono: 'tv', cat: 'video', color: '#111111',
    plans: [P('月費', 250)] },
  { id: 'myvideo', name: 'MyVideo', mono: 'my', cat: 'video', color: '#FF6A13',
    plans: [P('豪華月租', 250), P('年卡', 2388, 'year')] },
  { id: 'friday', name: 'friDay影音', mono: 'fri', cat: 'video', color: '#F2297A',
    plans: [P('全餐月租', 199)] },
  { id: 'kktv', name: 'KKTV', mono: 'KK', cat: 'video', color: '#14C3B4',
    plans: [P('VIP', 149)] },
  { id: 'hami', name: 'Hami Video', mono: 'Hami', cat: 'video', color: '#0093DD',
    plans: [P('影劇館', 199), P('年繳單館', 1990, 'year')] },
  { id: 'iqiyi', name: '愛奇藝', mono: '愛', cat: 'video', color: '#00BE06',
    plans: [P('黃金VIP', 199)] },
  { id: 'catchplay', name: 'CATCHPLAY+', mono: 'C+', cat: 'video', color: '#F04E23',
    plans: [P('月費', 150)] },
  { id: 'ani', name: '動畫瘋', mono: '動', cat: 'video', color: '#00A9E0',
    plans: [P('VIP', 99)] },
  { id: 'linetv', name: 'LINE TV', mono: 'LTV', cat: 'video', color: '#06C755',
    plans: [P('VIP', 149)] },

  // 音樂
  { id: 'spotify', name: 'Spotify', mono: 'S', cat: 'music', color: '#1DB954',
    plans: [P('個人', 149), P('雙人', 198), P('家庭', 268), P('學生', 75)] },
  { id: 'applemusic', name: 'Apple Music', mono: '♪', cat: 'music', color: '#FA243C', color2: '#FB5C74',
    plans: [P('個人', 165), P('家庭', 295, 'month'), P('學生', 85)] },
  { id: 'kkbox', name: 'KKBOX', mono: 'KK', cat: 'music', color: '#09CEF6',
    plans: [P('個人', 159), P('無損個人', 299), P('家庭', 240)] },
  { id: 'ytmusic', name: 'YouTube Music', mono: 'YM', cat: 'music', color: '#FF0000',
    plans: [P('個人', 149), P('家庭', 299)] },

  // AI
  { id: 'chatgpt', name: 'ChatGPT', mono: 'GPT', cat: 'ai', color: '#10A37F',
    plans: [P('Plus', 20, 'month', 'USD'), P('Pro', 200, 'month', 'USD')] },
  { id: 'claude', name: 'Claude', mono: 'C', cat: 'ai', color: '#D97757',
    plans: [P('Pro', 20, 'month', 'USD'), P('Max 5x', 100, 'month', 'USD'), P('Max 20x', 200, 'month', 'USD')] },
  { id: 'gemini', name: 'Google AI Pro', mono: 'G', cat: 'ai', color: '#1C7DFF', color2: '#B46FE6',
    plans: [P('AI Pro（含 2TB）', 650)] },
  { id: 'perplexity', name: 'Perplexity', mono: 'P', cat: 'ai', color: '#20808D',
    plans: [P('Pro', 20, 'month', 'USD')] },
  { id: 'copilot', name: 'Copilot Pro', mono: 'Co', cat: 'ai', color: '#0078D4', color2: '#E3008C',
    plans: [P('Pro', 20, 'month', 'USD')] },

  // 雲端與工具
  { id: 'icloud', name: 'iCloud+', mono: '☁', cat: 'cloud', color: '#3693F3',
    plans: [P('50GB', 30), P('200GB', 90), P('2TB', 300), P('6TB', 900), P('12TB', 1790)], verified: true },
  { id: 'googleone', name: 'Google One', mono: '1', cat: 'cloud', color: '#4285F4', color2: '#34A853',
    plans: [P('100GB', 65), P('2TB', 330)], verified: true },
  { id: 'm365', name: 'Microsoft 365', mono: 'M', cat: 'cloud', color: '#D83B01', color2: '#F25022',
    plans: [P('個人版', 2690, 'year'), P('家用版', 3290, 'year')] },
  { id: 'dropbox', name: 'Dropbox', mono: 'DB', cat: 'cloud', color: '#0061FF',
    plans: [P('Plus', 11.99, 'month', 'USD')] },
  { id: 'notion', name: 'Notion', mono: 'N', cat: 'cloud', color: '#191919',
    plans: [P('Plus', 12, 'month', 'USD')] },
  { id: 'adobe', name: 'Adobe CC', mono: 'Ac', cat: 'cloud', color: '#DA1F26',
    plans: [P('攝影計畫', 335), P('全部應用程式', 1950)] },
  { id: 'canva', name: 'Canva Pro', mono: 'Ca', cat: 'cloud', color: '#00C4CC', color2: '#7D2AE8',
    plans: [P('個人年費', 120, 'year', 'USD')] },

  // 遊戲
  { id: 'nso', name: 'Switch Online', mono: 'NS', cat: 'game', color: '#E60012',
    plans: [P('個人', 600, 'year'), P('擴充包', 1190, 'year')] },
  { id: 'psplus', name: 'PlayStation Plus', mono: 'PS', cat: 'game', color: '#0070D1',
    plans: [P('Essential', 1948, 'year'), P('Extra', 3368, 'year'), P('Premium', 4168, 'year')] },
  { id: 'gamepass', name: 'Xbox Game Pass', mono: 'X', cat: 'game', color: '#107C10',
    plans: [P('Essential', 279), P('Premium', 419), P('Ultimate', 899)] },
  { id: 'arcade', name: 'Apple Arcade', mono: 'A', cat: 'game', color: '#FF3B30', color2: '#FF9500',
    plans: [P('月費', 150)] },

  // 生活
  { id: 'appleone', name: 'Apple One', mono: '1', cat: 'life', color: '#1D1D1F', color2: '#5E5CE6',
    plans: [P('個人', 330), P('家庭', 490)], verified: true },
  { id: 'uberone', name: 'Uber One', mono: 'U', cat: 'life', color: '#000000',
    plans: [P('月費', 120), P('年費', 1200, 'year')] },
  { id: 'pandapro', name: 'pandapro', mono: 'pp', cat: 'life', color: '#D70F64',
    plans: [P('月費', 89)] },
  { id: 'costco', name: 'Costco 會員', mono: 'Co', cat: 'life', color: '#E31837', color2: '#005DAA',
    plans: [P('金星', 1350, 'year'), P('商業', 1150, 'year')] },
  { id: 'duolingo', name: 'Duolingo', mono: 'Duo', cat: 'life', color: '#58CC02',
    plans: [P('Super 年費', 2390, 'year')] },
  { id: 'linkedin', name: 'LinkedIn Premium', mono: 'in', cat: 'life', color: '#0A66C2',
    plans: [P('Career', 29.99, 'month', 'USD')] },
];
