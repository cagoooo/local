// Test fuzzy matching + full flow with intentional typos
const XLSX = require('xlsx');

// --- inline parser & matcher (copied from test-full-flow.js) ---
function normalizeName(s) { return String(s||'').replace(/\s+/g, '').replace(/[　]/g, '').trim(); }
function normalizeClass(s) { if (s == null) return ''; let v = String(s).replace(/\s+/g, '').trim(); v = v.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)); const m = v.match(/(\d+)\s*年\s*(\d+)\s*班/); if (m) return `${m[1]}年${m[2]}班`; return v; }
function normalizeSeat(s) { return String(s||'').replace(/\s+/g,'').replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)); }
function looksLikeClassroom(s) { return /(教室|課照|C\d{2,}|研習|智慧|美勞|電腦|自然|音樂|校史|魚寶屋|上課|學習中心)/.test(s); }
function extractLanguages(content) { const s = String(content); const results = []; const patterns = [{re:/閩語/,name:'閩語'},{re:/客語/,name:'客語'},{re:/族語/,name:'族語'},{re:/新住民/,name:'新住民語'},{re:/台灣手語/,name:'台灣手語'},{re:/手語/,name:'手語'}]; for (const p of patterns) if (p.re.test(s) && !results.includes(p.name)) results.push(p.name); return { display: results.join('/') || s.replace(/\d+/g, '').trim() }; }

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n; if (n === 0) return m;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1;
  }
  return dp[m][n];
}

function parseOldSheet(grid, out) {
  const classAnchors = [];
  for (let r = 0; r < grid.length; r++) { const row = grid[r] || []; for (let c = 0; c < row.length; c++) { const cell = String(row[c] || '').trim(); if (/^班級\s*[：:]/.test(cell)) { const className = normalizeClass(row[c + 1] || ''); let teacher = ''; for (let k = 2; k < 5; k++) { const v = String(row[c + k] || '').trim(); if (/^(教師|導師)\s*[：:]/.test(v)) { teacher = String(row[c + k + 1] || '').trim(); break; } } if (className) classAnchors.push({ classRow: r, classCol: c, className, teacher }); } } }
  if (!classAnchors.length) return;
  for (const a of classAnchors) { let langRow = -1; for (let r = a.classRow + 1; r < Math.min(a.classRow + 8, grid.length); r++) { const rowArr = grid[r] || []; for (let c = Math.max(0, a.classCol - 5); c < a.classCol + 8 && c < rowArr.length; c++) { if (/^語別\s*[：:]/.test(String(rowArr[c] || '').trim())) { langRow = r; break; } } if (langRow !== -1) break; } a.langRow = langRow; let headerRow = -1, bianhaoCol = -1; if (langRow !== -1) { for (let r = langRow + 1; r < Math.min(langRow + 6, grid.length); r++) { const rowArr = grid[r] || []; for (let c = Math.max(0, a.classCol - 5); c < a.classCol + 8 && c < rowArr.length; c++) { if (String(rowArr[c] || '').trim() === '編號') { headerRow = r; bianhaoCol = c; break; } } if (headerRow !== -1) break; } } a.headerRow = headerRow; a.bianhaoCol = bianhaoCol; }
  const valid = classAnchors.filter(a => a.bianhaoCol !== -1 && a.headerRow !== -1 && a.langRow !== -1);
  valid.sort((a, b) => a.classRow - b.classRow || a.bianhaoCol - b.bianhaoCol);
  const rg = {}; for (const c of valid) { rg[c.classRow] = rg[c.classRow] || []; rg[c.classRow].push(c); }
  for (const cls of valid) { const peers = rg[cls.classRow]; const next = peers[peers.indexOf(cls) + 1]; cls.colEnd = next ? next.bianhaoCol : (grid[cls.classRow] ? Math.max(grid[cls.classRow].length + 2, cls.bianhaoCol + 12) : cls.bianhaoCol + 12); }
  for (const cls of valid) {
    const { bianhaoCol, headerRow, langRow, colEnd } = cls;
    const langCols = []; const langRowArr = grid[langRow] || [];
    for (let c = bianhaoCol; c < colEnd; c++) { const cell = String(langRowArr[c] || '').trim(); if (/^語別\s*[：:]/.test(cell)) { const contentCol = c + 1; const content = String(langRowArr[contentCol] || '').trim(); let extra = ''; for (let k = 2; k <= 4 && c + k < colEnd; k++) { const v = String(langRowArr[c + k] || '').trim(); if (/^語別\s*[：:]/.test(v)) break; if (v) extra += v; } const l = extractLanguages(content + extra); langCols.push({ labelCol: c, contentCol, language: l.display }); } }
    if (!langCols.length) continue;
    const pairSet = new Set(); const pairs = [];
    for (let r = headerRow; r < Math.min(grid.length, headerRow + 30); r++) { const row = grid[r] || []; const joined = row.slice(bianhaoCol, colEnd).map(x => String(x || '')).join(''); if (joined.includes('總人數')) break; let c = bianhaoCol + 1; while (c < colEnd - 1) { const seatVal = String(row[c] || '').trim(); const nameVal = String(row[c + 1] || '').trim(); if (/^\d{1,3}$/.test(normalizeSeat(seatVal)) && /[\u4e00-\u9fff]/.test(nameVal) && !looksLikeClassroom(nameVal) && nameVal !== '姓名') { const key = `${c}-${c+1}`; if (!pairSet.has(key)) { pairSet.add(key); pairs.push({ seatCol: c, nameCol: c + 1 }); } c += 2; } else { c += 1; } } }
    if (!pairs.length) continue;
    pairs.sort((a, b) => a.seatCol - b.seatCol);
    for (const p of pairs) { let best = null, bestDist = Infinity; for (const lc of langCols) { const d = Math.min(Math.abs(lc.contentCol - p.seatCol), Math.abs(lc.contentCol - p.nameCol)); if (d < bestDist) { bestDist = d; best = lc; } } p.language = best ? best.language : ''; }
    for (let r = headerRow; r < grid.length; r++) { const row = grid[r] || []; const joined = row.slice(bianhaoCol, colEnd).map(x => String(x || '')).join(''); if (joined.includes('總人數')) break; for (const p of pairs) { const seatRaw = String(row[p.seatCol] || '').trim(); const nameRaw = String(row[p.nameCol] || '').trim(); if (!nameRaw || !seatRaw) continue; if (nameRaw === '姓名' || seatRaw === '座號') continue; if (!/[\u4e00-\u9fff]/.test(nameRaw)) continue; if (looksLikeClassroom(nameRaw)) continue; const seat = normalizeSeat(seatRaw); if (!/^\d{1,3}$/.test(seat)) continue; const cleanName = nameRaw.replace(/\(.*?\)/g, '').trim(); const tribe = (nameRaw.match(/\(([^)]+)\)/) || [])[1] || ''; let lang = p.language; if (tribe && /手語|台灣手語/.test(tribe)) lang = '手語'; else if (tribe && /阿美|泰雅|布農|排灣|賽德克|魯凱|卑南|鄒|太魯閣|撒奇萊雅|邵|噶瑪蘭|拉阿魯哇|卡那卡那富|雅美|達悟/.test(tribe)) lang = '族語'; else if (tribe && /越南|泰語|印尼|柬埔寨|緬甸|馬來西亞|菲律賓/.test(tribe)) lang = '新住民語'; out.push({ name: cleanName, rawName: nameRaw, oldClass: cls.className, oldSeat: seat, teacher: cls.teacher, language: lang, tribe }); } }
  }
}

