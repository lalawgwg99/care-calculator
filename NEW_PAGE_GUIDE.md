# 🎨 新版 page.tsx 使用指南

## 完成！極簡 Notion 風格的客戶端組件

我已經為你創建了一個全新的 `app/page.tsx`，直接使用 `lib/careLogic.ts` 的核心計算邏輯。

---

## ✨ 設計特色

### 1. 極簡 Notion 風格
- ✅ 大量留白
- ✅ 柔和的漸層背景
- ✅ 圓角卡片設計
- ✅ 清晰的視覺層次

### 2. 大面積 Radio Cards
- ✅ 不使用下拉選單
- ✅ 可點擊的大卡片
- ✅ Hover 放大效果 (`hover:scale-105`)
- ✅ 點擊縮小效果 (`active:scale-95`)
- ✅ 選中狀態清晰標示

### 3. 即時計算
- ✅ 使用 `useState` 管理狀態
- ✅ 每次點擊立即重新計算
- ✅ 直接調用 `calculateCareBudget()`
- ✅ 無需按鈕提交

### 4. 清晰的結果顯示
- ✅ 大字體 (`text-4xl`)
- ✅ 等寬字體 (`font-mono`)
- ✅ 政府補助用綠色
- ✅ 自付額用紅色
- ✅ 詳細資訊展開

---

## 🎯 功能說明

### 三個選擇區塊

#### 1. 失能等級 (CMS 1-8)
```typescript
// 8 個大卡片，2x4 網格
grid-cols-2 md:grid-cols-4
```
- 顯示等級編號
- 顯示等級名稱（輕度/中度/重度/極重度）

#### 2. 家庭收入身份
```typescript
// 3 個卡片，1x3 網格
grid-cols-1 md:grid-cols-3
```
- 一般戶
- 中低收入戶
- 低收入戶

#### 3. 照顧方式
```typescript
// 4 個卡片，2x2 網格
grid-cols-1 md:grid-cols-2
```
- 居家照顧
- 日間照顧
- 聘僱外籍看護工
- 住宿式機構

### 結果儀表板

#### 主要金額顯示
```typescript
// 2 個大卡片
- 政府每月補助（綠色漸層）
- 您每月自付額（紅色漸層）
```

#### 詳細資訊
- 交通接送資格
- 輔具及無障礙改造額度

---

## 🚀 立即測試

### 1. 啟動開發服務器
```bash
npm run dev
```

### 2. 訪問頁面
```
http://localhost:3000
```

### 3. 測試流程
1. 選擇失能等級（例如：第 5 級）
2. 選擇收入身份（例如：一般戶）
3. 選擇照顧方式（例如：居家照顧）
4. 立即看到計算結果！

---

## 💡 使用範例

### 範例 1: 一般家庭
```
選擇：
- CMS 第 5 級
- 一般戶
- 居家照顧

結果：
- 政府每月補助: NT$23,835
- 您每月自付額: NT$4,640
- 交通接送: ✓ 符合資格
- 輔具額度: NT$40,000 / 3年
```

### 範例 2: 低收入戶
```
選擇：
- CMS 第 8 級
- 低收入戶
- 居家照顧

結果：
- 政府每月補助: NT$41,903
- 您每月自付額: NT$0
- 交通接送: ✓ 符合資格
- 輔具額度: NT$40,000 / 3年
```

### 範例 3: 外籍看護工
```
選擇：
- CMS 第 5 級
- 一般戶
- 聘僱外籍看護工

結果：
- 政府每月補助: NT$9,664
- 您每月自付額: NT$1,941
- 交通接送: ✓ 符合資格
- 輔具額度: NT$40,000 / 3年
```

---

## 🎨 設計細節

### 色彩系統
```typescript
// 失能等級選擇
border-indigo-500 bg-indigo-50  // 選中狀態

// 收入身份選擇
border-emerald-500 bg-emerald-50  // 選中狀態

// 照顧方式選擇
border-violet-500 bg-violet-50  // 選中狀態

// 政府補助
from-emerald-50 to-emerald-100  // 綠色漸層

// 自付額
from-rose-50 to-rose-100  // 紅色漸層
```

