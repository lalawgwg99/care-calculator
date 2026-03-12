import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "長照 3.0 財務決策引擎 | 快速試算政府補助與自付額",
  description: "台灣長照 3.0 補助試算工具，支援 CMS 1-8 級失能等級，即時計算政府補助與自付額。一次比較居家照顧、日間照顧、外籍看護、住宿式機構四種方案。",
  keywords: ["長照", "長照補助", "長照2.0", "長照3.0", "CMS等級", "居家照顧", "外籍看護", "住宿式機構", "日間照顧", "長照試算", "政府補助", "1966"],
  openGraph: {
    title: "長照 3.0 財務決策引擎 — 30 秒算出政府補助多少",
    description: "不用再翻法規、不用再猜數字。輸入失能等級和收入身份，系統馬上算出四種照顧方案的補助與自付費用。",
    type: "website",
    locale: "zh_TW",
    siteName: "長照 3.0 財務決策引擎",
  },
  twitter: {
    card: "summary_large_image",
    title: "長照 3.0 財務決策引擎 — 30 秒算出政府補助多少",
    description: "比較居家、日照、機構、外看四種方案，5 年財務預測一次看清。",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "長照試算",
  },
};

// JSON-LD structured data for search engines
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "長照 3.0 財務決策引擎",
  "description": "台灣長照 3.0 補助試算工具，即時計算政府補助與自付額，比較四種照顧方案。",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "TWD",
  },
  "inLanguage": "zh-TW",
  "isAccessibleForFree": true,
  "about": {
    "@type": "GovernmentService",
    "name": "台灣長期照顧服務",
    "serviceType": "長期照顧補助",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FFF7ED" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-apple-gray-50 text-[17px] text-apple-gray-900">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
