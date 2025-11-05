
# Aggregator Starter (Supabase + Vercel + GitHub Actions)

這是一個「資料聚合網站」的最小可行專案（MVP）。
- **Supabase**：資料庫（Postgres）＋ API ＋ Auth
- **Vercel + Next.js**：前端展示（App Router、ISR 自動重繪）
- **GitHub Actions + Python**：定時抓 RSS，寫入 Supabase

---

## 0) 你需要的帳號
- GitHub（放這個專案與跑排程）
- Supabase（雲端資料庫）
- Vercel（部署前端）

---

## 1) 建立 Supabase 專案
1. 到 https://supabase.com/ 註冊 → 建立新 Project
2. 在 Supabase 控台 → SQL Editor → 貼上 `supabase/schema.sql` 內容執行（建立 `items` 表與索引）
3. 到 **Project Settings → API**：
   - 複製 **Project URL**（`https://xxxx.supabase.co`）
   - 複製 **anon public** 與 **service_role** 金鑰
4. 到 **Authentication → Providers** 啟用 Email（可忽略，MVP 不用登入）

---

## 2) 設定 GitHub Repository
1. 建立一個新的 GitHub Repo（或把這個資料夾上傳上去）
2. 在 GitHub Repo → **Settings → Secrets and variables → Actions → New repository secret**：新增
   - `SUPABASE_URL` = 你的 Project URL（例：`https://xxxxx.supabase.co`）
   - `SUPABASE_SERVICE_ROLE` = 你的 service_role 金鑰（**機密**，只放在 GitHub secrets）
3. 調整 `scraper/feeds.txt` 內容，放你要抓的 RSS 來源（每行一個 URL）

> GitHub Actions 會每 3 小時跑一次 `scraper/scrape.py`，把新文章寫進 Supabase 的 `items` 表。

---

## 3) 部署前端到 Vercel
1. 到 https://vercel.com/ 登入 → **Add New → Project** → 匯入你的 GitHub Repo
2. 設定環境變數（**Project Settings → Environment Variables**）：
   - `NEXT_PUBLIC_SUPABASE_URL` = 和上面一樣的 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase 的 anon key
3. Root Directory 選擇 `web/`（因為前端在 web 子資料夾）
4. Deploy！

> 首頁會顯示 `items` 表中的最新文章（標題、來源、時間）。頁面使用 ISR（Incremental Static Regeneration），
> 預設每 10 分鐘自動重繪；若要立即重繪可以打 `/api/revalidate?tag=items&secret=YOUR_SECRET`。

---

## 4) 本機開發（可選）
1. 安裝 Node.js 18+ 與 pnpm 或 npm
2. 在 `web/` 底下：
   ```bash
   npm install
   npm run dev
   ```
3. 建立 `web/.env.local`，填入：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

---

## 5) 結構說明
```
supabase/
  schema.sql            # 建表 SQL
  .env.example          # 參考（不需要上線）

scraper/
  scrape.py             # 抓 RSS → 寫入 Supabase
  requirements.txt
  feeds.txt             # RSS 來源列表

web/                    # Next.js (App Router) 前端
  app/
    page.tsx           # 首頁，讀取 Supabase REST API 顯示
    layout.tsx
    globals.css
    api/revalidate/route.ts  # 手動 revalidate ISR 的 API
  lib/supabase.ts
  package.json
  tsconfig.json
  next.config.mjs

.github/workflows/scrape.yml  # 每 3 小時跑爬蟲
```

---

## 6) 換你改的地方（MVP → 你的站）
- 在 `scraper/feeds.txt` 放你的來源（先從有 RSS 的開始）
- 在 `web/app/page.tsx` 改版面（Logo、配色、分類）
- 想加搜尋：在 `schema.sql` 已經加了 trigram 索引，可使用 `ilike` 或 pg_trgm 模糊搜尋（可後續擴充）

---

## 7) 法務提醒
- 優先使用 **官方 RSS 或 API**
- 僅存 **標題／摘要／連結／時間** 等必要欄位，顯示全文前請確認授權或僅提供摘要＋原文連結
- 尊重 robots.txt 與來源網站條款

祝順利上線！🚀
