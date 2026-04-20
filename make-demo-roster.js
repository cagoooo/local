// Generate a sample new-class roster by randomly reshuffling students
const XLSX = require('xlsx');
const fs = require('fs');

// Collect all 3rd grade students (from 三年級_未分班.xlsx) — original in 2nd grade, now reshuffled to 3rd
const wb3 = XLSX.readFile('C:/Users/smes/Downloads/三年級_未分班.xlsx');
const wb5 = XLSX.readFile('C:/Users/smes/Downloads/五年級_未分班.xlsx');

function collectStudents(wb) {
  const names = new Set();
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
    for (const row of grid) {
      for (let c = 0; c < row.length - 1; c++) {
        const seat = String(row[c] || '').trim();
        const name = String(row[c + 1] || '').trim();
        if (/^\d{1,3}$/.test(seat) && /[\u4e00-\u9fff]/.test(name) && !/(教室|課照|研習|智慧|美勞|電腦|自然|音樂|校史|魚寶屋|上課)/.test(name)) {
          const cleanName = name.replace(/\(.*?\)/g, '').trim();
          if (cleanName.length >= 2 && cleanName.length <= 5) names.add(cleanName);
        }
      }
    }
  }
  return [...names];
}

const students3 = collectStudents(wb3);
const students5 = collectStudents(wb5);
console.log(`3rd grade: ${students3.length} unique names`);
console.log(`5th grade: ${students5.length} unique names`);

// Simulate reshuffling: randomly assign each student to a new class (1-5) and seat (1-30)
function reshuffle(students, gradeNum) {
  // Simple random reshuffle
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  const classes = [[], [], [], [], []];
  shuffled.forEach((name, i) => classes[i % 5].push(name));
  const roster = [];
  classes.forEach((classStudents, idx) => {
    classStudents.sort(() => Math.random() - 0.5);
    classStudents.forEach((name, seatIdx) => {
      roster.push({ 姓名: name, 新班級: `${gradeNum}年${idx + 1}班`, 新座號: seatIdx + 1 });
    });
  });
  return roster;
}

// Use fixed seed via seed-based randomness is hard in pure JS; we'll just produce a deterministic shuffle
function deterministicReshuffle(students, gradeNum) {
  // Rotate by 7 positions and mix
  const shuffled = [...students];
  shuffled.sort((a, b) => {
    const ha = [...a].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) | 0, 0);
    const hb = [...b].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) | 0, 0);
    return ha - hb;
  });
  const classes = [[], [], [], [], []];
  shuffled.forEach((name, i) => classes[i % 5].push(name));
  const roster = [];
  classes.forEach((classStudents, idx) => {
    classStudents.forEach((name, seatIdx) => {
      roster.push({ 姓名: name, 新班級: `${gradeNum}年${idx + 1}班`, 新座號: seatIdx + 1 });
    });
  });
  return roster;
}

const roster3 = deterministicReshuffle(students3, 3);
const roster5 = deterministicReshuffle(students5, 5);

// Build Excel with both grades in separate sheets
const wb = XLSX.utils.book_new();
const ws3 = XLSX.utils.json_to_sheet(roster3);
ws3['!cols'] = [{wch:12},{wch:12},{wch:10}];
XLSX.utils.book_append_sheet(wb, ws3, '3年級新名冊');
const ws5 = XLSX.utils.json_to_sheet(roster5);
ws5['!cols'] = [{wch:12},{wch:12},{wch:10}];
XLSX.utils.book_append_sheet(wb, ws5, '5年級新名冊');
XLSX.writeFile(wb, 'H:/local/native-lang-matcher/demo-new-roster.xlsx');
console.log(`\nDemo roster written: demo-new-roster.xlsx`);
console.log(`  3年級: ${roster3.length} 位 分到 5 班`);
console.log(`  5年級: ${roster5.length} 位 分到 5 班`);
console.log('\n3年級前 5 筆:');
roster3.slice(0, 5).forEach(r => console.log(' ', r));
console.log('\n5年級前 5 筆:');
roster5.slice(0, 5).forEach(r => console.log(' ', r));
