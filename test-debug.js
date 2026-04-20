const XLSX = require('xlsx');
const f = 'C:/Users/smes/Downloads/三年級_未分班.xlsx';
const wb = XLSX.readFile(f);
const ws = wb.Sheets[wb.SheetNames[0]];
const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });

// Output all rows for reference
console.log('Row count:', grid.length);

// Find all 班級 anchors
const anchors = [];
for (let r = 0; r < grid.length; r++) {
  const row = grid[r] || [];
  for (let c = 0; c < row.length; c++) {
    if (/^班級\s*[：:]/.test(String(row[c] || '').trim())) {
      anchors.push({ r, c, className: String(row[c+1]||'').trim() });
    }
  }
}
console.log('Class anchors:', anchors);

// For class 1 only, trace pair detection and extraction
const anchor = anchors[0];
const nextAnchor = anchors[1];
const colEnd = nextAnchor ? nextAnchor.c : 50;
console.log(`\nClass 1: anchor at row=${anchor.r}, col=${anchor.c}, className=${anchor.className}, colEnd=${colEnd}`);

// Find lang row
let langRow = -1;
for (let r = anchor.r + 1; r < anchor.r + 8 && r < grid.length; r++) {
  const row = grid[r] || [];
  for (let c = Math.max(0, anchor.c - 3); c < colEnd + 1; c++) {
    if (/^語別\s*[：:]/.test(String(row[c] || '').trim())) { langRow = r; break; }
  }
  if (langRow !== -1) break;
}
console.log('Lang row:', langRow);
console.log('Lang row content:', grid[langRow].slice(0, colEnd));

// Find 編號 row
let headerRow = -1, bianhaoCol = -1;
for (let r = langRow + 1; r < langRow + 6 && r < grid.length; r++) {
  const row = grid[r] || [];
  for (let c = Math.max(0, anchor.c - 3); c < colEnd; c++) {
    if (String(row[c] || '').trim() === '編號') { headerRow = r; bianhaoCol = c; break; }
  }
  if (headerRow !== -1) break;
}
console.log('Header row:', headerRow, 'bianhaoCol:', bianhaoCol);
console.log('Header row content:', grid[headerRow].slice(0, colEnd));

// Detect pairs
const normalizeSeat = s => String(s||'').replace(/\s+/g,'').replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));
const looksLikeClassroom = s => /(教室|課照|C\d{2,}|研習|智慧|美勞|電腦|自然|音樂|校史|魚寶屋|上課|學習中心)/.test(s);

const pairSet = new Set();
const pairs = [];
for (let r = headerRow; r < Math.min(grid.length, headerRow + 30); r++) {
  const row = grid[r] || [];
  const joined = row.slice(Math.max(0, anchor.c - 3), colEnd).map(x => String(x || '')).join('');
  if (joined.includes('總人數')) { console.log(`Stop at row ${r} (總人數)`); break; }
  let c = bianhaoCol + 1;
  while (c < colEnd) {
    const seatVal = String(row[c] || '').trim();
    const nameVal = String(row[c + 1] || '').trim();
    const seatNum = normalizeSeat(seatVal);
    const isSeat = /^\d{1,3}$/.test(seatNum);
    const isName = /[\u4e00-\u9fff]/.test(nameVal) && !looksLikeClassroom(nameVal) && nameVal !== '姓名';
    if (isSeat && isName) {
      const key = `${c}-${c + 1}`;
      if (!pairSet.has(key)) {
        pairSet.add(key);
        pairs.push({ seatCol: c, nameCol: c + 1, firstAt: r });
      }
      c += 2;
    } else {
      c += 1;
    }
  }
}
console.log('\nDetected pairs:', pairs);

// Extract data
console.log('\nExtracting data:');
for (let r = headerRow; r < grid.length; r++) {
  const row = grid[r] || [];
  const joined = row.slice(Math.max(0, anchor.c - 3), colEnd).map(x => String(x || '')).join('');
  if (joined.includes('總人數')) { console.log(`STOP at row ${r}`); break; }
  for (const p of pairs) {
    const seatRaw = String(row[p.seatCol] || '').trim();
    const nameRaw = String(row[p.nameCol] || '').trim();
    if (!nameRaw || !seatRaw) continue;
    if (nameRaw === '姓名' || seatRaw === '座號') continue;
    if (!/[\u4e00-\u9fff]/.test(nameRaw)) continue;
    if (looksLikeClassroom(nameRaw)) continue;
    const seat = normalizeSeat(seatRaw);
    if (!/^\d{1,3}$/.test(seat)) continue;
    console.log(`  row=${r} pair=(${p.seatCol},${p.nameCol}) seat=${seat} name=${nameRaw}`);
  }
}
