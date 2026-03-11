# 🚀 部署指南 - Cloudflare Pages

本專案已配置為靜態導出模式，可以直接部署到 Cloudflare Pages。

## ✅ 已完成的配置

1. **Next.js 靜態導出配置** (`next.config.js`)
   - ✅ `output: 'export'` - 啟用靜態導出
   - ✅ `images.unoptimized: true` - 禁用圖片優化（靜態導出必需）

2. **移除不支持的功能**
   - ✅ 移除動態 `app/sitemap.ts`（改用靜態 `public/sitemap.xml`）
   - ✅ 移除動態 `app/robots.ts`（改用靜態 `public/robots.txt`）
   - ✅ 簡化 `app/layout.tsx` 的 metadata（移除不支持的 OpenGraph 和 robots 配置）

3. **構建測試**
   - ✅ 成功執行 `npm run build`
   - ✅ 成功生成 `out/` 資料夾
   - ✅ 包含 `index.html`, `404.html`, `robots.txt`, `sitemap.xml`

## 📦 部署到 Cloudflare Pages

### 方法一：透過 GitHub 自動部署（推薦）

1. **在 GitHub 上創建新倉庫**
   ```bash
   # 已完成：倉庫名稱為 care-calculator
   # GitHub 帳號：lalawgwg99
   ```

2. **連接 Cloudflare Pages**
   - 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 進入 `Workers & Pages` > `Create application` > `Pages` > `Connect to Git`
   - 選擇 GitHub 帳號 `lalawgwg99`
   - 選擇倉庫 `care-calculator`

3. **配置構建設置**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Root directory: /
   ```

4. **環境變數（可選）**
   ```
   NODE_VERSION=18
   NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
   ```

5. **點擊 "Save and Deploy"**
   - Cloudflare 會自動構建並部署
   - 每次推送到 `main` 分支都會自動重新部署

### 方法二：手動上傳（快速測試）

1. **本地構建**
   ```bash
   npm run build
   ```

2. **上傳到 Cloudflare Pages**
   - 進入 Cloudflare Dashboard > Workers & Pages > Create application > Pages > Upload assets
   - 將 `out/` 資料夾拖曳上傳

## 🔧 部署後設置

### 更新網站 URL

部署完成後，請更新以下文件中的網站 URL：

1. **`public/sitemap.xml`**
   ```xml
   <loc>https://your-actual-domain.pages.dev</loc>
   ```

2. **`public/robots.txt`**
   ```
   Sitemap: https://your-actual-domain.pages.dev/sitemap.xml
   ```

### 自訂網域（可選）

1. 在 Cloudflare Pages 專案設置中點擊 "Custom domains"
2. 添加您的自訂網域（例如：care-calculator.com）
3. 按照指示更新 DNS 記錄

## 📊 效能優化建議

Cloudflare Pages 已自動提供：
- ✅ 全球 CDN 加速
- ✅ 自動 HTTPS
- ✅ HTTP/2 和 HTTP/3 支援
- ✅ Brotli 壓縮
- ✅ 無限頻寬

## 🐛 常見問題

### Q: 為什麼要移除 `app/sitemap.ts` 和 `app/robots.ts`？
A: Next.js 的靜態導出模式不支援動態路由和 API 路由。這些文件需要在構建時動態生成，因此改用靜態的 `public/sitemap.xml` 和 `public/robots.txt`。

### Q: 圖片優化功能還能用嗎？
A: 靜態導出模式下，Next.js 的 Image Optimization 功能無法使用。如果需要圖片優化，可以考慮使用 Cloudflare Images 或其他第三方服務。

### Q: 可以使用 API Routes 嗎？
A: 不行。靜態導出模式不支援 API Routes。如果需要後端功能，可以考慮使用 Cloudflare Workers 或其他 Serverless 服務。

## 📝 Git 推送指令

```bash
# 查看狀態
git status

# 添加新文件
git add .

# 提交變更
git commit -m "Update deployment configuration"

# 推送到 GitHub
git push -u origin main
```

## 🎉 完成！

您的長照 3.0 財務決策引擎現在已經準備好部署到 Cloudflare Pages 了！
