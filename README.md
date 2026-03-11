# 長照 3.0 財務決策引擎 (Long-Term Care Financial Decision Engine)

## 📋 專案概述

這是一個專為台灣市場設計的長照財務決策引擎 MVP，結合微型 SaaS 工具與程式化 SEO (pSEO)，旨在解決台灣三明治世代面對長照花費的資訊焦慮。

### Phase 1 (當前)
- ✅ 長照 3.0 決策樹引擎 MVP
- ✅ 高屏地區 pSEO 流量測試
- 📊 實時財務計算（Client-side）
- 🎨 漸進式表單設計（Progressive Disclosure）

### Phase 2 (規劃中)
- 無障礙空間改造評估
- 長照機構地圖比價與 B2B 派單

### Phase 3 (規劃中)
- 照顧者退休金缺口檢測
- 遺產試算等 FinTech 閉環

---

## 🛠️ 技術棧

- **前端框架**: Next.js 14 (App Router) + React 18 + TypeScript
- **樣式**: Tailwind CSS + Framer Motion (微互動)
- **圖表**: Recharts (圓餅圖/折線圖)
- **資料庫**: Prisma ORM + Supabase PostgreSQL (Phase 2+)
- **部署**: Vercel

---

## 📁 專案結構

```
.
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根佈局
│   ├── page.tsx                 # 首頁
│   └── globals.css              # 全局樣式
├── components/
│   └── CareCalculator.tsx        # 主要互動試算機組件
├── constants/
│   └── careData.ts              # 長照 3.0 靜態資料庫 (JSON)
├── lib/
│   └── careCalculator.ts        # 核心計算邏輯函數
├── prisma/
│   └── schema.prisma            # 資料庫結構定義 (Phase 2+)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .env.example
└── README.md
```

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
# 或
yarn install
```

### 2. 本地開發

```bash
npm run dev
```

訪問 `http://localhost:3000`

### 3. 構建生產版本

```bash
npm run build
npm start
```

---

## 📊 核心功能

### 1. 失能等級選擇
- 支援 CMS 第 1-8 級
- 大面積點擊卡片設計
- Framer Motion 微動畫

### 2. 照顧方式選擇
- 居家照顧
- 日間照顧
- 聘僱外籍看護工（補助額度 30%）
- 住宿式機構

### 3. 收入身份選擇
- 一般戶（自負 16%）
- 中低收入戶（自負 5%）
- 低收入戶（自負 0%）

### 4. 實時計算結果
- 政府每月補助總額
- 民眾每月自付額
- 詳細補助明細
- 輔具及無障礙改造一次性額度
- 機構住宿補助方案

---

## 💰 長照 3.0 四包錢

### 第一包：照顧及專業服務
- CMS 第 1 級: $0
- CMS 第 2 級: $10,020
- CMS 第 3 級: $15,460
- CMS 第 4 級: $18,580
- CMS 第 5 級: $24,100
- CMS 第 6 級: $28,070
- CMS 第 7 級: $32,090
- CMS 第 8 級: $36,180

**自負額比例**: 一般戶 16% / 中低收入戶 5% / 低收入戶 0%

**邊緣案例**: 聘僱外籍看護工時，補助額度打 3 折

### 第二包：交通接送服務
- **給付條件**: CMS 第 4 級 (含) 以上
- **都會區額度**: 每月 $1,680
- **自負額比例**: 一般戶 21% / 中低收入戶 7% / 低收入戶 0%

### 第三包：輔具及居家無障礙環境改善
- **給付條件**: CMS 第 2 級 (含) 以上
- **額度**: 每 3 年最高 $40,000
- **自負額比例**: 一般戶 30% / 中低收入戶 10% / 低收入戶 0%

### 第四包：喘息服務
- **CMS 第 2-6 級**: 每年 $32,340
- **CMS 第 7-8 級**: 每年 $48,510
- **自負額比例**: 一般戶 16% / 中低收入戶 5% / 低收入戶 0%

---

## 🔧 核心計算函數

### `calculateCareBudget(cmsLevel, incomeStatus, careType)`

**參數**:
- `cmsLevel` (Number: 1-8): 失能等級
- `incomeStatus` (String: "general" | "mid-low" | "low"): 收入身份
- `careType` (String: "home-care" | "day-care" | "foreign-caregiver" | "institution"): 照顧方式

**回傳**:
```typescript
{
  totalSubsidyMonthly: number;      // 政府每月補助
  outOfPocketMonthly: number;       // 民眾每月自付額
  hasTransportation: boolean;       // 是否有交通接送
  assistiveDeviceQuota: number;     // 輔具額度
  respiteMonthly: number;           // 喘息服務月額
  breakdown: {
    careServiceSubsidy: number;
    careServiceCopay: number;
    transportSubsidy: number;
    transportCopay: number;
    respiteSubsidy: number;
    respiteCopay: number;
  };
  institutionInfo?: {               // 機構住宿補助 (若適用)
    yearlySubsidy: number;
    monthlySubsidy: number;
    estimatedMonthlyFee: { min: number; max: number };
  };
}
```

---

## 📈 資料流

```
使用者輸入 (CMS等級、收入身份、照顧方式)
    ↓
calculateCareBudget() 計算
    ↓
careData.ts 查表
    ↓
實時渲染結果 (圓餅圖、金額卡片、明細表)
```

---

## 🌐 部署到 Vercel

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit: Phase 1 MVP"
git remote add origin https://github.com/your-username/long-term-care-engine.git
git push -u origin main
```

### 2. 連接 Vercel

1. 訪問 [vercel.com](https://vercel.com)
2. 點擊 "New Project"
3. 選擇 GitHub 倉庫
4. 配置環境變數（如需要）
5. 部署

---

## 🔐 環境變數

複製 `.env.example` 為 `.env.local`：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：

```
DATABASE_URL="postgresql://..."  # Phase 2+ 使用
NEXT_PUBLIC_API_URL="https://your-domain.com"
```

---

## 📝 免責聲明

本試算機基於 2026 年台灣長照 3.0 公開資料，僅供參考。實際補助額度以各縣市政府核定為準。

---

## 📞 聯絡方式

如有任何問題或建議，歡迎提出 Issue 或 Pull Request。

---

## 📄 授權

MIT License
