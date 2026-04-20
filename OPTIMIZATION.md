# 優化改良藍圖 & 進度總表

> **版本:v2.2 · 最後更新:2026-04-21**
>
> 本文件記錄**已完成的里程碑**以及**未來優化路線圖**。依優先順序與開發難度分成 7 波,每項都有「為什麼做、怎麼做、預計工時」三要素。
>
> **目前進度:30 項功能 ✅ · 56 項規劃中 🚧**

## 目錄

- [📊 目前進度總覽](#目前進度總覽)
- [✅ 已完成里程碑](#已完成里程碑)
- [🎯 第三波:功能擴充 (半天 ~ 1 天)](#第三波功能擴充-半天--1-天)
- [🏗️ 第四波:架構升級 (2-5 天)](#第四波架構升級-2-5-天)
- [🚀 第五波:服務化 (週級)](#第五波服務化-週級)
- [🎨 第六波:精緻化微優化 (新)](#第六波精緻化微優化-新)
- [🧠 第七波:智慧化 (新)](#第七波智慧化-新)
- [🎓 教學現場場景建議](#教學現場場景建議)
- [📈 推薦開發路徑](#推薦開發路徑)
- [🧭 開發守則](#開發守則)

---

## 📊 目前進度總覽

| 指標 | 數值 | 備註 |
|------|------|------|
| 版本 | **v2.2** | |
| 核心檔案 | `index.html` 134.7 KB | 單檔 HTML,含所有 CSS + JS |
| 圖片資產 | 11 個檔 (340 KB) | favicon × 5、apple × 1、android × 2、og × 2、manifest |
| 外部依賴 | `xlsx@0.18.5`(CDN)、Google Fonts `Noto Sans TC` | |
| 已實作功能 | **30 項**(v1.0 → v2.2) | 見下 |
| 部署狀態 | ✅ 已上 GitHub Pages:<br/>`https://cagoooo.github.io/local/` | HTTPS enforced |
| GitHub Repo | `cagoooo/local`(公開) | 已設 topics + description + homepage |
| 瀏覽器支援 | 近 2 年版本的 Chrome/Edge/Firefox/Safari | backdrop-filter、color-mix 等需現代瀏覽器 |
| 深色模式 | ✅ 自動偵測 + 手動切換 + 記憶 | |
| a11y 分數 | 估計 85/100(未正式測) | ARIA 標籤、focus ring、reduced-motion 都有 |
| PWA 就緒度 | 70%(有 manifest + icons,但缺 Service Worker) | |
| 社群分享 | ✅ OG image + Twitter Card + LINE 預覽 | |

---

## ✅ 已完成里程碑

### 🏁 v1.0 · 基本配對(Day 1 上半)· 8 項

| # | 項目 | 備註 |
|---|------|------|
| 1 | 複雜矩陣格式舊名單解析器(班級/語別/編號定位) | 資料驅動 pair 偵測 |
| 2 | 跨欄位對齊的資料驅動配對 | 修正 3 年級 vs 5 年級檔案的欄位錯位問題 |
| 3 | 新名冊彈性欄位偵測(姓名/班級/座號 6 種變體名) | |
| 4 | 姓名精確比對 + 去括號族別標記 | |
| 5 | 重複姓名、未配對警示 | |
| 6 | 可篩選/搜尋/排序表格 | 4 種篩選維度 |
| 7 | 清單檢視 + 分班檢視雙模式 | |
| 8 | 平面表 + 矩陣名單雙格式 Excel 匯出 | |

### 🚀 v1.1 · 高優先優化 · 4 項

| # | 項目 | 影響 |
|---|------|------|
| 9  | **新名冊範本一鍵下載** | 同事零學習成本 |
| 10 | **Levenshtein 模糊比對**(🟡疑似 / 🟠多候選 / 🔴未配對) | 容錯打字錯誤 |
| 11 | **匯出檔保留族別資訊**(新增「清名」「族別」欄) | 後續統計 |
| 12 | **多檔同時上傳**(Step 1/2 皆支援) | 多年級同時處理 |

### 🎨 v2.0 · UI/UX 大升級 · 6 項

| # | 項目 | 說明 |
|---|------|------|
| 13 | **完整設計系統**(色板/字型/間距/陰影/動效 tokens) | Noto Sans TC + Indigo 漸層品牌色 |
| 14 | **深色模式**(自動偵測 + 切換按鈕 + localStorage) | 所有語意色都有深色對應版 |
| 15 | **Hero 區 + 進度 Stepper** | 3 段式狀態指示,清晰流程引導 |
| 16 | **Sticky top nav**(backdrop blur) | |
| 17 | **說明區卡片格改版**(6 張 feature card) | 取代 ASCII 表格與 bullet list |
| 18 | **entrance 動畫**(錯落 fade-in)+ `prefers-reduced-motion` | |

### ⚡ v2.1 · 功能強化 + 社群整合 · 9 項 + 資產

| # | 項目 | 說明 |
|---|------|------|
| 19 | **Toast 通知**(4 種狀態 + 滑入動畫) | 取代所有 `alert()`,不阻擋操作 |
| 20 | **鍵盤快捷鍵**(Ctrl+K/D/E、Shift+E、?、Esc) | 附 ⌨️ icon 彈出說明 modal |
| 21 | **重置按鈕**(頂部 🔄) | 一鍵清除 state + dropzone + localStorage |
| 22 | **檔名加年級資訊** | `本土語配對結果_3年級+5年級_20260420.xlsx` |
| 23 | **動畫計數**(`animateCountUp`) | 遵守 `prefers-reduced-motion` |
| 24 | **手動確認多候選 modal** | 點 🟠 tag 彈出選項,可存 localStorage |
| 25 | **列印友善模式**(`@media print`) | 自動換頁、每班一頁、加頁首標題 |
| 26 | **LocalStorage 72hr 記憶** | 關掉瀏覽器再開會問「要載入上次資料嗎」 |
| 27 | **變動摘要報告**(modal + Markdown 複製) | KPI + 班級異動表 + 流動 Top8 + 語別分布 |
| 🎨 | **圖片資產**(favicon × 8 + og-image 兩款 + manifest) | FB/LINE 分享會有預覽卡 |
| 🌐 | **完整 Meta tags**(Open Graph + Twitter Card + 主題色) | GitHub Pages 部署免再設定 |

### 🔍 v2.2 · 透明化升級 · 3 項 · 2026-04-21

| # | 項目 | 說明 |
|---|------|------|
| 28 | **範本下載資訊卡式 CTA** | ghost 小按鈕 → 寬版資訊卡(icon + 標題 + 徽章 + 描述 + CTA)· hover 微旋轉 + 光暈 · 整卡可點 |
| 29 | **上傳後預覽 Modal(舊名單)** | 綠色「👁 查看完整解析內容」按鈕 + 可點擊的統計 chip → 開啟寬版 modal(820px)· 7 欄完整表格 + 即時搜尋 + 班級/語別雙重篩選 |
| 30 | **上傳後預覽 Modal(新名冊)** | 同上,並自動偵測重複姓名警示 banner · 多工作表時加 sheet 篩選 |
| 🚀 | **GitHub Pages 正式上線** | `https://cagoooo.github.io/local/` · HTTPS 強制 · v2.1/v2.2 tags 齊全 |

**累計 30 項功能已完成,第一波 🔴 與第二波 ⚡ 全數打勾,第三波部分完成。**

---

## 🎯 第三波:功能擴充(半天 ~ 1 天)

### 1️⃣ PWA Service Worker(讓 APP 真正可離線)

**為什麼**:現在已有 manifest + icons,缺 Service Worker 就差臨門一腳。有了 SW 之後 Chrome 會跳「安裝」提示,使用者可以把 APP 釘到桌面/開始選單,完全離線運作。

**做法**:

1. 新增 `sw.js`:
   ```javascript
   const CACHE = 'native-lang-matcher-v2.1';
   const ASSETS = [
     './',
     './index.html',
     './manifest.webmanifest',
     './favicon.svg',
     './favicon-32x32.png',
     './apple-touch-icon.png',
     './android-chrome-192x192.png',
     './android-chrome-512x512.png',
     'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
     'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap'
   ];

   self.addEventListener('install', e => {
     e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
     self.skipWaiting();
   });
   self.addEventListener('activate', e => {
     e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
     self.clients.claim();
   });
   self.addEventListener('fetch', e => {
     e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
       if (res && res.status === 200) {
         const copy = res.clone();
         caches.open(CACHE).then(c => c.put(e.request, copy));
       }
       return res;
     }).catch(() => caches.match('./index.html'))));
   });
   ```
2. 在 `index.html` 底部註冊:
   ```javascript
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('./sw.js').catch(console.error);
     });
   }
   ```
3. 加入「安裝 APP」按鈕:
   ```javascript
   let deferredPrompt;
   window.addEventListener('beforeinstallprompt', e => {
     e.preventDefault();
     deferredPrompt = e;
     $('installBtn').style.display = 'inline-flex';
   });
   $('installBtn').addEventListener('click', async () => {
     if (!deferredPrompt) return;
     deferredPrompt.prompt();
     const { outcome } = await deferredPrompt.userChoice;
     toast(outcome === 'accepted' ? '已安裝到桌面' : '已取消安裝', 'info');
     deferredPrompt = null;
     $('installBtn').style.display = 'none';
   });
   ```

**注意**:本地 `file://` 無法測試 SW,需要用 `http://127.0.0.1:8000/`(您已有伺服器)或 HTTPS(GitHub Pages)。

**預計工時**:2-3 小時

---

### 2️⃣ 手動編輯單筆記錄(inline editing)

**為什麼**:配對後發現某筆的新班級錯了,現在要改 Excel 再重跑。若能在表格中直接雙擊改,體驗大幅提升。

**做法**:

1. 表格「新班級」、「新座號」兩欄加 `contenteditable="true"` 屬性
2. 雙擊時轉換為 input,Enter 儲存、Esc 取消
3. 儲存時寫回 `state.merged[idx]` 並呼叫 `saveState()`
4. 顯示小小 pencil icon 提示可編輯
5. 編輯過的列加 `data-manually-edited` 並在匯出檔標記「已人工修正」

```javascript
function makeEditable(cell, student, field) {
  cell.addEventListener('dblclick', () => {
    const old = cell.textContent;
    const input = document.createElement('input');
    input.value = old; input.style.width = '80px';
    cell.innerHTML = ''; cell.appendChild(input); input.focus(); input.select();
    const commit = () => {
      const val = input.value.trim();
      if (val !== old) {
        student[field] = val;
        student.manuallyEdited = true;
        saveState();
        toast(`已更新 ${student.name} 的${field === 'newClass' ? '新班級' : '新座號'}`, 'success', 2000);
      }
      renderTable();
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      if (e.key === 'Escape') renderTable();
    });
  });
}
```

**預計工時**:3-4 小時

---

### 3️⃣ 側邊對照檢視(Side-by-side)

**為什麼**:看「舊 → 新」變化時,兩欄並列比單一表格更直覺。

**做法**:

- 新增檢視模式:清單 / 分班 / **對照**
- 對照模式版面:
  ```
  ┌─ 舊名單(依舊班級) ─┐   ┌─ 新名單(依新班級) ─┐
  │ 3年1班              │   │ 3年1班              │
  │ ─ 閩語 (8 人)        │   │ ─ 閩語 (15 人)       │
  │ ─ 客語 (8 人)        │   │ ─ 客語 (6 人)        │
  │ ...                 │   │ ...                 │
  └─────────────────────┘   └─────────────────────┘
  ```
- 進階版:用 SVG 在中間畫連線(貝茲曲線),hover 某位學生時高亮連線

**技術**:CSS `grid-template-columns: 1fr 1fr`,SVG 動態繪製連線。

**預計工時**:1 天

---

### 4️⃣ 接受 CSV + 剪貼簿貼上

**為什麼**:常見場景是「從 Excel 複製一片貼進來就好」,省下「另存新檔」的步驟。

**做法**:

```javascript
// 1. 允許 .csv
<input type="file" accept=".xlsx,.xls,.csv" />

// 2. 偵測副檔名,用 SheetJS 也能讀 CSV:
XLSX.read(data, { type: 'array' }); // 通吃

// 3. Step 2 加「📋 從剪貼簿貼上」按鈕
$('pasteBtn').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) { toast('剪貼簿是空的', 'warning'); return; }
    // 偵測分隔符:tab / comma
    const delim = text.includes('\t') ? '\t' : ',';
    const rows = text.trim().split(/\r?\n/).map(r => r.split(delim));
    if (rows.length < 2) { toast('至少需要 2 列(標題 + 1 筆資料)', 'warning'); return; }
    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = (r[i] || '').trim());
      return obj;
    });
    // 當作單一 sheet 處理
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Pasted');
    state.newRoster = parseNewRoster(wb);
    toast(`已從剪貼簿貼入 ${state.newRoster.length} 位`, 'success');
    if (state.oldStudents.length) {
      doMatch(); populateFilters(); renderAlerts(); renderTable();
      $('resultsSection').style.display = 'block';
    }
  } catch (err) {
    toast('貼上失敗,您的瀏覽器可能不支援剪貼簿 API', 'error');
  }
});
```

**預計工時**:2 小時

---

### 5️⃣ 師資配課自動建議

**為什麼**:分班後常需要重新配課。若某班某語別人數驟變,應該提醒。

**做法**:

```javascript
function analyzeStaffNeeds() {
  const oldDist = {};  // { '3年1班_閩語': 8, ... }
  const newDist = {};
  for (const s of state.merged) {
    const oldKey = `${s.oldClass}_${languageCategory(s.language)}`;
    oldDist[oldKey] = (oldDist[oldKey] || 0) + 1;
    if (s.matched) {
      const newKey = `${s.newClass}_${languageCategory(s.language)}`;
      newDist[newKey] = (newDist[newKey] || 0) + 1;
    }
  }
  const alerts = [];
  const allKeys = new Set([...Object.keys(oldDist), ...Object.keys(newDist)]);
  for (const k of allKeys) {
    const o = oldDist[k] || 0, n = newDist[k] || 0;
    if (o >= 3 && n >= 3 && Math.abs(n - o) / Math.max(o, 1) >= 0.3) {
      alerts.push({ key: k, old: o, new: n, delta: n - o, pct: ((n - o) / o * 100).toFixed(0) });
    }
  }
  return alerts;
}
```

視覺化:Chart.js 或純 CSS grid 長條圖顯示各班各語別。

**預計工時**:4 小時

---

### 6️⃣ URL 參數分享(Deep linking)

**為什麼**:「我搜尋到某位學生,想傳這個連結給同事看」。

**做法**:

```javascript
function updateURL() {
  const params = new URLSearchParams();
  ['searchInput', 'filterClass', 'filterLang', 'filterStatus'].forEach(id => {
    const v = $(id)?.value;
    if (v) params.set(id.replace('filter', '').replace('Input', '').toLowerCase(), v);
  });
  if (state.viewMode !== 'flat') params.set('view', state.viewMode);
  const q = params.toString();
  history.replaceState(null, '', q ? `?${q}` : window.location.pathname);
}

window.addEventListener('load', () => {
  const p = new URLSearchParams(window.location.search);
  const map = { search: 'searchInput', class: 'filterClass', lang: 'filterLang', status: 'filterStatus' };
  for (const [k, id] of Object.entries(map)) {
    if (p.has(k)) $(id).value = p.get(k);
  }
  if (p.get('view') === 'grouped') {
    document.querySelectorAll('.toggle-bar button').forEach(b => b.classList.toggle('active', b.dataset.view === 'grouped'));
    state.viewMode = 'grouped';
  }
});

// 在所有篩選 event listener 中加 updateURL()
```

**預計工時**:1 小時

---

### 7️⃣-A 預覽 Modal 內直接編輯(承接 v2.2)

**為什麼**:v2.2 的預覽只能看,若發現錯誤還得去改 Excel 重上傳。加上雙擊即編輯,核對過程中就能修正。

**做法**:

```javascript
// 在 preview table 的 td 加上:
td.addEventListener('dblclick', () => {
  const original = td.textContent;
  const input = document.createElement('input');
  input.value = original;
  input.style.cssText = 'width:100%;padding:4px;border:1px solid var(--brand-500);border-radius:4px';
  td.innerHTML = '';
  td.appendChild(input);
  input.focus(); input.select();
  const commit = () => {
    const val = input.value.trim();
    if (val !== original) {
      // 更新對應 student 物件
      const studentIdx = +td.closest('tr').dataset.idx;
      const field = td.dataset.field;  // 'name' / 'oldClass' / 'oldSeat' / ...
      students[studentIdx][field] = val;
      students[studentIdx].manuallyEdited = true;
      saveState();
      toast('已更新', 'success', 1500);
    }
    renderRows();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') renderRows();
  });
});
```

搭配 tooltip 提示:「雙擊可編輯」。編輯過的列加金色左邊條。

**預計工時**:2-3 小時

---

### 7️⃣-B 預覽 Modal 支援「只匯出篩選結果」

**為什麼**:有時只想把 3年1班 的名單寄給導師,不需要整份匯出。

**做法**:在 preview modal 底部加「📤 匯出目前篩選結果」按鈕:

```javascript
function exportFiltered(filteredStudents, filename) {
  const rows = filteredStudents.map(s => ({
    姓名: s.rawName || s.name,
    舊班級: s.oldClass || '',
    舊座號: s.oldSeat || '',
    語別: s.language || '',
    族別: s.tribe || '',
    任教老師: s.teacher || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '篩選結果');
  XLSX.writeFile(wb, filename);
}
```

**預計工時**:30 分鐘

---

### 7️⃣ 完整 WCAG 2.1 AA 無障礙

**為什麼**:公部門工具應符合無障礙準則。目前估計 85/100,再加點小東西可到 95+。

**檢查清單**:

- [ ] 所有 emoji 在 aria 中改為文字描述(或 `aria-hidden`)
- [ ] dropzone 加 `role="button"` + `tabindex="0"` + keydown (Enter/Space)
- [ ] 表格加 `<caption>` + `scope="col"` + `aria-sort`
- [ ] 狀態變化用 `aria-live="polite"` 通知(toast 已有 `role="status"`)
- [ ] 確保對比度 ≥ 4.5:1(用 [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/))
- [ ] 所有圖示按鈕有 `aria-label`
- [ ] modal 開啟時做 focus trap
- [ ] 表單錯誤訊息用 `role="alert"`

**工具**:

```bash
# 跑 Lighthouse a11y 測試
npx lighthouse http://127.0.0.1:8000/ --only-categories=accessibility --view
```

**預計工時**:4-6 小時

---

## 🏗️ 第四波:架構升級(2-5 天)

### 8️⃣ TypeScript 化 + Vite 拆檔

**何時該做**:單檔 > 150KB 或加新功能常破壞舊功能時。目前 116KB,還能撐一陣子。

**結構建議**:

```
src/
├── main.ts                 # 主入口 + App init
├── types.ts                # Student, MatchResult, NewRoster, ...
├── state.ts                # 全域 state + pub/sub
├── parsers/
│   ├── old-list.ts         # 複雜矩陣格式解析
│   ├── new-roster.ts       # 新名冊彈性解析
│   └── csv.ts              # CSV / 剪貼簿解析
├── matcher/
│   ├── exact.ts
│   ├── fuzzy.ts            # Levenshtein
│   └── index.ts            # 兩階段配對
├── export/
│   ├── flat.ts
│   ├── matrix.ts
│   └── markdown.ts         # 摘要報告 MD 生成
├── storage/
│   └── local.ts            # localStorage wrapper
├── ui/
│   ├── App.ts              # 主 component
│   ├── DropZone.ts
│   ├── FilterBar.ts
│   ├── ResultTable.ts
│   ├── StatsChips.ts
│   ├── Modal.ts
│   ├── Toast.ts
│   └── theme.ts            # 深色模式切換
└── styles/
    ├── tokens.css          # 設計 tokens
    ├── components.css
    └── main.css
```

**Build 設定**(`vite.config.ts`):

```typescript
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: { manualChunks: undefined }
    }
  }
});
```

**好處**:

- IDE 型別提示、自動補完
- Tree-shaking 減少最終體積
- 熱重載開發體驗
- 仍可打包回**單檔 HTML**(vite-plugin-singlefile)

**預計工時**:2-3 天(含重構 + 寫型別 + 跑測試)

---

### 9️⃣ Web Workers 平行解析

**為什麼**:目前解析 10000 筆資料時 UI 會卡頓 1-2 秒。Worker 把解析搬到另一個 thread,UI 永遠流暢。

**做法**(要搭配 #8 TypeScript 化比較好管理):

```typescript
// worker.ts
import * as XLSX from 'xlsx';
import { parseOldWorkbook, parseNewRoster } from './parsers';

self.onmessage = async (e: MessageEvent<{ file: ArrayBuffer; kind: 'old' | 'new' }>) => {
  const { file, kind } = e.data;
  try {
    const wb = XLSX.read(file, { type: 'array' });
    const result = kind === 'old' ? parseOldWorkbook(wb) : parseNewRoster(wb);
    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: (err as Error).message });
  }
};

// main.ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ file: arrayBuffer, kind: 'old' });
worker.onmessage = (e) => {
  if (!e.data.ok) { toast(e.data.error, 'error'); return; }
  state.oldStudents = e.data.result;
  renderStats();
};
```

**加分**:顯示進度條,worker 用 `postMessage({ progress: 0.45 })` 回報。

**預計工時**:1 天

---

### 🔟 虛擬捲動(Virtual scrolling)

**為什麼**:表格超過 500 列時 DOM 節點過多會 lag。虛擬捲動只渲染可視區 ± 緩衝。

**自造版核心**:

```typescript
const ROW_HEIGHT = 44;
const BUFFER = 10;
let allRows: Student[] = [];

function renderVisible() {
  const scrollTop = tableWrap.scrollTop;
  const vh = tableWrap.clientHeight;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIdx = Math.min(allRows.length, Math.ceil((scrollTop + vh) / ROW_HEIGHT) + BUFFER);
  const visible = allRows.slice(startIdx, endIdx);
  const paddingTop = startIdx * ROW_HEIGHT;
  const paddingBottom = (allRows.length - endIdx) * ROW_HEIGHT;
  tbody.innerHTML = visible.map(row => rowHTML(row)).join('');
  tbody.style.paddingTop = paddingTop + 'px';
  tbody.style.paddingBottom = paddingBottom + 'px';
}
tableWrap.addEventListener('scroll', renderVisible, { passive: true });
```

**套件版**:[@tanstack/virtual](https://tanstack.com/virtual)(如果走 React/Vue)

**預計工時**:1 天(自造)/ 2 小時(套件)

---

### 1️⃣1️⃣ Playwright E2E 測試

**為什麼**:每次改 UI 怕破壞舊功能,E2E 自動測一遍。

**建議測試情境**(10 個):

1. 上傳單一舊名單 → 正確顯示學生人數
2. 上傳單一新名冊 → 正確顯示學生人數
3. 精確配對 → 成功率 100%
4. 插入錯字 → 顯示 🟡 疑似配對
5. 插入多候選 → 顯示 🟠 警示
6. 插入完全不存在的學生 → 顯示 🔴 警示
7. 切換深色模式 → body 的 `data-theme` 變化
8. 搜尋「黃」 → 表格只剩姓黃的學生
9. 匯出平面表 → 下載的檔案包含預期欄位
10. 關閉重開 → localStorage 還原提示

```bash
npm install -D @playwright/test
npx playwright install chromium
```

```typescript
// tests/e2e/matching.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

const FIXTURES = path.join(__dirname, '../fixtures');

test('精確配對全員成功', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.setInputFiles('#oldFile', path.join(FIXTURES, '三年級_未分班.xlsx'));
  await page.setInputFiles('#newFile', path.join(FIXTURES, 'demo-new-roster.xlsx'));
  await expect(page.locator('#resultsSection')).toBeVisible();
  await expect(page.locator('.alert-info').last()).toContainText('100.0%');
});

test('深色模式切換', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.click('#themeToggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
```

**預計工時**:1 天(初始設定 + 10 個核心測試)

---

### 1️⃣2️⃣ 多國語言 i18n

**為什麼**:新住民家庭多,或英語教學實驗時用得上。

**做法**:

```typescript
// i18n/zh-TW.json
{ "app.title": "本土語分班配對系統", "hero.eyebrow": "100% 本機運算" }

// i18n/en.json
{ "app.title": "Native Language Class Matcher", "hero.eyebrow": "100% Local Processing" }

// 使用:
<h1 data-i18n="app.title">本土語分班配對系統</h1>

// 切換:
function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = translations[lang][el.dataset.i18n] || el.textContent;
  });
  localStorage.setItem('lang', lang);
}
```

**預計工時**:1-2 天

---

## 🚀 第五波:服務化(週級)

### 1️⃣3️⃣ Supabase + Google OAuth

**架構**:

```
[瀏覽器 index.html] 
    ↓
Supabase Auth (Google OAuth)
    ↓
Supabase Postgres + RLS
  ├ schools
  ├ teachers
  ├ students (有 school_id + school_year)
  ├ match_runs (歷史紀錄)
  └ manual_overrides (疑似配對的人工決策)
```

**Schema**(SQL):

```sql
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text,
  created_at timestamptz default now()
);

create table teachers (
  id uuid primary key references auth.users(id),
  school_id uuid references schools(id) on delete cascade,
  display_name text,
  line_id text,  -- 綁定 LINE 通知
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  school_year text not null,    -- '114'
  grade int not null,           -- 3
  class_num int not null,       -- 1
  seat_num int not null,        -- 15
  name text not null,
  tribe text,
  language text,
  created_at timestamptz default now(),
  unique(school_id, school_year, grade, class_num, seat_num)
);
create index students_lookup on students(school_id, school_year);

create table match_runs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  teacher_id uuid references teachers(id),
  from_year text,  -- 'old' grade's year
  to_year text,
  total int,
  exact_matches int,
  fuzzy_matches int,
  ambiguous int,
  unmatched int,
  payload jsonb,   -- 完整比對結果
  created_at timestamptz default now()
);

-- RLS: 教師只能看自己學校
alter table students enable row level security;
create policy "同校可見" on students for select
  using (school_id in (select school_id from teachers where id = auth.uid()));
```

**前端整合**:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $('loginBtn').addEventListener('click', async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  });
</script>
```

**實作步驟**(參考 `supabase-google-oauth-integration` skill):

1. Supabase 專案建立 + Schema 套用
2. Google Cloud 建 OAuth Client + 配 Redirect URI
3. 前端加 Auth UI(未登入顯示 CTA)
4. 登入後,匯出按鈕多一個「⬆️ 同步到雲端」
5. 歷史頁面:列出過往 `match_runs` 並可重開

**預計工時**:2-3 天

---

### 1️⃣4️⃣ LINE Bot 通知

**為什麼**:配對完成後按一鍵,把各班名單 LINE 給導師。

**做法**(參考 `line-messaging-firebase` skill):

1. 建 LINE Official Account + Messaging API Channel
2. 每位教師掃 QR Code 綁 LINE ID(存 Supabase `teachers.line_id`)
3. 前端呼叫 Firebase Cloud Function(或 Supabase Edge Function)做推送
4. 教師收到 LINE Flex Message:

```
┌────────────────────────────┐
│  🔔 3年1班 本土語名單更新      │
├────────────────────────────┤
│  📌 班級總數:25 人           │
│  ─────                     │
│  🏮 閩語   15 人 · 胡麗華     │
│  🪔 客語    6 人 · 陳美智     │
│  🌾 族語    3 人 · 謝彩鳳     │
│  👐 手語    1 人 · 智慧教室   │
│  ─────                     │
│  📊 異動摘要:                │
│  新進 3 位 · 轉出 1 位        │
├────────────────────────────┤
│  [ 📎 完整名單 ]  [ 📅 課表 ] │
└────────────────────────────┘
```

**預計工時**:3-4 天

---

### 1️⃣5️⃣ Firebase Cloud Functions 排程

**為什麼**:每學期自動跑 → 寄報告給教務處。

```typescript
// functions/src/index.ts
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';

const supabaseKey = defineSecret('SUPABASE_SERVICE_KEY');

export const annualMatch = onSchedule({
  schedule: '0 8 1 8 *',  // 每年 8/1 早上 8 點
  timeZone: 'Asia/Taipei',
  secrets: [supabaseKey]
}, async () => {
  const newYear = String(new Date().getFullYear() - 1911);
  const oldYear = String(parseInt(newYear) - 1);
  const students = await fetchFromSchoolSystem();
  const result = autoMatch(students, { fromYear: oldYear, toYear: newYear });
  await saveMatchRun(result);
  await sendEmailToAdmin(result);
  await notifyLineGroup(result);
});
```

**預計工時**:4-5 天

---

### 1️⃣6️⃣ 跨年度歷史 Dashboard

**為什麼**:想看「這 5 年閩語人數趨勢」、「王小明的本土語履歷」。

**頁面**:

```
/dashboard              — 學校總覽
/dashboard/trends       — 各語別人數趨勢線
/dashboard/student/:id  — 學生個人履歷
/dashboard/class/:year/:grade/:class — 某班歷年組成
```

**技術**:Chart.js / Recharts 繪圖,Supabase 查詢。

**預計工時**:3-5 天

---

## 🎨 第六波:精緻化微優化(新)

完成基本功能後,這些**小而美的微互動**能大幅提升質感。

### 1️⃣7️⃣ 載入骨架(Skeleton loader)

**為什麼**:解析大檔時畫面是白的,使用者不確定有沒有掛掉。

**做法**:

```css
.skeleton {
  background: linear-gradient(90deg, var(--surface-2) 0%, var(--surface-3) 50%, var(--surface-2) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-sm);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-row { height: 44px; margin-bottom: 4px; }
```

解析時:

```javascript
function showSkeleton() {
  $('tableWrap').innerHTML = `
    <div style="padding: 12px">
      ${Array(8).fill('<div class="skeleton skeleton-row"></div>').join('')}
    </div>`;
}
```

**預計工時**:30 分鐘

---

### 1️⃣8️⃣ 解析進度條(Progress bar)

**為什麼**:1000+ 筆資料解析時,給一個「正在處理...56%」的回饋。

**做法**:

```html
<div class="progress" id="parseProgress" style="display:none">
  <div class="progress-bar" style="width:0%"></div>
  <span class="progress-label">正在解析...</span>
</div>
```

```css
.progress {
  position: relative;
  height: 32px;
  background: var(--surface-2);
  border-radius: var(--r-full);
  overflow: hidden;
  margin: 12px 0;
}
.progress-bar {
  height: 100%;
  background: var(--grad-brand);
  transition: width 0.2s ease-out;
}
.progress-label {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
```

解析時分批處理並更新:

```javascript
async function parseWithProgress(workbook, onProgress) {
  const sheets = workbook.SheetNames;
  const result = [];
  for (let i = 0; i < sheets.length; i++) {
    await new Promise(r => requestAnimationFrame(r));  // 讓 UI 更新
    const sheet = workbook.Sheets[sheets[i]];
    parseOldSheet(XLSX.utils.sheet_to_json(sheet, {header:1, defval:'', raw:false}), result);
    onProgress((i + 1) / sheets.length);
  }
  return result;
}
```

**預計工時**:1 小時

---

### 1️⃣9️⃣ 100% 配對時 confetti 慶祝

**為什麼**:成就感強化。教師會心一笑後更愛用這個工具。

**做法**:用 [canvas-confetti](https://github.com/catdad/canvas-confetti)(12KB,內嵌亦可):

```html
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
<script>
function celebrate() {
  const duration = 2500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366f1', '#a855f7'] });
    confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366f1', '#a855f7'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
// 在 renderAlerts 末尾:
if (successRate === 100 && !sessionStorage.celebrated) {
  celebrate();
  sessionStorage.celebrated = '1';
}
</script>
```

**預計工時**:15 分鐘

---

### 2️⃣0️⃣ Hover tooltip 顯示快捷鍵

**為什麼**:提醒使用者「原來這個按鈕有快捷鍵」。

**做法**:在所有按鈕的 `title` 加上 `(Ctrl+X)`,或用 custom tooltip(更美):

```html
<button data-tooltip="匯出平面表 (Ctrl+E)">...</button>

<style>
[data-tooltip] { position: relative; }
[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text);
  color: var(--surface);
  padding: 6px 10px;
  border-radius: var(--r-sm);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  animation: fadeIn 0.15s;
}
</style>
```

**預計工時**:30 分鐘

---

### 2️⃣1️⃣ Button 點擊漣漪效果(Material ripple)

**為什麼**:手感+1。

```css
.btn {
  position: relative;
  overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 10.01%);
  background-position: 50% 50%;
  background-size: 10000% 10000%;
  opacity: 0;
  transition: background-size 0.5s, opacity 0.5s;
}
.btn:active::after {
  background-size: 100% 100%;
  opacity: 1;
  transition: 0s;
}
```

**預計工時**:10 分鐘

---

### 2️⃣2️⃣ 搜尋歷史 + 常用篩選預設

**為什麼**:重度使用者常反覆搜同幾個字,預設能更快。

**做法**:

```javascript
// 記錄最近 5 筆搜尋
const HISTORY_KEY = 'searchHistory';
function pushHistory(q) {
  if (!q.trim()) return;
  let h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  h = [q, ...h.filter(x => x !== q)].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

// 搜尋框下拉顯示歷史
$('searchInput').addEventListener('focus', showSearchHistory);

// 快速篩選預設
const PRESETS = [
  { label: '🟡 只看疑似', filter: { status: 'fuzzy' } },
  { label: '🔴 只看未配對', filter: { status: 'unmatched' } },
  { label: '🔀 只看異動', filter: { status: 'changed' } },
];
```

**預計工時**:1 小時

---

### 2️⃣3️⃣ Onboarding Tour(首次使用引導)

**為什麼**:同事第一次打開,不知道從哪開始。

**做法**:用 [Shepherd.js](https://shepherdjs.dev/)(輕量 JS 教學引導):

```javascript
const tour = new Shepherd.Tour({ /* config */ });
tour.addSteps([
  { id: 'hero', text: '歡迎使用本土語分班配對系統!', attachTo: { element: '.hero', on: 'bottom' } },
  { id: 'step1', text: '先從這裡上傳舊名單', attachTo: { element: '#card1', on: 'right' } },
  { id: 'step2', text: '再從這裡上傳新編班', attachTo: { element: '#card2', on: 'left' } },
  { id: 'theme', text: '想切深色模式?按這裡或 Ctrl+D', attachTo: { element: '#themeToggle', on: 'left' } },
]);
// 首次打開才跑
if (!localStorage.getItem('tour_done')) {
  setTimeout(() => tour.start(), 800);
  localStorage.setItem('tour_done', '1');
}
```

**預計工時**:2 小時

---

### 2️⃣4️⃣ 音效反饋(可關閉)

**為什麼**:上傳成功、配對完成有聲音,體驗更生動。

**做法**:用 Web Audio API 合成短音(不用額外檔案):

```javascript
const ac = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq = 440, duration = 0.1, type = 'sine') {
  if (localStorage.getItem('soundOff') === '1') return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain); gain.connect(ac.destination);
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ac.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ac.currentTime + duration);
  osc.start();
  osc.stop(ac.currentTime + duration);
}
// 上傳成功
playTone(880, 0.1); setTimeout(() => playTone(1318, 0.15), 80);
// 錯誤
playTone(220, 0.2, 'square');
```

頂部加 🔔/🔕 切換。

**預計工時**:1 小時

---

### 2️⃣4️⃣-A 行內快速動作(Row hover actions)

**為什麼**:預覽/結果表格的列,滑鼠懸停時出現「快速動作」icon(複製、編輯、定位、刪除),比右鍵選單更直覺。

**做法**:

```css
.preview-table tbody tr { position: relative; }
.row-actions {
  position: absolute;
  right: 8px; top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--t-fast);
}
.preview-table tbody tr:hover .row-actions {
  opacity: 1;
  pointer-events: auto;
}
.row-actions button {
  width: 28px; height: 28px;
  padding: 0;
  display: grid; place-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: 13px;
}
.row-actions button:hover { background: var(--brand-100); border-color: var(--brand-400); }
```

```html
<td>
  姓名...
  <span class="row-actions">
    <button title="複製姓名" data-action="copy">📋</button>
    <button title="編輯" data-action="edit">✏️</button>
    <button title="定位到主表" data-action="locate">📍</button>
  </span>
</td>
```

**預計工時**:2 小時

---

### 2️⃣4️⃣-B 表格排序動畫

**為什麼**:點欄位排序時,列跳來跳去會讓使用者失焦。加個 FLIP 動畫讓變化流暢。

**做法**:用 FLIP 技巧(First-Last-Invert-Play):

```javascript
function sortWithAnimation(rows, sortFn) {
  // 1. First: 記錄每列目前位置
  const firstPositions = new Map();
  rows.forEach(row => {
    firstPositions.set(row.dataset.id, row.getBoundingClientRect().top);
  });
  // 2. 執行排序 + 重繪
  const sorted = [...rows].sort(sortFn);
  tbody.innerHTML = '';
  sorted.forEach(row => tbody.appendChild(row));
  // 3. Last: 記錄新位置,Invert: 計算差值並套用 transform
  sorted.forEach(row => {
    const last = row.getBoundingClientRect().top;
    const first = firstPositions.get(row.dataset.id);
    const delta = first - last;
    if (delta) {
      row.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0)' }],
        { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }
  });
}
```

**預計工時**:2 小時

---

### 2️⃣4️⃣-C Empty state 情境插畫

**為什麼**:資料還沒上傳時,畫面空蕩蕩。用個插畫 + 引導文案會溫暖許多。

**做法**:當 `#resultsSection` 隱藏但使用者已滾到下方時,改顯示引導區塊:

```html
<div class="empty-landing">
  <div class="empty-illustration">
    <!-- SVG 插畫:兩個 Excel 檔案 + 箭頭指向魔法棒 -->
  </div>
  <h3>完成上傳後,配對結果會出現在這裡</h3>
  <p>您也可以先下載範本了解格式</p>
  <button class="btn btn-primary" onclick="$('downloadTemplate').click()">📥 下載範本</button>
</div>
```

SVG 插畫可以用 [unDraw](https://undraw.co/)(MIT 授權可商用,且可自訂顏色)。

**預計工時**:1 小時

---

## 🧠 第七波:智慧化(新)

當工具從「配對器」進化成「助理」。

### 2️⃣5️⃣ 同音字/形近字容錯(超越 Levenshtein)

**為什麼**:中文錯字常是同音(ㄓㄗ)或形近(宇/字),Levenshtein 距離可能是 1 但也可能是 2。

**做法**:建立音近/形近字對照表:

```javascript
const PHONETIC_GROUPS = [
  ['彥', '延', '衍', '雁'],   // ㄧㄢˋ
  ['翊', '翌', '亦', '奕'],   // ㄧˋ
  ['宇', '語', '雨', '羽'],   // ㄩˇ
  ['芯', '心', '新', '昕'],   // ㄒㄧㄣ
  // ...更多
];
const VISUAL_GROUPS = [
  ['均', '鈞', '昀', '畇'],   // 左右結構相似
  ['翊', '翌'],
  ['萓', '宣', '瑄', '萱'],
  // ...
];

function phoneticDistance(a, b) {
  if (a === b) return 0;
  if (a.length !== b.length) return 99;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    const phoneticMatch = PHONETIC_GROUPS.some(g => g.includes(a[i]) && g.includes(b[i]));
    const visualMatch = VISUAL_GROUPS.some(g => g.includes(a[i]) && g.includes(b[i]));
    diff += phoneticMatch || visualMatch ? 0.3 : 1;  // 軟權重
  }
  return diff;
}
```

在模糊比對中,若 `phoneticDistance <= 0.5` 就視為「高信心疑似配對」。

**資料來源**:可從 Unicode CJK 資料庫自動產生形近字表,或網上找現成的同音字資料。

**預計工時**:4-6 小時(含建表)

---

### 2️⃣6️⃣ 從過往配對自動學習

**為什麼**:若「黃紹語」每次都要手動對到「黃紹裕」,系統應該記起來,下次直接套用。

**做法**(搭配 #8 LocalStorage / Supabase):

```javascript
const LEARNED_ALIAS_KEY = 'learnedAliases';

function recordAlias(oldName, newName) {
  const aliases = JSON.parse(localStorage.getItem(LEARNED_ALIAS_KEY) || '{}');
  aliases[oldName] = newName;
  localStorage.setItem(LEARNED_ALIAS_KEY, JSON.stringify(aliases));
}

function applyLearnedAliases(oldStudents, newRoster) {
  const aliases = JSON.parse(localStorage.getItem(LEARNED_ALIAS_KEY) || '{}');
  const nameMap = new Map(newRoster.map(s => [s.name, s]));
  for (const s of oldStudents) {
    if (!nameMap.has(s.name) && aliases[s.name] && nameMap.has(aliases[s.name])) {
      const m = nameMap.get(aliases[s.name]);
      Object.assign(s, { newClass: m.newClass, newSeat: m.newSeat, matched: true, matchType: 'learned' });
    }
  }
}
```

在模糊/多候選 modal 確認後呼叫 `recordAlias(student.name, chosen.name)`。

**預計工時**:3 小時

---

### 2️⃣7️⃣ 異常偵測(outlier detection)

**為什麼**:若某班突然只剩 5 個閩語學生(預期 15),系統應該警示這可能是匯入錯誤。

**做法**:

```javascript
function detectAnomalies() {
  const alerts = [];
  // 1. 班級人數與預期差太多
  const classSize = {};
  for (const s of state.merged) {
    if (!s.matched) continue;
    classSize[s.newClass] = (classSize[s.newClass] || 0) + 1;
  }
  const sizes = Object.values(classSize);
  if (sizes.length) {
    const avg = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    for (const [cls, size] of Object.entries(classSize)) {
      if (Math.abs(size - avg) > avg * 0.5) {
        alerts.push({ type: 'class_size', cls, size, avg: avg.toFixed(1) });
      }
    }
  }
  // 2. 某班某語別從 10+ 變成 < 3
  // 3. 配對率低於 80%
  // 4. 未配對學生集中在某一班(可能是檔案錯誤)
  return alerts;
}
```

**預計工時**:3-4 小時

---

### 2️⃣8️⃣ 自動年級升級判定

**為什麼**:使用者不必選「2→3 年級」或「4→5 年級」,系統自動從檔名偵測。

**做法**:

```javascript
function detectGradeTransition(filename) {
  // "三年級_未分班.xlsx" → { from: 2, to: 3 }
  const zh2num = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6 };
  const m = filename.match(/([一二三四五六])年級/);
  if (m) {
    const to = zh2num[m[1]];
    return { from: to - 1, to };
  }
  const n = filename.match(/(\d)年級/);
  if (n) return { from: parseInt(n[1]) - 1, to: parseInt(n[1]) };
  return null;
}
```

上傳後自動在 Hero 區顯示:「偵測到:2 年級 → 3 年級 升級」。

**預計工時**:1 小時

---

### 2️⃣9️⃣ 智慧錯誤修復建議

**為什麼**:使用者上傳錯檔時,不只提示錯誤,還給建議。

**做法**:

```javascript
function diagnoseFile(wb) {
  const issues = [];
  const fixes = [];
  // 未找到「班級:」
  let hasClassLabel = false;
  for (const sn of wb.SheetNames) {
    const grid = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, defval: '' });
    for (const row of grid) {
      if (row.some(c => /^班級\s*[：:]/.test(String(c || '')))) hasClassLabel = true;
    }
  }
  if (!hasClassLabel) {
    issues.push('找不到「班級:」標籤');
    fixes.push('請確認檔案是「本土語名單」而非「新編班名冊」,或用 📥 下載範本');
  }
  // 姓名欄異常
  // 座號非數字
  // 工作表名稱可能有問題
  return { issues, fixes };
}
```

顯示於錯誤 toast 底下一個小面板。

**預計工時**:3 小時

---

### 3️⃣0️⃣ AI 摘要解讀(可選)

**為什麼**:若整合 Claude API,可以讓 AI 寫出自然語言的解讀:「本次配對 119 位學生中,閩語從 55 人增為 63 人(+14%),集中往 3年2班 流動。」

**做法**:用 Anthropic SDK(有 `claude-api` skill):

```javascript
async function aiSummarize(summary) {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    body: JSON.stringify(summary),
    headers: { 'Content-Type': 'application/json' }
  });
  return res.text();
}
```

(需要一個小後端 proxy,因為前端不能直接帶 API key)

**預計工時**:1-2 天(含後端 + 前端整合)

---

### 3️⃣1️⃣ 資料完整性驗證(Data Integrity Lint)

**為什麼**:使用者常在不知情下上傳了有問題的資料(座號重複、班級名稱錯字、姓名含特殊字元)。系統應該**主動掃描並提示**,而不是等到配對才發現。

**做法**:在解析完成後跑一次 lint,預覽 Modal 頂部顯示警示 banner。

```javascript
function lintOldData(students) {
  const issues = [];

  // 1. 同班同座號重複
  const seatMap = new Map();
  for (const s of students) {
    const k = `${s.oldClass}_${s.oldSeat}`;
    if (seatMap.has(k)) {
      issues.push({ type: 'duplicate_seat', severity: 'error',
        msg: `${s.oldClass} 座號 ${s.oldSeat} 重複:${seatMap.get(k).name} 與 ${s.name}` });
    }
    seatMap.set(k, s);
  }

  // 2. 姓名長度異常(1 字或 > 5 字)
  const oddNames = students.filter(s => s.name.length < 2 || s.name.length > 5);
  if (oddNames.length) {
    issues.push({ type: 'odd_name', severity: 'warning',
      msg: `發現 ${oddNames.length} 位姓名長度異常(${oddNames.slice(0, 3).map(s => s.name).join('、')})` });
  }

  // 3. 姓名含非中文字元(疑似貼錯)
  const nonCJK = students.filter(s => /[^\u4e00-\u9fff·‧・\s]/.test(s.name));
  if (nonCJK.length) {
    issues.push({ type: 'non_cjk', severity: 'warning',
      msg: `${nonCJK.length} 位姓名含非中文字元,可能是複製貼上時帶入` });
  }

  // 4. 班級人數異常(< 5 或 > 35)
  const byClass = {};
  for (const s of students) byClass[s.oldClass] = (byClass[s.oldClass] || 0) + 1;
  for (const [cls, n] of Object.entries(byClass)) {
    if (n < 5) issues.push({ type: 'tiny_class', severity: 'info', msg: `${cls} 只有 ${n} 人,請確認` });
    if (n > 35) issues.push({ type: 'huge_class', severity: 'warning', msg: `${cls} 有 ${n} 人,偏多` });
  }

  // 5. 座號跳號(1, 2, 3, 5, 6 — 缺 4)
  for (const cls of Object.keys(byClass)) {
    const seats = students.filter(s => s.oldClass === cls).map(s => parseInt(s.oldSeat)).sort((a, b) => a - b);
    const missing = [];
    for (let i = 1; i < seats[seats.length - 1]; i++) {
      if (!seats.includes(i)) missing.push(i);
    }
    if (missing.length && missing.length < 5) {
      issues.push({ type: 'seat_gap', severity: 'info',
        msg: `${cls} 缺座號:${missing.slice(0, 5).join(', ')}(可能是未選修本土語)` });
    }
  }

  return issues;
}
```

UI 顯示:

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ 資料檢查發現 3 個問題(1 錯誤 / 2 警告)          │
│                                                     │
│ 🔴 3年1班 座號 8 重複:王小明 與 陳小明             │
│ 🟡 發現 2 位姓名含非中文字元                        │
│ 🟡 3年5班 有 37 人,偏多                            │
│                                                     │
│                                         [ 查看詳細 ]│
└─────────────────────────────────────────────────────┘
```

**預計工時**:3-4 小時

---

### 3️⃣2️⃣ 格式自動修正建議

**為什麼**:資料常有「看得見的小問題」(全形空白、前後空白、錯字),使用者自己掃不到。系統偵測後提供「一鍵修正」。

**做法**:

```javascript
function suggestFixes(student) {
  const fixes = [];
  // 前後空白
  if (student.name !== student.name.trim()) {
    fixes.push({ field: 'name', current: student.name, suggested: student.name.trim(),
      reason: '去除前後空白' });
  }
  // 全形空白
  if (/[　]/.test(student.name)) {
    fixes.push({ field: 'name', current: student.name, suggested: student.name.replace(/　/g, ''),
      reason: '去除全形空白' });
  }
  // 班級中的全形數字
  if (/[０-９]/.test(student.oldClass)) {
    fixes.push({ field: 'oldClass', current: student.oldClass,
      suggested: student.oldClass.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)),
      reason: '全形數字轉半形' });
  }
  // 常見錯字(「班」vs「斑」)
  if (/\d+年\d+斑/.test(student.oldClass)) {
    fixes.push({ field: 'oldClass', current: student.oldClass,
      suggested: student.oldClass.replace('斑', '班'),
      reason: '「斑」應為「班」' });
  }
  return fixes;
}
```

UI:在預覽 modal 底部有「🔧 一鍵修正 N 個小問題」按鈕,點擊後顯示預覽差異並讓使用者確認。

**預計工時**:3 小時

---

### 3️⃣3️⃣ 班級人數平衡視覺化

**為什麼**:配對後想知道「是否均衡」。橫條圖比數字直覺。

**做法**:用純 CSS grid + bar 做,不用引入 Chart.js:

```html
<div class="balance-chart">
  <div class="balance-row">
    <span class="label">3年1班</span>
    <div class="bar-group">
      <div class="bar bar-min" style="width:20%"><span>閩 15</span></div>
      <div class="bar bar-kei" style="width:12%"><span>客 6</span></div>
      <div class="bar bar-tribe" style="width:8%"><span>族 3</span></div>
    </div>
    <span class="total">24</span>
  </div>
  <!-- ...每班一列 -->
</div>
```

配色沿用語別 tag 顏色,hover 時顯示 tooltip。

**預計工時**:2-3 小時

---

### 3️⃣4️⃣ 智慧合併建議(偵測重複上傳)

**為什麼**:使用者若兩次上傳包含同一個學生的檔案,目前會重複。系統應該提示「這筆已存在」。

**做法**:

```javascript
function detectDuplicateUploads(newBatch, existing) {
  const existingKeys = new Set(existing.map(s => `${normalizeName(s.name)}_${s.oldClass}_${s.oldSeat}`));
  const duplicates = newBatch.filter(s => {
    const k = `${normalizeName(s.name)}_${s.oldClass}_${s.oldSeat}`;
    return existingKeys.has(k);
  });
  if (duplicates.length > 0) {
    return confirm(`偵測到 ${duplicates.length} 筆與現有資料重複的記錄。\n\n選擇處理方式:\n- 確定 = 跳過重複,只加入新資料\n- 取消 = 全部加入(可能造成重複)`);
  }
  return true;
}
```

**預計工時**:1 小時

---

## 🎓 教學現場場景建議

### 情境 A:每學期例行作業

- 學期初跑 1 次 → 匯出分班名單 → LINE 推給導師
- 學期中轉學生更新 → 手動編輯單筆(#2)
- 學期末歸檔 → PDF/HTML 備查

**推薦優化順序**:#1 PWA → #7 a11y → #14 LINE → #10 虛擬捲動

---

### 情境 B:跨校教研社群

- 桃園某區 10 所小學都用這套工具
- 某校的教務組長想比較「我們學校的閩語比例跟區域平均」

**推薦優化順序**:#13 Supabase → #16 Dashboard → #12 i18n → #30 AI 摘要

---

### 情境 C:行政自動化極致

- 教務處想要「月報」:每月 1 號自動寄本土語現況給校長
- 某班某語別人數低於 5 人自動通知

**推薦優化順序**:#15 Firebase 排程 → #27 異常偵測 → #14 LINE → #13 Supabase

---

### 情境 D:個人最小化使用

- 只有資訊組長一人用,每年跑 1 次
- 不想架伺服器、不想管帳號

**推薦優化順序**:#1 PWA → #23 Onboarding → #2 手動編輯 → #6 URL 分享

---

### 情境 E:推廣給鄰校

- 想把工具介紹給隔壁學校的老師
- 需要「複製網址就能用」的最簡體驗

**推薦優化順序**:#23 Onboarding → #20 Tooltip → #1 PWA → #6 URL 分享

---

## 📈 推薦開發路徑

### 🥇 第 1 個月 · 穩定強化(10-15 小時)

完成第三波前 3 項:

- [ ] #1 PWA Service Worker(2-3 小時)
- [ ] #2 手動編輯單筆(3-4 小時)
- [ ] #4 剪貼簿貼上(2 小時)
- [ ] 一部分第六波:#17 Skeleton、#19 confetti、#20 tooltip、#21 ripple(約 2 小時)

**產出**:v2.5,全校教師可以日常使用

---

### 🥈 第 2-3 個月 · 功能完整(30-40 小時)

完成第三波剩餘 + 第四波 E2E 測試:

- [ ] #3 側邊對照(1 天)
- [ ] #5 師資配課建議(4 小時)
- [ ] #6 URL 分享(1 小時)
- [ ] #7 a11y 完善(4-6 小時)
- [ ] #11 Playwright E2E(1 天)
- [ ] 第六波剩餘:#18 progress、#22 搜尋歷史、#23 onboarding、#24 音效

**產出**:v3.0,可以正式對外推廣

---

### 🥉 暑假 · 架構升級(5-7 天)

- [ ] #8 TypeScript + Vite 拆檔(2-3 天)
- [ ] #9 Web Workers(1 天)
- [ ] #10 虛擬捲動(1 天)
- [ ] #12 i18n(1-2 天)

**產出**:v4.0,程式碼結構可以 open source

---

### 🏆 隔年 · 服務化(2-3 個月兼職)

- [ ] #13 Supabase + OAuth(2-3 天)
- [ ] #14 LINE Bot(3-4 天)
- [ ] #15 Firebase 排程(4-5 天)
- [ ] #16 Dashboard(3-5 天)
- [ ] #25-30 智慧化功能(2 週)

**產出**:v5.0,完整雲端服務,可供桃園市或全台使用

---

## 🧭 開發守則

### 基本原則

1. **單檔 HTML 優先** — 所有不需後端的功能,維持單檔。`index.html` 目前 116KB,可撐到 250KB 左右(約再加 40 項功能)。
2. **每加新功能先寫測試** — `test-*.js`(Node.js)或 Playwright(瀏覽器)。
3. **深色模式同步** — 新增任何顏色都必須檢查 `[data-theme="dark"]` 有對應版本。
4. **向下相容資料格式** — v1 匯出的 Excel,v5 必須還能讀取。
5. **a11y 不是加分題** — 這是公部門工具,無障礙是基本要求。
6. **版本標記** — 用 `git tag v2.1`,每個版本可回滾。
7. **離線優先** — 設計時預設「使用者可能斷線」,關鍵功能不該依賴網路。
8. **隱私第一** — 學生資料不該無故上雲。即使有雲端版,也要保留「純本機版」選項。

### 每次改動的 checklist

- [ ] JS 語法檢查(`node -e "new Function(code)"`)
- [ ] 瀏覽器 console 無錯誤
- [ ] 深色/淺色模式都確認過
- [ ] 手機/平板/桌機都看過(Chrome DevTools 響應式)
- [ ] 新增的 aria-label、role、tabindex 都加了
- [ ] 有更新 README 或 OPTIMIZATION
- [ ] 有自動/手動測試上傳 → 配對 → 匯出流程
- [ ] `prefers-reduced-motion` 下動畫有縮減或關閉

### 部署 checklist(推上 GitHub Pages 前)

- [ ] `.gitignore` 確認排除學生實際資料檔
- [ ] `git status` 沒有任何含學生姓名的 xlsx
- [ ] OG 圖能正確顯示(用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 測試)
- [ ] favicon 在各瀏覽器都能看到
- [ ] 用 `gh api repos/:owner/:repo/pages` 確認 Pages 啟用
- [ ] 部署後用手機、平板、桌機各測一遍

---

## 📮 需要協助時

| 問題類型 | 用什麼 |
|----------|--------|
| 寫程式 | Claude Code(貼出需求 + 相關程式碼) |
| 除錯 | 附上完整錯誤訊息(F12 → Console) |
| GitHub Pages 部署 | `github-pages-auto-deploy` skill |
| PWA 快取問題 | `pwa-cache-bust` skill |
| Supabase 整合 | `supabase-google-oauth-integration` skill |
| Firebase CI | `firebase-ci-troubleshooter` skill |
| LINE Bot | `line-messaging-firebase` skill |
| API / AI 整合 | `claude-api` skill |

---

**最後提醒**:優化無止境,但對您來說「能用、同事會用」才是最重要的。

**先求有、再求好、最後才求完美**。

已完成 **30 項**,還有 **56 項**藍圖。每完成一項回來打 ✅,年底再回頭看會很有成就感。

---

## 📅 版本節奏對照

| 版本 | 日期 | 累計功能 | 一句話定位 |
|------|------|:-----:|-----------|
| v1.0 | 2026-04-20 | 8 | 能動,且解析正確 |
| v1.1 | 2026-04-20 | 12 | 好用(範本 + 模糊比對 + 多檔) |
| v2.0 | 2026-04-20 | 18 | 好看(設計系統 + 深色模式) |
| v2.1 | 2026-04-20 | 27 | 完整(Toast + 快捷鍵 + favicon + OG) |
| **v2.2** | **2026-04-21** | **30** | **透明**(預覽 Modal + CTA 升級) |

---

## 🔭 預告 — 未來版本怎麼跳

| 版本 | 預計內容 | 預計時程 |
|------|---------|---------|
| **v2.3** | 第一波小品 · Skeleton、confetti、tooltip、ripple | 2-3 小時 |
| **v2.5** | 完成第三波:PWA SW + 手動編輯 + CSV 貼上 | 1 個月 |
| **v3.0** | 完成大部分第三+四波:a11y + E2E + i18n | 3 個月 |
| **v4.0** | TypeScript 重構 + Web Workers + 虛擬捲動 | 暑假 |
| **v5.0** | Supabase + LINE Bot + 跨年度 Dashboard | 隔年 |

依您自己的節奏,不用趕。每個版本發佈後記得打 git tag(`git tag -a v2.3 -m "..."` 然後 `git push --tags`)。