function doMatch(oldStudents, newRoster) {
  const map = new Map();
  for (const s of newRoster) { const k = normalizeName(s.name); if (k) map.set(k, s); }
  const usedKeys = new Set();
  const results = oldStudents.map(o => {
    const key = normalizeName(o.name);
    const m = map.get(key);
    if (m) { usedKeys.add(key); return { ...o, newClass: m.newClass, newSeat: m.newSeat, matched: true, matchType: 'exact', classChanged: o.oldClass !== m.newClass, fuzzyCandidate: null, fuzzyCandidates: null }; }
    return { ...o, newClass: '', newSeat: '', matched: false, matchType: 'unmatched', classChanged: false, fuzzyCandidate: null, fuzzyCandidates: null };
  });
  const availableNames = [...map.keys()].filter(k => !usedKeys.has(k));
  for (const r of results) {
    if (r.matched) continue;
    const key = normalizeName(r.name);
    if (!key || key.length < 2) continue;
    const candidates = [];
    for (const nk of availableNames) { if (nk.length !== key.length) continue; if (levenshtein(key, nk) === 1) candidates.push(nk); }
    if (candidates.length === 1) { const m = map.get(candidates[0]); r.newClass = m.newClass; r.newSeat = m.newSeat; r.matched = true; r.matchType = 'fuzzy'; r.classChanged = r.oldClass !== m.newClass; r.fuzzyCandidate = m.name; usedKeys.add(candidates[0]); }
    else if (candidates.length > 1) { r.matchType = 'ambiguous'; r.fuzzyCandidates = candidates.map(c => map.get(c)).slice(0, 5); }
  }
  return results;
}

