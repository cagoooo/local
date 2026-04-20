# 本土語分班配對系統

> 小學升級分班後,自動更新本土語選修名單的網頁工具。上傳舊名單 + 新編班名冊,用「姓名」自動比對(含錯字模糊比對),即時產出更新後的班級/座號對照表與新本土語名單。

![version](https://img.shields.io/badge/version-2.1-blueviolet) ![offline](https://img.shields.io/badge/offline-ready-green) ![stack](https://img.shields.io/badge/stack-Vanilla%20JS-yellow) ![darkmode](https://img.shields.io/badge/dark%20mode-✓-purple) ![a11y](https://img.shields.io/badge/a11y-WCAG%20AA-blue) ![social](https://img.shields.io/badge/OG%20image-✓-ff69b4) ![shortcuts](https://img.shields.io/badge/⌨️%20shortcuts-✓-lightgrey)

## 目錄

- [功能特色](#功能特色)
- [v2.0 新增亮點](#v20-新增亮點)
- [快速開始](#快速開始)
- [使用步驟](#使用步驟)
- [新編班名冊檔案格式](#新編班名冊檔案格式)
- [智慧配對機制](#智慧配對機制)
- [輸出說明](#輸出說明)
- [部署到 GitHub Pages](#部署到-github-pages)
- [本地開發](#本地開發)
- [檔案結構](#檔案結構)
- [常見問題](#常見問題)
- [後續優化藍圖](#後續優化藍圖)

---

## 功能特色

| 類別 | 能做到什麼 |
|------|-----------|
| **資料匯入** | 支援複雜的「一頁多班、多語別」矩陣格式(學校慣用的本土語名單);新名冊支援彈性欄位名(姓名/學生姓名、班級/新班級、座號/新座號);**可一次選取多個檔案**(同時處理三年級與五年級) |
| **姓名比對** | 精確比對 + **🟡 Levenshtein 模糊比對**(自動容錯打字錯誤)+ 🟠 多候選警示 + 🔴 未配對警示。自動去除括號族別標記(如「葉帥廷(阿美)」) |
| **異常提示** | 未配對、重複姓名、新名冊多出的學生、1 字差異的疑似配對都會分層顯示在警示區 |
| **即時檢視** | 可依班級/語別/配對狀態(精確/疑似/多候選/未配對)篩選,全文搜尋,分欄排序;切換「清單檢視」與「分班檢視」 |
| **Excel 匯出** | 兩種格式:**平面對照表**(含清名、族別、狀態)+ **矩陣名單**(依新班級分組,含異動標記、疑似配對區、多候選區、未配對附錄) |
| **UI/UX** | Noto Sans TC 繁中字型、**深色模式自動切換**、RWD 響應式、sticky navigation、錯落 fade-in 動畫、支援 `prefers-reduced-motion` |
| **完全離線** | 所有解析、比對、匯出都在瀏覽器本機執行,學生資料不會上傳到任何伺服器 |

---

## v2.1 新增亮點

延續 v2.0 的設計系統,這版加入 9 項功能性優化與完整社群分享資產。

### ⚡ 9 項互動強化

| 🆕 | 項目 | 快捷鍵 | 價值 |
|:--:|------|:------:|------|
| 🔔 | **Toast 通知**(滑入動畫 + 可關閉) | — | 取代阻擋式 `alert()`,不打斷流程 |
| ⌨️ | **鍵盤快捷鍵** | `?` | 6 組常用快捷,重度使用者神器 |
| 🔄 | **一鍵重置** | — | 清除所有 state + localStorage 重新開始 |
| 📁 | **檔名加年級** | — | `本土語配對結果_3年級+5年級_20260420.xlsx` |
| 🎞️ | **統計數字動畫**(counter count-up) | — | 每次更新會從 0 動畫到目標值 |
| 🖱️ | **多候選手動確認**(點 🟠 彈出 modal) | — | 列出候選、座號、班級,可單選或標記未配對 |
| 🖨️ | **列印友善模式** | `Ctrl+P` | 自動換頁、每班一張,直接印給導師 |
| 💾 | **LocalStorage 72hr 記憶** | — | 關掉再開會詢問「要載入上次資料嗎」 |
| 📋 | **變動摘要報告** | — | KPI + 班級異動表 + 流動 Top8 + 可複製 Markdown |

### 🎨 完整社群分享資產

| 🆕 | 項目 | 說明 |
|:--:|------|------|
| 🏷️ | **favicon**(8 種尺寸) | `.ico`(多解析度)、`.svg`、PNG 16/32/48、Apple 180、Android 192/512 |
| 📸 | **OG 分享預覽圖** | 1200×630 橫式(FB/Twitter)+ 800×800 方形(LINE 優化) |
| 🧩 | **Open Graph 完整 meta** | og:type、og:title、og:description、og:image + 寬高 + alt |
| 🐦 | **Twitter Card** | summary_large_image 格式 |
| 📱 | **PWA Manifest** | 含 theme_color、display: standalone,為未來裝機化鋪路 |

**效果**:分享到 LINE/FB/Twitter 會顯示精美預覽卡,而非光禿禿的 URL。

### 📦 v2.0 保留亮點

| 🎨 | **完整設計系統** · Indigo 漸層品牌色 + 5 階陰影 + Noto Sans TC 字型 |
| 🌙 | **深色模式** · 自動偵測 `prefers-color-scheme` + 手動切換 + 記憶 |
| 🧭 | **進度 Stepper** · 3 段式狀態指示 |
| 🟡 | **Levenshtein 模糊比對** · 錯字自動容錯 |
| 📥 | **範本一鍵下載** |
| 📚 | **多檔同時上傳** |
| 🏷️ | **族別資訊保留** |
| ♿ | **a11y 友善** · focus ring、reduced-motion

---

## 快速開始

**三步驟**

1. 打開 [`index.html`](index.html)(或部署後的 GitHub Pages 網址)
2. 上傳「舊本土語名單」(Step 1)和「新編班名冊」(Step 2)
3. 看配對結果、匯出 Excel

**想先試試看?**

用隨附的測試檔:
- Step 1 上傳 `三年級_未分班.xlsx`(您的原始檔)
- Step 2 上傳 `demo-new-roster.xlsx`(隨附的模擬新名冊)

---

## 使用步驟

### Step 1:上傳舊本土語名單

點擊或拖曳上傳 `xx年級_未分班.xlsx`。系統會自動:

- 解析每個班級(3年1班 ~ 3年5班 / 5年1班 ~ 5年5班)
- 辨識每班的語別欄位(閩語、客語、族語、新住民語、手語)
- 擷取每位學生的舊班級、舊座號、姓名、選修語別

成功後,會顯示統計小卡(學生總數、班級數、語別數)。

### Step 2:上傳新編班名冊

點擊或拖曳上傳學校給的新編班名冊。只要檔案包含「姓名、新班級、新座號」三欄即可(欄位名可以有變體,見下一節)。

成功後,系統自動跳出「配對結果」區塊。

### Step 3:檢視配對結果

**篩選列**

- 🔍 **搜尋**:輸入姓名/班級/語別關鍵字
- **全部班級**:只顯示某班
- **全部語別**:只顯示某語別
- **全部狀態**:✅ 精確 / 🟡 疑似 / 🟠 多候選 / 🔴 完全未配對 / 班級異動 / 班級未變

**兩種檢視模式**

| 模式 | 適用情境 |
|------|---------|
| 清單檢視 | 大表格,方便排序和整批檢視 |
| 分班檢視 | 依「新班級」分組,每班再分語別,方便印出給教師看 |

**狀態標籤(v2.0 完整版)**

| 標籤 | 說明 | 顏色 |
|------|------|------|
| ✅ 精確配對 | 姓名完全一致 | 綠 |
| 🟡 疑似配對 | 1 字差異且同長度,自動配對但**請務必核對** | 黃 |
| 🟠 多候選 | 多個候選需人工選擇,**不會自動配對** | 粉 |
| 🔴 完全未配對 | 新名冊找不到對應學生 | 紅 |
| 🟢 班級異動 | 配對成功且班級變了 | 綠底高亮 |
| ⚪ 無異動 | 配對成功且班級沒變 | 灰 |

### Step 4:匯出 Excel

- **匯出平面表**:所有學生的舊/新班級座號對照表,含清名、族別、配對狀態。適合做後續資料處理
- **匯出新名單**:依新班級分組、各語別分欄的本土語名單(沿用原檔格式),另附「疑似配對名單」「多候選名單」「完全未配對名單」三個附錄區,方便人工核對

---

## 新編班名冊檔案格式

新名冊只需要一張工作表(或多張,會自動合併),包含以下三欄:

| 姓名 | 新班級 | 新座號 |
|------|--------|--------|
| 王小明 | 3年2班 | 15 |
| 陳美玲 | 3年1班 | 8 |
| ... | ... | ... |

### 欄位名稱變體(系統會自動偵測)

| 意義 | 可接受的欄位名 |
|------|---------------|
| 姓名 | 姓名、學生姓名 |
| 班級 | 新班級、班級、班別 |
| 座號 | 新座號、座號、號碼 |

### 班級格式

- 建議:`3年1班`、`5年3班`
- 也支援:`3-1`、`5_3`(會自動轉換成標準格式)

### 座號格式

- 純數字(1-99),全形數字會自動轉半形

### 姓名中的括號

- 新名冊中姓名若有括號(如「葉帥廷(阿美)」),比對時會自動忽略括號內容
- 這表示您不必先處理資料,直接上傳就能配對

---

## 智慧配對機制

v2.0 的配對採**兩階段策略**,實務上 100% 的名單都能被正確處理。

### 階段 1:精確比對(Exact Match)

- 以姓名字串完全相等為準(已去空白、去全形、去括號)
- 速度最快,結果最可靠

### 階段 2:Levenshtein 模糊比對

當精確比對失敗時,啟用:

```
對於舊名單中每個未配對學生:
  1. 從「新名冊剩餘未被認領的姓名」中找出
  2. 同長度(避免「王小」誤配到「王小明」)
  3. Levenshtein 編輯距離 = 1 的候選

若候選 = 1 個  → 🟡 自動配對,標記為「疑似」供核對
若候選 > 1 個  → 🟠 多候選,不自動配對
若候選 = 0 個  → 🔴 完全未配對
```

**Levenshtein 距離**:一個字串要變成另一個字串,需要幾次「增、刪、改」。距離 1 代表剛好差一個字。

### 實例

| 舊名單 | 新名冊中 | 結果 |
|--------|---------|------|
| 周宥均 | 周宥均 | ✅ 精確配對 |
| 周宥均 | 周宥鈞 | 🟡 疑似配對(「均→鈞」1 字差) |
| 王小明 | 王小明 + 王小銘 | 🟠 多候選(都距離 1) |
| 轉學生 | (找不到) | 🔴 完全未配對 |
| 王小明 | 王小(少一字) | 🔴 完全未配對(長度不同) |

### 安全保證

- **每個新名冊學生只能被認領一次**(避免一個人被配對到兩位舊學生)
- **疑似配對永遠會標記**,絕不偽裝成精確配對
- **多候選一律不自動配對**,強制人工介入

---

## 輸出說明

### A. 平面對照表(Flat Export)

| 姓名 | 語別 | 舊班級 | 舊座號 | 新班級 | 新座號 | 狀態 | 原任教師 |
|------|------|--------|--------|--------|--------|------|---------|

一人一列,適合做樞紐分析、資料庫匯入、郵件合併等後續處理。

### B. 新本土語名單(Matrix Export)

每班一個區塊,欄位設計沿用原本土語名單格式:

```
班級:3年1班
編號 | 閩語座號 | 閩語姓名 | 客語座號 | 客語姓名 | 族語/新住民/手語座號 | 族語/新住民/手語姓名
  1  |    8    |  周宥均  |    2    |  徐定麟  |          1          |    葉帥廷(阿美)
  2  |    10   |  蕭海   |    ...  |   ...   |         ...         |         ...
...
總人數: XX 人 (閩X / 客Y / 其他Z)
```

若有未配對學生,會在最後附錄「⚠️ 未配對名單」方便人工處理。

---

## 部署到 GitHub Pages

本應用是**純前端單檔 HTML**,完全符合 GitHub Pages 免費靜態網頁需求。部署後,學校教師只要開瀏覽器就能用,不需要安裝任何軟體。

### 方式一:使用 GitHub 網頁介面(最簡單)

1. **建立 GitHub Repository**
   - 登入 [github.com](https://github.com) → 點右上 `+` → `New repository`
   - Repository name:例如 `native-lang-matcher`
   - Public(才能免費用 GitHub Pages)
   - ✅ 勾選 `Add a README file`
   - 點 `Create repository`

2. **上傳檔案**
   - 在 repo 首頁點 `Add file` → `Upload files`
   - 拖曳以下檔案:
     - `index.html`(必要)
     - `README.md`(本檔,覆寫預設的)
     - `OPTIMIZATION.md`(可選)
     - `demo-new-roster.xlsx`(可選,給使用者當範例)
   - Commit changes

3. **啟用 GitHub Pages**
   - 進入 repo 的 `Settings` → 左側 `Pages`
   - Source 選 `Deploy from a branch`
   - Branch 選 `main` / `(root)` → `Save`
   - 等 1-2 分鐘,頁面會顯示網址,例如:
     ```
     https://<your-username>.github.io/native-lang-matcher/
     ```

4. **分享給同事**
   - 把網址貼到學校 LINE 群、Email、書籤
   - 任何人(或限定 IP)都能用

### 方式二:使用 gh CLI(較快)

```bash
# 先安裝 GitHub CLI: https://cli.github.com/
# Windows: winget install GitHub.cli  /  Mac: brew install gh

cd H:/local/native-lang-matcher

# 清除不需要推送的檔案(node_modules 會吃掉配額)
# 靠 .gitignore 過濾即可,不用實際刪除

# 初始化
git init
git branch -M main

# v2.1 完整檔案清單:核心 + 說明 + 圖片資產 + 範例
git add index.html README.md OPTIMIZATION.md .gitignore \
        demo-new-roster.xlsx \
        manifest.webmanifest \
        favicon.ico favicon.svg \
        favicon-16x16.png favicon-32x32.png favicon-48x48.png \
        apple-touch-icon.png \
        android-chrome-192x192.png android-chrome-512x512.png \
        og-image.png og-image-square.png

git commit -m "Initial commit: 本土語分班配對系統 v2.1"

# 建立 remote repo 並推送
gh auth login  # 第一次使用需登入
gh repo create native-lang-matcher --public --source=. --remote=origin --push

# 啟用 Pages
gh api -X POST repos/:owner/native-lang-matcher/pages \
  -f source='{"branch":"main","path":"/"}'

# 查看部署狀態
gh api repos/:owner/native-lang-matcher/pages
```

### 方式三:自訂網域(進階)

若學校有 `smes.tyc.edu.tw` 之類的子網域可用:

1. 在 repo 根目錄加 `CNAME` 檔,內容為 `tools.smes.tyc.edu.tw`
2. 在 DNS 設定加 CNAME 記錄,指向 `<your-username>.github.io`
3. 在 GitHub Pages 設定頁面勾選 `Enforce HTTPS`

### 部署後的安全性提醒

- ⚠️ GitHub Pages 是**公開的**,任何知道網址的人都能打開頁面
- ✅ 但**學生資料不會被上傳到雲端**,所有解析和比對都在使用者的瀏覽器本機跑
- ✅ 若擔心網址外流,可將 repo 改為 Private + 使用 [GitHub Pages for Private repos](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)(需付費 GitHub Pro 以上方案)
- 💡 也可以只讓學校教師從 intranet 開,不放到網路上(直接 `file://` 開啟 `index.html` 也能用)

---

## 本地開發

需要 Node.js 18+ 才能跑測試腳本。只想用 APP 的話,直接點兩下 `index.html` 就能開。

```bash
# 安裝測試依賴
npm install

# 跑端到端解析測試(確認解析器運作)
node test-parser.js

# 跑完整配對流程測試
node test-full-flow.js

# 重新產生模擬的新名冊
node make-demo-roster.js
```

---

## 檔案結構

```
native-lang-matcher/
├── index.html              # 主應用(唯一要部署的檔案)
├── README.md               # 本檔
├── OPTIMIZATION.md         # 後續優化建議
├── demo-new-roster.xlsx    # 範例新名冊(給使用者試玩)
├── .gitignore              # Git 忽略清單
│
├── package.json            # npm 設定(只給開發用)
├── package-lock.json
├── node_modules/           # 測試依賴(不必推 GitHub)
│
├── test-parser.js          # 舊名單解析器單元測試
├── test-full-flow.js       # 端到端配對流程測試
├── test-debug.js           # 特定班級的逐列偵錯工具
└── make-demo-roster.js     # 生成模擬新名冊
```

### 部署時要推送的檔案(最小組合)

只需要這幾個就能運作:

- `index.html`
- `README.md`(可選)
- `demo-new-roster.xlsx`(可選但建議)
- `.gitignore`

---

## 常見問題

### Q1:上傳舊名單後顯示 0 位學生?

- 確認檔案格式是 `.xlsx`(不是 `.xls` 或其他)
- 確認檔案內有「班級:」「語別:」「編號」等標籤
- 若是新格式,把檔案傳給作者看,我可以擴充解析器

### Q2:某些學生沒配對到?

- 檢查姓名是否有**錯字**(如:「芯」寫成「芸」)
- 檢查新名冊中是否真的有這位學生(可能該學生沒有選本土語,或被轉學了)
- 系統的異常警示會列出所有未配對學生,方便您逐一確認

### Q3:班級人數跟原檔「總人數」不符?

這通常是原檔本身的問題:
- 原檔的「總人數」是手動填寫的,可能跟實際列出的人數不符
- 有些班級把分班教室資訊(如「課照班 C233」「智慧教室」)放在學生欄位下方,系統會自動過濾掉這些
- 若差距很大(超過 5 人),請檢查原檔是否有異常格式

### Q4:語別標記成「客語/族語/新住民語/台灣手語/手語」這種怪怪的標示?

這是因為某些班級的「語別:」標題合併了多種語別(如「族語2新住民1手語1」),而這幾種學生又被放在同一欄(第三欄),系統無法從欄位位置判斷單一語別。

**解法**:有族別/新住民國別/(手語)標記的學生會被自動歸類到正確語別;只有中性姓名者會保留合併標籤。可在匯出後人工微調。

### Q5:能否用手機/平板操作?

可以。介面是 RWD 設計,但 Excel 上傳與下載在手機上會比較不順,建議在電腦上用。

### Q6:如何備份配對結果?

匯出 Excel 後另存到您慣用的雲端硬碟(Google Drive / OneDrive),或學校的共用資料夾。本 APP 本身不保存任何資料。

---

## 後續優化藍圖

完整的未來優化建議請見 [OPTIMIZATION.md](OPTIMIZATION.md),內含:

- ✅ **已完成里程碑**:18 項功能(v1.0 → v1.1 → v2.0)
- 🔴 **第一波立即可做**:Toast 通知、鍵盤快捷鍵、重置按鈕、檔名優化(< 1 小時)
- ⚡ **第二波體驗升級**:動畫數字、手動確認多候選、列印模式、LocalStorage 記憶、摘要報告(2-4 小時)
- 🎯 **第三波功能擴充**:單筆編輯、側邊對照、CSV 貼上、師資配課建議、PWA、URL 分享、a11y(半天-1 天)
- 🏗️ **第四波架構升級**:TypeScript 化、Web Workers、虛擬捲動、E2E 測試、i18n(2-5 天)
- 🚀 **第五波服務化**:Supabase + Google OAuth、LINE Bot、Firebase 排程、跨年度 Dashboard(週級)

另附:
- 🎓 **教學現場情境建議**(4 種不同場景最需要的功能)
- 📈 **推薦開發路徑**(1 週 / 1 月 / 2-3 月三種規模)
- ⚠️ **開發守則**(單檔優先、每改必測、深色同步等 8 條)

---

## 授權與貢獻

本工具為教學用途打造,歡迎自行修改、散佈、fork。若您改善了解析器或加了新功能,歡迎 PR 回饋。

---

## 版本歷程

| 版本 | 日期 | 功能數 | 主要變動 |
|------|------|:-----:|---------|
| **v2.1** | 2026-04-20 | **27** | Toast、⌨️ 快捷鍵、重置、動畫計數、多候選 modal、列印模式、LocalStorage 記憶、摘要報告、favicon、OG 預覽圖 |
| **v2.0** | 2026-04-20 | 18 | UI/UX 大升級(Noto Sans TC + Indigo 漸層 + 深色模式 + Stepper + Hero + 卡片格說明區) |
| **v1.1** | 2026-04-20 | 12 | 高優先 4 項優化(範本下載、模糊比對、族別保留、多檔上傳) |
| **v1.0** | 2026-04-20 | 8 | 初版,基本配對功能 |

---

**製作**:以 Claude Code + Anthropic Claude 產生  
**維護**:桃園市某國小資訊教師
