const XLSX = require('xlsx');

function normalizeClass(s) {
  if (s == null) return '';
  let v = String(s).replace(/\s+/g, '').trim();
  v = v.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));
  const m = v.match(/(\d+)\s*年\s*(\d+)\s*班/);
  if (m) return `${m[1]}年${m[2]}班`;
  return v;
}
function normalizeSeat(s) {
  if (s == null || s === '') return '';
  return String(s).replace(/\s+/g, '').replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));
}
function looksLikeClassroom(s) {
  return /(教室|課照|C\d{2,}|研習|智慧|美勞|電腦|自然|音樂|校史|魚寶屋|上課|學習中心)/.test(s);
}
function extractLanguages(content) {
  const s = String(content);
  const results = [];
  const patterns = [
    { re: /閩語/, name: '閩語' },
    { re: /客語/, name: '客語' },
    { re: /族語/, name: '族語' },
    { re: /新住民/, name: '新住民語' },
    { re: /台灣手語/, name: '台灣手語' },
    { re: /手語/, name: '手語' }
  ];
  for (const p of patterns) {
    if (p.re.test(s) && !results.includes(p.name)) results.push(p.name);
  }
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
  if (classAnchors.length === 0) return;

  for (const a of classAnchors) {
    let langRow = -1;
    for (let r = a.classRow + 1; r < Math.min(a.classRow + 8, grid.length); r++) {
      const rowArr = grid[r] || [];
      const nearStart = Math.max(0, a.classCol - 5);
      const nearEnd = a.classCol + 8;
      for (let c = nearStart; c < nearEnd && c < rowArr.length; c++) {
        if (/^語別\s*[：:]/.test(String(rowArr[c] || '').trim())) { langRow = r; break; }
      }
      if (langRow !== -1) break;
    }
    a.langRow = langRow;
    let headerRow = -1, bianhaoCol = -1;
    if (langRow !== -1) {
      for (let r = langRow + 1; r < Math.min(langRow + 6, grid.length); r++) {
        const rowArr = grid[r] || [];
        const nearStart = Math.max(0, a.classCol - 5);
        const nearEnd = a.classCol + 8;
        for (let c = nearStart; c < nearEnd && c < rowArr.length; c++) {
          if (String(rowArr[c] || '').trim() === '編號') { headerRow = r; bianhaoCol = c; break; }
        }
        if (headerRow !== -1) break;
      }
    }
    a.headerRow = headerRow;
    a.bianhaoCol = bianhaoCol;
  }
  const validClasses = classAnchors.filter(a => a.bianhaoCol !== -1 && a.headerRow !== -1 && a.langRow !== -1);
  validClasses.sort((a, b) => a.classRow - b.classRow || a.bianhaoCol - b.bianhaoCol);
  const rowGroups = {};
  for (const c of validClasses) { rowGroups[c.classRow] = rowGroups[c.classRow] || []; rowGroups[c.classRow].push(c); }
  for (const cls of validClasses) {
    const peers = rowGroups[cls.classRow];
    const idx = peers.indexOf(cls);
    const next = peers[idx + 1];
    cls.colEnd = next ? next.bianhaoCol : (grid[cls.classRow] ? Math.max(grid[cls.classRow].length + 2, cls.bianhaoCol + 12) : cls.bianhaoCol + 12);
  }

  for (const cls of validClasses) {
    const { bianhaoCol, headerRow, langRow, colEnd } = cls;
    const langCols = [];
    const langRowArr = grid[langRow] || [];
    for (let c = bianhaoCol; c < colEnd; c++) {
      const cell = String(langRowArr[c] || '').trim();
      if (/^語別\s*[：:]/.test(cell)) {
        const contentCol = c + 1;
        const content = String(langRowArr[contentCol] || '').trim();
        let extraContent = '';
        for (let k = 2; k <= 4 && c + k < colEnd; k++) {
          const v = String(langRowArr[c + k] || '').trim();
          if (/^語別\s*[：:]/.test(v)) break;
          if (v) extraContent += v;
        }
        const langs = extractLanguages(content + extraContent);
        langCols.push({ labelCol: c, contentCol, language: langs.display, raw: content + extraContent });
      }
    }
    if (langCols.length === 0) continue;

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
        const seatNum = normalizeSeat(seatVal);
        const isSeat = /^\d{1,3}$/.test(seatNum);
        const isName = /[\u4e00-\u9fff]/.test(nameVal) && !looksLikeClassroom(nameVal) && nameVal !== '姓名';
        if (isSeat && isName) {
          const key = `${c}-${c + 1}`;
          if (!pairSet.has(key)) { pairSet.add(key); pairs.push({ seatCol: c, nameCol: c + 1 }); }
          c += 2;
        } else { c += 1; }
      }
    }
    if (pairs.length === 0) continue;
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
        const tribeInfo = (nameRaw.match(/\(([^)]+)\)/) || [])[1] || '';
        let precisLang = p.language;
        if (tribeInfo && /手語|台灣手語/.test(tribeInfo)) precisLang = '手語';
        else if (tribeInfo && /阿美|泰雅|布農|排灣|賽德克|魯凱|卑南|鄒|太魯閣|撒奇萊雅|邵|噶瑪蘭|拉阿魯哇|卡那卡那富|雅美|達悟/.test(tribeInfo)) precisLang = '族語';
        else if (tribeInfo && /越南|泰語|印尼|柬埔寨|緬甸|馬來西亞|菲律賓/.test(tribeInfo)) precisLang = '新住民語';
        out.push({
          name: cleanName,
          rawName: nameRaw,
          oldClass: cls.className,
          oldSeat: seat,
          teacher: cls.teacher,
          language: precisLang || p.language,
          tribe: tribeInfo
        });
      }
    }
  }
}

for (const f of [
  'C:/Users/smes/Downloads/三年級_未分班.xlsx',
  'C:/Users/smes/Downloads/五年級_未分班.xlsx'
]) {
  console.log('='.repeat(60));
  console.log('FILE:', f);
  const wb = XLSX.readFile(f);
  const allStudents = [];
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
    parseOldSheet(grid, allStudents);
  }
  console.log(`Total students parsed: ${allStudents.length}`);
  const byClass = {};
  for (const s of allStudents) {
    byClass[s.oldClass] = byClass[s.oldClass] || { total: 0, langs: {}, seats: new Set() };
    byClass[s.oldClass].total++;
    byClass[s.oldClass].langs[s.language] = (byClass[s.oldClass].langs[s.language] || 0) + 1;
    byClass[s.oldClass].seats.add(s.oldSeat + ':' + s.name);
  }
  for (const [cls, info] of Object.entries(byClass).sort()) {
    const langStr = Object.entries(info.langs).map(([l, n]) => `${l}${n}`).join(', ');
    console.log(`  ${cls}: ${info.total} 人 / 不重複(座號+姓名) ${info.seats.size} 人 (${langStr})`);
  }
}