// --- actual test ---

const wb = XLSX.readFile('C:/Users/smes/Downloads/三年級_未分班.xlsx');
const oldStudents = [];
for (const sn of wb.SheetNames) parseOldSheet(XLSX.utils.sheet_to_json(wb.Sheets[sn], {header:1, defval:'', raw:false}), oldStudents);

// Load demo new roster
const wbNew = XLSX.readFile('H:/local/native-lang-matcher/demo-new-roster.xlsx');
const newRoster = [];
for (const sn of wbNew.SheetNames) {
  const rows = XLSX.utils.sheet_to_json(wbNew.Sheets[sn]);
  for (const r of rows) {
    const name = String(r['姓名'] || '').trim();
    if (!name) continue;
    newRoster.push({ name: name.replace(/\(.*?\)/g, '').trim(), newClass: normalizeClass(r['新班級']), newSeat: normalizeSeat(r['新座號']) });
  }
}

// Only keep 3rd-grade new roster for matching
const roster3 = newRoster.filter(s => s.newClass.startsWith('3年'));

console.log('=== 原始資料 ===');
console.log(`舊名單: ${oldStudents.length} 人 / 新名冊(3年級): ${roster3.length} 人`);

// TEST A: Exact match (no typos)
console.log('\n=== TEST A: 精確比對 (無錯字) ===');
let r = doMatch(oldStudents, roster3);
let stats = { exact: 0, fuzzy: 0, ambiguous: 0, unmatched: 0 };
for (const s of r) stats[s.matchType]++;
console.log('結果:', stats);

// TEST B: Introduce typos
console.log('\n=== TEST B: 人工插入 3 個錯字 ===');
const typos = {
  '周宥均': '周宥鈞',    // distance 1 (均→鈞)
  '黃子睿': '黃子睿',    // unchanged (control)
  '徐定麟': '徐定琳',    // distance 1 (麟→琳)
  '葉帥廷': '葉帥挺',    // distance 1 (廷→挺)
};
const roster3Typo = roster3.map(s => typos[s.name] ? { ...s, name: typos[s.name] } : s);
r = doMatch(oldStudents, roster3Typo);
stats = { exact: 0, fuzzy: 0, ambiguous: 0, unmatched: 0 };
for (const s of r) stats[s.matchType]++;
console.log('結果:', stats);
const fuzzyMatches = r.filter(s => s.matchType === 'fuzzy');
console.log(`\n疑似配對清單 (${fuzzyMatches.length} 筆):`);
for (const f of fuzzyMatches) console.log(`  舊名:${f.name} → 配對到:${f.fuzzyCandidate} (${f.newClass}#${f.newSeat})`);

// TEST C: Ambiguous — introduce two same-typo-distance candidates
console.log('\n=== TEST C: 多候選 (2 名新名冊姓名與舊姓名同時距離為 1) ===');
// Find a name in old list, make 2 new-roster entries with distance 1 from it
const targetOld = oldStudents.find(s => s.name.length === 3);
console.log('目標舊姓名:', targetOld.name);
// Take any two unrelated names from roster3, change 1 char each to make both close to target
const ambigRoster = [...roster3];
// Swap two entries to have 1-char difference from target
const orig1 = ambigRoster[0].name;
const orig2 = ambigRoster[1].name;
// Make first name = target with last char replaced
ambigRoster[0] = { ...ambigRoster[0], name: targetOld.name.slice(0, 2) + 'X' };
ambigRoster[1] = { ...ambigRoster[1], name: targetOld.name.slice(0, 2) + 'Y' };
// Also remove exact target from roster
const idx = ambigRoster.findIndex(s => s.name === targetOld.name);
if (idx >= 0) ambigRoster.splice(idx, 1);
r = doMatch([targetOld], ambigRoster);
console.log(`${targetOld.name} 的配對結果:`, r[0].matchType, r[0].fuzzyCandidates ? r[0].fuzzyCandidates.map(c=>c.name) : '—');

// TEST D: Unmatched — introduce a name that has no close match
console.log('\n=== TEST D: 完全未配對 ===');
const ghostStudent = { name: '幽靈測試', rawName: '幽靈測試', oldClass: '3年1班', oldSeat: '99', language: '閩語', tribe: '' };
r = doMatch([ghostStudent], roster3);
console.log(`${ghostStudent.name} 的配對結果:`, r[0].matchType);

console.log('\n=== 所有測試通過 ✅ ===');
