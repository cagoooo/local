/**
 * test-formats.js — 檔案格式相容性測試
 *
 * 直接從 index.html 抽出真正在跑的解析函式(不複製一份,避免測試與實作走鐘),
 * 餵各種真實/合成的名冊格式,驗證:
 *   1. 舊名單:矩陣式、一列一生表格、班級標題式
 *   2. 新名冊:含座號 / 不含座號 / 班級只寫在首列
 *   3. CSV(UTF-8 / Big5)
 *   4. 語別分類(閩南語、四縣腔、賽考利克泰雅語、緬甸語、臺灣手語…)
 *
 * 執行:node test-formats.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

// ── 從 index.html 抽出指定的頂層宣告 ────────────────────────
const NEEDED = [
  'lastHeaderSamples', 'HEADER_PATTERNS', 'LANG_RULES', 'TAG_CLASS_BY_CAT', 'TEXT_FILE_RE',
  'normalizeClass', 'normalizeSeat', 'looksLikeClassroom', 'languageCategory', 'langTagClass',
  'extractLanguages', 'extractTribe', 'findHeaderRow', 'collectHeaderSample',
  'parseOldWorkbook', 'parseOldSheet', 'trySimpleOldList',
  'parseNewRoster', 'trySimpleRoster', 'tryMatrixRoster', 'decodeTextBytes'
];

// index.html 的頂層宣告一律從第 0 欄開始,結尾也在第 0 欄(`}` / `];` / `;`),
// 靠這個縮排慣例切段比數括號可靠(regex 裡的括號會把括號計數器帶歪)。
function extractDecl(lines, name) {
  const startRe = new RegExp(`^(?:function ${name}\\(|const ${name}\\b|let ${name}\\b)`);
  const start = lines.findIndex(l => startRe.test(l));
  if (start === -1) throw new Error(`index.html 找不到宣告:${name}`);
  if (/;\s*$/.test(lines[start]) && !/[{[]\s*$/.test(lines[start])) return lines[start];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^(\}|\];|\);)/.test(lines[i])) return lines.slice(start, i + 1).join('\n');
  }
  throw new Error(`抽取 ${name} 失敗`);
}

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const htmlLines = html.split('\n');
const code = NEEDED.map(n => extractDecl(htmlLines, n)).join('\n\n');
const ctx = { XLSX, TextDecoder, console, module: {}, exports: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
// `let` 宣告不會掛到 context 物件上,要用求值的方式讀
const headerSamples = () => vm.runInContext('lastHeaderSamples', ctx);

// ── 測試工具 ────────────────────────────────────────────────
let pass = 0, fail = 0;
function check(label, cond, detail) {
  if (cond) { pass++; console.log(`  ✅ ${label}`); }
  else { fail++; console.log(`  ❌ ${label}${detail ? '  → ' + detail : ''}`); }
}
function sheetOf(aoa) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), '工作表1');
  return wb;
}

// ── 1. 語別分類 ─────────────────────────────────────────────
console.log('\n[1] 語別分類(校務系統直接寫方言名)');
const LANG_CASES = [
  ['閩南語', '閩語'], ['閩語', '閩語'], ['台語', '閩語'],
  ['四縣腔', '客語'], ['海陸腔', '客語'], ['南四縣腔', '客語'], ['大埔腔', '客語'],
  ['饒平腔', '客語'], ['詔安腔', '客語'], ['客語', '客語'],
  ['賽考利克泰雅語', '族語'], ['汶水泰雅語', '族語'], ['郡群布農語', '族語'],
  ['海岸阿美語', '族語'], ['南勢阿美語', '族語'], ['秀姑巒阿美語', '族語'],
  ['太魯閣語', '族語'], ['東排灣語', '族語'], ['霧台魯凱語', '族語'],
  ['卡那卡那富語', '族語'], ['拉阿魯哇語', '族語'], ['噶瑪蘭語', '族語'],
  ['雅美語', '族語'], ['族語', '族語'],
  ['越南語', '新住民語'], ['印尼語', '新住民語'], ['緬甸語', '新住民語'],
  ['泰國語', '新住民語'], ['柬埔寨語', '新住民語'], ['菲律賓語', '新住民語'],
  ['馬來語', '新住民語'], ['新住民語文', '新住民語'],
  ['臺灣手語', '手語'], ['台灣手語', '手語'], ['手語', '手語'],
  ['', '其他']
];
for (const [input, expect] of LANG_CASES) {
  const got = ctx.languageCategory(input);
  check(`${input || '(空白)'} → ${expect}`, got === expect, `實際 ${got}`);
}

// ── 2. 舊名單:一列一位學生的表格(使用者回報的格式)────────────
console.log('\n[2] 舊名單 — 一列一生表格(姓名/選擇語別/班級/座號)');
{
  const aoa = [
    ['姓名', '選擇語別', '班級', '座號'],
    ['王衣玄', '閩南語', '1年1班', '1'],
    ['王想想', '臺灣手語', '1年1班', '3'],
    ['王語昕', '四縣腔', '1年1班', '4'],
    ['田宥崴', '汶水泰雅語', '1年1班', '5'],
    ['吳宸緯', '緬甸語', '1年1班', '15'],
    ['李鄧禾安', '賽考利克泰雅語', '1年2班', '1']
  ];
  const r = ctx.parseOldWorkbook(sheetOf(aoa));
  check('解析出 6 位學生', r.length === 6, `實際 ${r.length}`);
  check('姓名/班級/座號正確', r[0].name === '王衣玄' && r[0].oldClass === '1年1班' && r[0].oldSeat === '1');
  check('語別保留原文', r[2].language === '四縣腔');
  check('族語方言自動填入族別欄', r[3].tribe === '汶水泰雅語', `實際 "${r[3].tribe}"`);
  check('跨班級正確切換', r[5].oldClass === '1年2班');
  const cats = r.map(s => ctx.languageCategory(s.language));
  check('分類:閩/手/客/族/新住民/族', cats.join(',') === '閩語,手語,客語,族語,新住民語,族語', cats.join(','));
}

// ── 3. 舊名單:欄位順序不同 + 別名 + 班級只寫首列 ────────────
console.log('\n[3] 舊名單 — 欄位別名、順序不同、班級只寫首列');
{
  const aoa = [
    ['本校 115 學年度本土語言選修調查'],
    [],
    ['班別', '號碼', '學生姓名', '本土語言', '導師'],
    ['三年一班', '1', '陳小明', '閩南語', '林老師'],
    ['', '2', '林小華', '海陸腔', ''],
    ['', '3', '張小美(阿美族)', '南勢阿美語', ''],
    ['三年二班', '1', '李小強', '越南語', '王老師'],
    ['', '', '總人數: 4 人']
  ];
  const r = ctx.parseOldWorkbook(sheetOf(aoa));
  check('解析出 4 位學生', r.length === 4, `實際 ${r.length}`);
  check('班級沿用上一列非空值', r[1].oldClass === '3年1班' && r[2].oldClass === '3年1班', r.map(s => s.oldClass).join(','));
  check('導師沿用', r[1].teacher === '林老師');
  check('姓名去括號、族別入欄', r[2].name === '張小美' && r[2].tribe === '阿美族');
  check('第二班切換 + 導師更新', r[3].oldClass === '3年2班' && r[3].teacher === '王老師');
  check('「總人數」列不被當學生', r.every(s => !s.name.includes('總人數')));
}

// ── 4. 舊名單:原本的矩陣格式不能被改壞 ─────────────────────
console.log('\n[4] 舊名單 — 既有矩陣格式(回歸測試)');
{
  const aoa = [
    ['班級:', '3年1班', '教師:', '林老師'],
    ['語別:', '閩語3', '', '語別:', '客語2'],
    ['編號', '座號', '姓名', '座號', '姓名'],
    [1, '1', '陳小明', '5', '劉小客'],
    [2, '2', '林小華', '7', '徐小平'],
    [3, '3', '王小台', '', ''],
    ['總人數: 5 人']
  ];
  const r = ctx.parseOldWorkbook(sheetOf(aoa));
  check('解析出 5 位學生', r.length === 5, `實際 ${r.length}`);
  check('班級/教師正確', r[0].oldClass === '3年1班' && r[0].teacher === '林老師');
  const 閩 = r.filter(s => s.language === '閩語').length;
  const 客 = r.filter(s => s.language === '客語').length;
  check('閩 3 客 2', 閩 === 3 && 客 === 2, `閩${閩} 客${客}`);
}

// ── 5. 新名冊:座號缺漏 / 班級只寫首列 ───────────────────────
console.log('\n[5] 新名冊 — 座號可缺、班級只寫首列');
{
  const withSeat = ctx.parseNewRoster(sheetOf([
    ['姓名', '新班級', '新座號'],
    ['吳悠', '3年1班', '1'],
    ['魏慈', '3年1班', '2']
  ]));
  check('標準三欄仍正常', withSeat.length === 2 && withSeat[0].newSeat === '1');

  const noSeat = ctx.parseNewRoster(sheetOf([
    ['姓名', '班級'],
    ['吳悠', '3年1班'],
    ['魏慈', '3年1班']
  ]));
  check('無座號欄也能解析(舊版會失敗)', noSeat.length === 2, `實際 ${noSeat.length}`);
  check('無座號時 newSeat 留空', noSeat[0].newSeat === '');

  const sparse = ctx.parseNewRoster(sheetOf([
    ['班級', '座號', '姓名'],
    ['3年1班', '1', '吳悠'],
    ['', '2', '魏慈'],
    ['3年2班', '1', '劉建豪']
  ]));
  check('班級沿用 + 切換', sparse.map(s => s.newClass).join(',') === '3年1班,3年1班,3年2班', sparse.map(s => s.newClass).join(','));
}

// ── 6. CSV(UTF-8 / Big5)────────────────────────────────────
console.log('\n[6] CSV 編碼');
{
  const csv = '姓名,選擇語別,班級,座號\n王衣玄,閩南語,1年1班,1\n王語昕,四縣腔,1年1班,4\n';
  const utf8 = Buffer.from(csv, 'utf8');
  const decodedUtf8 = ctx.decodeTextBytes(new Uint8Array(utf8));
  check('UTF-8 CSV 解碼正確', decodedUtf8.includes('王衣玄'));

  const bom = Buffer.concat([Buffer.from([0xEF, 0xBB, 0xBF]), utf8]);
  check('UTF-8 BOM 被剝除', ctx.decodeTextBytes(new Uint8Array(bom)).startsWith('姓名'));

  let big5;
  try {
    big5 = new (require('iconv-lite'))
  } catch (e) { big5 = null; }
  // 沒有 iconv-lite 就用手工 Big5 位元組驗證解碼器不會拋錯
  const fakeBig5 = new Uint8Array([0xA9, 0x6D, 0xA6, 0x57, 0x0D, 0x0A]); // 「姓名」的 Big5
  let big5Text = '';
  let big5Err = null;
  try { big5Text = ctx.decodeTextBytes(fakeBig5); } catch (e) { big5Err = e; }
  check('Big5 位元組不會拋錯', !big5Err, big5Err && big5Err.message);
  if (typeof TextDecoder === 'function') {
    let supportsBig5 = true;
    try { new TextDecoder('big5'); } catch (e) { supportsBig5 = false; }
    if (supportsBig5) check('Big5 解出「姓名」', big5Text.startsWith('姓名'), JSON.stringify(big5Text));
    else console.log('  ⏭  此 Node 版本不支援 big5 解碼(瀏覽器支援),略過');
  }

  const wb = XLSX.read(decodedUtf8, { type: 'string', raw: false });
  const r = ctx.parseOldWorkbook(wb);
  check('CSV 走舊名單解析出 2 位', r.length === 2, `實際 ${r.length}`);
}

// ── 7. 解析失敗時要回報看到的欄位 ───────────────────────────
console.log('\n[7] 解析失敗時的欄位提示');
{
  const r = ctx.parseOldWorkbook(sheetOf([
    ['流水號', '身分證字號', '生日'],
    ['1', 'A123456789', '2018/01/01']
  ]));
  check('無法解析 → 0 筆', r.length === 0);
  check('有記錄看到的欄位', headerSamples().length > 0 && headerSamples()[0].cells.includes('流水號'),
    JSON.stringify(headerSamples()));
}

// ── 8. 真實檔案(若存在)──────────────────────────────────────
console.log('\n[8] 真實檔案');
{
  const real = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Downloads', '1年級_未分班.xlsx');
  if (fs.existsSync(real)) {
    const r = ctx.parseOldWorkbook(XLSX.readFile(real));
    check(`${path.basename(real)} 解析出 113 位`, r.length === 113, `實際 ${r.length}`);
    const other = r.filter(s => ctx.languageCategory(s.language) === '其他');
    check('沒有語別被歸為「其他」', other.length === 0,
      other.slice(0, 5).map(s => `${s.name}/${s.language}`).join(', '));
    const classes = new Set(r.map(s => s.oldClass));
    check('班級數 > 1', classes.size > 1, [...classes].join(','));
  } else {
    console.log('  ⏭  找不到 ' + real + ',略過');
  }
}

console.log(`\n${'─'.repeat(50)}\n通過 ${pass} / 失敗 ${fail}\n`);
process.exit(fail ? 1 : 0);
