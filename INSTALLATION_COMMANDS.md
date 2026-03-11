# 📦 安裝指令清單

## 完整的依賴安裝指令

複製並執行以下指令來安裝所有必要的依賴：

---

## 🎯 一鍵安裝（推薦）

```bash
npm install zod@^3.22.4 jest@^29.7.0 jest-environment-jsdom@^29.7.0 @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1 @types/jest@^29.5.11 --save-dev
```

---

## 📋 分步安裝

### 1. 輸入驗證
```bash
npm install zod@^3.22.4
```

### 2. 測試框架
```bash
npm install --save-dev jest@^29.7.0 jest-environment-jsdom@^29.7.0
```

### 3. React 測試工具
```bash
npm install --save-dev @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1
```

### 4. TypeScript 類型定義
```bash
npm install --save-dev @types/jest@^29.5.11
```

---

## ✅ 驗證安裝

```bash
# 檢查 package.json
cat package.json | grep -A 20 "devDependencies"

# 運行測試
npm test

# 檢查 TypeScript
npx tsc --noEmit
```

---

## 🔧 如果遇到問題

### 清除並重新安裝
```bash
rm -rf node_modules package-lock.json
npm install
```

### 更新 npm
```bash
npm install -g npm@latest
```

### 清除 npm 緩存
```bash
npm cache clean --force
npm install
```

---

## 📊 預期的 package.json

安裝完成後，你的 `package.json` 應該包含：

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    // ... 其他依賴
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.11",
    // ... 其他開發依賴
  }
}
```

---

## 🚀 安裝後立即測試

```bash
# 1. 運行測試
npm test

# 2. 啟動開發服務器
npm run dev

# 3. 構建生產版本
npm run build
```

---

## 💡 提示

- 使用 `npm install` 而不是 `npm i` 以獲得更詳細的輸出
- 如果使用 yarn，請改用 `yarn add` 和 `yarn add --dev`
- 如果使用 pnpm，請改用 `pnpm add` 和 `pnpm add -D`

---

**完成後請運行**: `npm test` 確保所有測試通過！
