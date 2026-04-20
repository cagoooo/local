const XLSX = require('xlsx');
const { parseOldSheet: _discard } = {};

function normalizeName(s) { return String(s||'').replace(/\s+/g, '').replace(/[　]/g, '').trim(); }
function normalizeClass(s) {
  if (s == null) return '';
  let v = String(s).replace(/\s+/g, '').trim();
  v = v.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));
  const m = v.match(/(\d+)\s*年\s*(\d+)\s*班/);
  if (m) return `${m[1]}年${m[2]}班`;
  return v;
}
function normalizeSeat(s) { return String(s||'').replace(/\s+/g,'').replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)); }
function looksLikeClassroom(s) {
  return /(教室|課照|C\d{2,}|研習|智慧|美勞|電腦|自然|音樂|校史|魚寶屋|上課|學習中心)/.test(s);
}
function extractLanguages(content) {
  const s = String(content);
  const results = [];
  const patterns = [{re:/閩語/,name:'閩語'},{re:/客語/,name:'客語'},{re:/族語/,name:'族語'},{re:/新住民/,name:'新住民語'},{re:/台灣手語/,name:'台灣手語'},{re:/手語/,name:'手語'}];
  for (const p of patterns) if (p.re.test(s) && !results.includes(p.name)) results.push(p.name);
  return { display: results.join('/') || s.replace(/\d+/g, '').trim() };
}

function parseOldSheet(grid, out) {
  const classAnchors = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r] || [];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || '').trim();
      if (/^班級\s*[：:]/.test(cell)) {
        const className = normalizeClass(row[c + 1] || '');
        let teacher = '';
        for (let k = 2; k < 5; k++) {
          const v = String(row[c + k] || '').trim();
          if (/^(教師|導師)\s*[：:]/.test(v)) { teacher = String(row[c + k + 1] || '').trim(); break; }
        }
        if (className) classAnchors.push({ classRow: r, classCol: c, className, teacher });
      }
    }
  }
  if (!classAnchors.length) return;
  for (const a of classAnchors) {
    let langRow = -1;
    for (let r = a.classRow + 1; r < Math.min(a.classRow + 8, grid.length); r++) {
      const rowArr = grid[r] || [];
      for (let c = Math.max(0, a.classCol - 5); c < a.classCol + 8 && c < rowArr.length; c++) {
        if (/^語別\s*[：:]/.test(String(rowArr[c] || '').trim())) { langRow = r; break; }
      }
      if (langRow !== -1) break;
    }
    a.langRow = langRow;
    let headerRow = -1, bianhaoCol = -1;
    if (langRow !== -1) {
      for (let r = langRow + 1; r < Math.min(langRow + 6, grid.length); r++) {
        const rowArr = grid[r] || [];
        for (let c = Math.max(0, a.classCol - 5); c < a.classCol + 8 && c < rowArr.length; c++) {
          if (String(rowArr[c] || '').trim() === '編號') { headerRow = r; bianhaoCol = c; break; }
        }
        if (headerRow !== -1) break;
      }
    }
    a.headerRow = headerRow;
    a.bianhaoCol = bianhaoCol;
  }
  const valid = classAnchors.filter(a => a.bianhaoCol !== -1 && a.headerRow !== -1 && a.langRow !== -1);
  valid.sort((a, b) => a.classRow - b.classRow || a.bianhaoCol - b.bianhaoCol);
  const rg = {};
  for (const c of valid) { rg[c.classRow] = rg[c.classRow] || []; rg[c.classRow].push(c); }
  for (const cls of valid) {
    const peers = rg[cls.classRow];
    const next = peers[peers.indexOf(cls) + 1];
    cls.colEnd = next ? next.bianhaoCol : (grid[cls.classRow] ? Math.max(grid[cls.classRow].length + 2, cls.bianhaoCol + 12) : cls.bianhaoCol + 12);
  }
  for (const cls of valid) {
    const { bianhaoCol, headerRow, langRow, colEnd } = cls;
    const langCols = [];
    const langRowArr = grid[langRow] || [];
    for (let c = bianhaoCol; c < colEnd; c++) {
      const cell = String(langRowArr[c] || '').trim();
      if (/^語別\s*[：:]/.test(cell)) {
        const contentCol = c + 1;
        const content = String(langRowArr[contentCol] || '').trim();
        let extra = '';
        for (let k = 2; k <= 4 && c + k < colEnd; k++) {
          const v = String(langRowArr[c + k] || '').trim();
          if (/^語別\s*[：:]/.test(v)) break;
          if (v) extra += v;
        }
        const l = extractLanguages(content + extra);
        langCols.push({ labelCol: c, contentCol, language: l.display });
      }
    }
    if (!langCols.length) continue;
    const pairSet = new Set();
    const pairs = [];
    for (let r = headerRow; r < Math.min(grid.length, headerRow + 30); r++) {
      const row = grid[r] || [];
      const joined = row.slice(bianhaoCol, colEnd).map(x => String(x || '')).join('');
      if (joined.includes('總人數')) break;
      let c = bianhaoCol + 1;
      while (c < colEnd - 1) {
        const seatVal = String(row[c] || '').trim();
        const nameVal = String(row[c + 1] || '').trim();
        if (/^\d{1,3}$/.test(normalizeSeat(seatVal)) && /[\u4e00-\u9fff]/.test(nameVal) && !looksLikeClassroom(nameVal) && nameVal !== '姓名') {
          const key = `${c}-${c+1}`;
          if (!pairSet.has(key)) { pairSet.add(key); pairs.push({ seatCol: c, nameCol: c + 1 }); }
          c += 2;
        } else { c += 1; }
      }
    }
    if (!pairs.length) continue;
    pairs.sort((a, b) => a.seatCol - b.seatCol);
    for (const p of pairs) {
      let best = null, bestDist = Infinity;
      for (const lc of langCols) {
        const d = Math.min(Math.abs(lc.contentCol - p.seatCol), Math.abs(lc.contentCol - p.nameCol));
        if (d < bestDist) { bestDist = d; best = lc; }
      }
      p.language = best ? best.language : '';
    }
    for (let r = headerRow; r < grid.length; r++) {
      const row = grid[r] || [];
      const joined = row.slice(bianhaoCol, colEnd).map(x => String(x || '')).join('');
      if (joined.includes('總人數')) break;
      for (const p of pairs) {
        const seatRaw = String(row[p.seatCol] || '').trim();
        const nameRaw = String(row[p.nameCol] || '').trim();
        if (!nameRaw || !seatRaw) continue;
        if (nameRaw === '姓名' || seatRaw === '座號') continue;
        if (!/[\u4e00-\u9fff]/.test(nameRaw)) continue;
        if (looksLikeClassroom(nameRaw)) continue;
        const seat = normalizeSeat(seatRaw);
        if (!/^\d{1,3}$/.test(seat)) continue;
        const cleanName = nameRaw.replace(/\(.*?\)/g, '').trim();
        const tribe = (nameRaw.match(/\(([^)]+)\)/) || [])[1] || '';
        let lang = p.language;
        if (tribe && /手語|台灣手語/.test(tribe)) lang = '手語';
        else if (tribe && /阿美|泰雅|布農|排灣|賽德克|魯凱|卑南|鄒|太魯閣|撒奇萊雅|邵|噶瑪蘭|拉阿魯哇|卡那卡那富|雅美|達悟/.test(tribe)) lang = '族語';
        else if (tribe && /越南|泰語|印尼|柬埔寨|緬甸|馬來西亞|菲律賓/.test(tribe)) lang = '新住民語';
        out.push({ name: cleanName, rawName: nameRaw, oldClass: cls.className, oldSeat: seat, teacher: cls.teacher, language: lang, tribe });
      }
    }
  }
}