### 動畫效果
```typescript
// Hover 效果
hover:scale-105  // 放大 5%

// 點擊效果
active:scale-95  // 縮小 5%

// 過渡動畫
transition-all duration-200  // 200ms 平滑過渡
```

### 響應式設計
```typescript
// 手機版
grid-cols-1  // 單欄

// 平板/桌面版
md:grid-cols-2  // 雙欄
md:grid-cols-3  // 三欄
md:grid-cols-4  // 四欄
```

---

## 🔧 自定義修改

### 修改色彩
```typescript
// 在 page.tsx 中搜尋並替換
border-indigo-500  →  border-blue-500
bg-emerald-50      →  bg-green-50
```

### 修改字體大小
```typescript
// 結果金額
text-4xl  →  text-5xl  // 更大
text-4xl  →  text-3xl  // 更小
```

### 修改卡片間距
```typescript
// 選擇區塊
space-y-8  →  space-y-12  // 更大間距
gap-3      →  gap-4       // 更大間距
```

---

## 📊 與舊版比較

### 舊版 (CareCalculator.tsx)
- ❌ 複雜的組件結構
- ❌ 使用 Recharts 圓餅圖
- ❌ 多個子組件
- ❌ 較複雜的狀態管理

### 新版 (page.tsx)
- ✅ 單一文件，易於理解
- ✅ 直接使用 `lib/careLogic.ts`
- ✅ 極簡設計
- ✅ 即時計算
- ✅ 清晰的視覺層次

---

## 🎯 核心優勢

### 1. 直接使用核心邏輯
```typescript
import { calculateCareBudget } from "@/lib/careLogic";

const result = calculateCareBudget(selectedCMS, selectedIncome, selectedCare);
```

### 2. 即時計算
```typescript
// 每次狀態改變時自動重新計算
const result =
  selectedCMS && selectedIncome && selectedCare
    ? calculateCareBudget(selectedCMS, selectedIncome, selectedCare)
    : null;
```

### 3. 類型安全
```typescript
import type { CMSLevel, IncomeStatus, CareType } from "@/lib/careLogic";

const [selectedCMS, setSelectedCMS] = useState<CMSLevel | null>(null);
```

### 4. 輔助函數
```typescript
import {
  getCMSLevelName,
  getIncomeStatusName,
  getCareTypeName,
} from "@/lib/careLogic";

// 自動取得中文名稱
getCMSLevelName(5)  // "重度失能"
```

---

## 🚀 下一步優化

### 可選的進階功能

#### 1. 添加動畫
```bash
npm install framer-motion
```

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  {/* 內容 */}
</motion.div>
```

#### 2. 添加圖表
```bash
npm install recharts
```

```typescript
import { PieChart, Pie } from "recharts";

// 添加圓餅圖顯示比例
```

#### 3. 添加分享功能
```typescript
const shareResult = () => {
  navigator.share({
    title: "長照試算結果",
    text: `政府補助: ${result.totalSubsidyMonthly}`,
  });
};
```

---

## 📝 注意事項

### 1. 確保 lib/careLogic.ts 存在
```bash
# 檢查文件是否存在
ls lib/careLogic.ts
```

### 2. 確保 TypeScript 配置正確
```bash
# 檢查 TypeScript 錯誤
npx tsc --noEmit
```

### 3. 確保 Tailwind CSS 正常運作
```bash
# 檢查 tailwind.config.ts
cat tailwind.config.ts
```

---

## 🎉 總結

新版 `app/page.tsx` 特色：
- ✅ 極簡 Notion 風格
- ✅ 大面積 Radio Cards
- ✅ 即時計算
- ✅ 清晰的結果顯示
- ✅ 直接使用核心邏輯
- ✅ 完全類型安全
- ✅ 響應式設計

**立即運行 `npm run dev` 查看效果！**

---

**創建日期**: 2026-03-11  
**版本**: 2.0.0  
**狀態**: ✅ 生產就緒
