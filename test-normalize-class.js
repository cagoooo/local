// Test normalizeClass support for 301 / 501 / 609 etc.

function normalizeClass(s) {
  if (s == null) return '';
  let v = String(s).replace(/\s+/g, '').trim();
  v = v.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));

  const m = v.match(/(\d+)\s*年\s*(\d+)\s*班/);
  if (m) return `${m[1]}年${m[2]}班`;

  const cn = { '一':'1','二':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10' };
  const m2 = v.match(/^([一二三四五六]|\d)年([一二三四五六七八九十]|\d{1,2})班$/);
  if (m2) {
    const g = cn[m2[1]] || m2[1];
    const c = cn[m2[2]] || m2[2];
    return `${g}年${c}班`;
  }

  const m3 = v.match(/^(\d+)[-_/ ](\d+)$/);
  if (m3) return `${m3[1]}年${m3[2]}班`;

  const m4 = v.match(/^([1-6])(\d{1,2})$/);
  if (m4) {
    const cls = parseInt(m4[2]);
    if (cls >= 1 && cls <= 20) return `${m4[1]}年${cls}班`;
  }

  const m5 = v.match(/^(\d)(\d{2})$/);
  if (m5) {
    const cls = parseInt(m5[2]);
    if (cls >= 1 && cls <= 20) return `${m5[1]}年${cls}班`;
  }

  return v;
}

const tests = [
  // 標準格式
  ['3年1班', '3年1班'],
  ['3年10班', '3年10班'],
  ['5年5班', '5年5班'],
  // 國字年級
  ['三年1班', '3年1班'],
  ['五年三班', '5年3班'],
  ['六年十班', '6年10班'],
  // 連字號
  ['3-1', '3年1班'],
  ['5_3', '5年3班'],
  ['6 9', '6年9班'],
  // 三位數(年+01-09)
  ['301', '3年1班'],
  ['305', '3年5班'],
  ['501', '5年1班'],
  ['609', '6年9班'],
  // 三位數(年+10-20)
  ['310', '3年10班'],
  ['620', '6年20班'],
  // 全形數字
  ['３年１班', '3年1班'],
  ['５０５', '5年5班'],
  // 空白
  ['  3年1班  ', '3年1班'],
  ['3 年 1 班', '3年1班'],
  // 邊界
  ['3', '3'],  // 單字 → 無法解析
  ['301班', '301班'],  // 多了「班」字,不符合三位數規則
  ['', ''],
  [null, ''],
];

let pass = 0, fail = 0;
for (const [input, expected] of tests) {
  const got = normalizeClass(input);
  const ok = got === expected;
  console.log((ok ? '✓' : '✗ FAIL') + ` ${JSON.stringify(input)} → ${JSON.stringify(got)}${!ok ? ' (expected ' + JSON.stringify(expected) + ')' : ''}`);
  ok ? pass++ : fail++;
}
console.log(`\n${pass}/${pass+fail} passed`);
process.exit(fail ? 1 : 0);