// Run full flow
const wbOld = XLSX.readFile('C:/Users/smes/Downloads/三年級_未分班.xlsx');
const oldStudents = [];
for (const sn of wbOld.SheetNames) parseOldSheet(XLSX.utils.sheet_to_json(wbOld.Sheets[sn], {header:1, defval:'', raw:false}), oldStudents);

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

const nameMap = new Map();
for (const s of newRoster) nameMap.set(normalizeName(s.name), s);

let matched = 0, unmatched = 0, changed = 0;
const unmatchedList = [];
for (const o of oldStudents) {
  const m = nameMap.get(normalizeName(o.name));
  if (m) { matched++; if (o.oldClass !== m.newClass) changed++; }
  else { unmatched++; unmatchedList.push(o); }
}
console.log(`舊名單: ${oldStudents.length} 人  |  新名冊: ${newRoster.length} 人`);
console.log(`✅ 已配對: ${matched} 筆 (${(matched/oldStudents.length*100).toFixed(1)}%)`);
console.log(`⚠️ 未配對: ${unmatched} 筆`);
console.log(`🔀 班級異動: ${changed} 筆`);

if (unmatchedList.length) {
  console.log('\n未配對學生 (前 5):');
  unmatchedList.slice(0, 5).forEach(s => console.log(`  - ${s.oldClass} #${s.oldSeat} ${s.rawName} [${s.language}]`));
}

console.log('\n配對範例 (前 5):');
for (let i = 0; i < 5; i++) {
  const o = oldStudents[i];
  const m = nameMap.get(normalizeName(o.name));
  if (m) {
    const chg = o.oldClass !== m.newClass ? '  🔀 異動' : '';
    console.log(`  ${o.rawName}: ${o.oldClass}#${o.oldSeat} → ${m.newClass}#${m.newSeat} [${o.language}]${chg}`);
  }
}
