# 📋 GitHub 倉庫設置指南

## 🎯 目標
將本地專案推送到 GitHub 帳號 `lalawgwg99` 下的 `care-calculator` 倉庫。

## ⚠️ 重要：請先完成以下步驟

### 步驟 1：在 GitHub 上創建新倉庫

1. 登入 GitHub 帳號：https://github.com/lalawgwg99
2. 點擊右上角的 `+` 按鈕，選擇 `New repository`
3. 填寫倉庫資訊：
   - **Repository name**: `care-calculator`
   - **Description**: 台灣長照 3.0 財務決策引擎 - 快速試算政府補助與自付額
   - **Visibility**: Public（或 Private，依您的需求）
   - **⚠️ 重要**: 不要勾選 "Initialize this repository with a README"
   - **⚠️ 重要**: 不要添加 .gitignore 或 license（我們已經有了）
4. 點擊 `Create repository`

### 步驟 2：推送到 GitHub

倉庫創建完成後，在終端機執行以下指令：

```bash
# 推送到 GitHub（首次推送）
git push -u origin main
```

如果遇到認證問題，請使用以下方式之一：

#### 方式 A：使用 Personal Access Token（推薦）

1. 前往 GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 點擊 "Generate new token (classic)"
3. 勾選 `repo` 權限
4. 複製生成的 token
5. 推送時使用 token 作為密碼：
   ```bash
   git push -u origin main
   # Username: lalawgwg99
   # Password: [貼上你的 token]
   ```

#### 方式 B：使用 SSH Key

1. 生成 SSH Key（如果還沒有）：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. 將 SSH Key 添加到 GitHub：
   - 複製公鑰：`cat ~/.ssh/id_ed25519.pub`
   - 前往 GitHub Settings > SSH and GPG keys > New SSH key
   - 貼上公鑰並保存
3. 更改遠端 URL 為 SSH：
   ```bash
   git remote set-url origin git@github.com:lalawgwg99/care-calculator.git
   git push -u origin main
   ```

## ✅ 本地 Git 已完成的設置

- ✅ Git 倉庫已初始化
- ✅ 所有文件已添加並提交
- ✅ 分支已設置為 `main`
- ✅ 遠端倉庫已配置為 `https://github.com/lalawgwg99/care-calculator.git`
- ✅ Git 用戶資訊已配置：
  - Name: lalawgwg99
  - Email: lalawgwg99@users.noreply.github.com

## 📦 提交內容

初始提交包含：
- ✅ 完整的 Next.js 專案結構
- ✅ 長照 3.0 計算邏輯（`lib/careLogic.ts`）
- ✅ 極簡 Notion 風格 UI（`app/page.tsx`）
- ✅ 企業級錯誤處理與驗證
- ✅ 完整的無障礙性支援
- ✅ Jest 單元測試（200+ 測試案例）
- ✅ Cloudflare Pages 部署配置
- ✅ 完整的文檔（README, 部署指南等）

## 🚀 推送成功後

1. 前往 https://github.com/lalawgwg99/care-calculator 查看您的倉庫
2. 按照 `DEPLOYMENT_GUIDE.md` 的指示部署到 Cloudflare Pages
3. 享受您的長照 3.0 財務決策引擎！

## 🆘 需要幫助？

如果遇到任何問題，請檢查：
1. GitHub 倉庫是否已創建
2. 倉庫名稱是否正確（`care-calculator`）
3. 是否有正確的 GitHub 認證（Token 或 SSH Key）
4. 網路連線是否正常

---

**準備好了嗎？執行 `git push -u origin main` 開始推送！** 🎉
