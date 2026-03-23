import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://care-calculator.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "長照 3.0 財務決策引擎 | 快速試算政府補助與自付額",
    template: "%s | 長照 3.0 財務決策引擎",
  },
  description: "台灣長照 3.0 補助試算工具，支援 CMS 1-8 級失能等級，即時計算政府補助與自付額。一次比較居家照顧、日間照顧、外籍看護、住宿式機構四種方案。",
  keywords: ["長照", "長照補助", "長照2.0", "長照3.0", "CMS等級", "居家照顧", "外籍看護", "住宿式機構", "日間照顧", "長照試算", "政府補助", "1966", "長照四包錢", "喘息服務", "輔具補助"],
  authors: [{ name: "長照決策引擎團隊" }],
  creator: "長照決策引擎",
  publisher: "長照決策引擎",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "長照 3.0 財務決策引擎 — 30 秒算出政府補助多少",
    description: "不用再翻法規、不用再猜數字。輸入失能等級和收入身份，系統馬上算出四種照顧方案的補助與自付費用。",
    url: BASE_URL,
    siteName: "長照 3.0 財務決策引擎",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "長照 3.0 財務決策引擎",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "長照 3.0 財務決策引擎 — 30 秒算出政府補助多少",
    description: "比較居家、日照、機構、外看四種方案，5 年財務預測一次看清。",
    images: ["/og-image.png"],
    creator: "@carecalculator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "zh-TW": BASE_URL,
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "長照試算",
    "geo.region": "TW",
    "geo.placename": "Taiwan",
    "distribution": "global",
    "rating": "general",
  },
};

// FAQ structured data for search engine rich snippets
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "什麼是長照 2.0 / 3.0？跟我有什麼關係？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "長照是政府針對失能、失智長輩提供的照顧補助制度。只要家中長輩經評估為 CMS 2 級以上，就可以獲得居家照顧、交通接送、喘息服務等補助。長照 3.0 是 2026 年起的最新版本，擴大了補助範圍與額度。"
      }
    },
    {
      "@type": "Question",
      "name": "我要怎麼申請長照服務？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "撥打長照專線 1966（市話免費），專員會安排到府評估長輩的失能等級。評估完成後，照顧管理專員會協助您制定照顧計畫，並安排簽約服務。從撥打電話到開始服務，通常需要 2～4 週。"
      }
    },
    {
      "@type": "Question",
      "name": "CMS 等級是什麼？要怎麼知道長輩是幾級？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CMS（照顧管理評估量表）是衡量長輩失能程度的標準，共分 1～8 級。等級越高，代表需要越多照顧，政府補助也越多。撥打 1966 後會有專業人員到府評估，完全免費。"
      }
    },
    {
      "@type": "Question",
      "name": "長照補助的四包錢是什麼意思？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "政府將長照補助分為四大類：照顧及專業服務（每月定額）、交通接送（CMS 4級以上）、輔具及無障礙改造（每3年上限4萬）、喘息服務（讓主要照顧者休息的臨時替代照顧）。"
      }
    },
    {
      "@type": "Question",
      "name": "聘外籍看護還能申請長照補助嗎？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "可以，但補助額度會縮減為原本的 30%，且只能用於專業服務（如復健指導、營養諮詢等），不能用於一般的居家照顧服務。"
      }
    }
  ]
};

// HowTo structured data for application process
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何申請台灣長照 3.0 服務",
  "description": "從撥打 1966 到開始接受長照服務，完整申請流程說明。",
  "totalTime": "P4W",
  "step": [
    {
      "@type": "HowToStep",
      "name": "撥打長照專線 1966",
      "text": "撥打 1966，告知長輩的失能狀況，預約照顧管理專員到府評估。市話免費，週一至五 8:30-17:30。",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "等待到府評估",
      "text": "照顧管理專員到府進行 CMS 評估（約 1-2 小時），評估長輩的失能等級。通常 7-14 天內安排。",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "收到評估結果",
      "text": "約 5-10 個工作天後收到書面評估結果，確認 CMS 等級及可獲補助額度。",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "制定照顧計畫並簽約",
      "text": "照顧管理專員協助選擇服務機構，完成簽約手續。",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "開始接受長照服務",
      "text": "簽約後 3-5 個工作天開始提供服務。整體流程通常需要 3-5 週。",
      "position": 5
    }
  ]
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
    "jurisdiction": {
      "@type": "Country",
      "name": "台灣",
    },
  },
  "provider": {
    "@type": "Organization",
    "name": "長照決策引擎",
    "url": BASE_URL,
  },
};

// FAQ JSON-LD for voice search and featured snippets
const voiceFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "長照 3.0 四包錢是什麼？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "長照 3.0 四包錢包含：1) 照顧及專業服務、2) 交通接送服務、3) 輔具及居家無障礙環境改善、4) 喘息服務。根據CMS失能等級和收入身份，最高每月可獲得數萬元的補助。",
      },
    },
    {
      "@type": "Question",
      "name": "如何申請長照補助？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "申請長照補助需要先撥打1966長照專線，或親自到各縣市照顧管理中心提出申請。申請時需攜帶身心障礙證明或醫療證明，相關單位會派專員到府評估失能等級。",
      },
    },
    {
      "@type": "Question",
      "name": "外籍看護工補助有多少？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "聘僱外籍看護工時，長照補助額度為原本的30%。以一般戶CMS第8級為例，原本每月補助36,180元，打3折後約10,854元補助。",
      },
    },
    {
      "@type": "Question",
      "name": "喘息服務每年有多少補助？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "喘息服務補助額度：CMS第2-6級每年最高32,340元，CMS第7-8級每年最高48,510元。自負額比例依身份別，一般戶16%、中低收入戶5%、低收入戶0%。",
      },
    },
  ],
};

// BreadcrumbList JSON-LD
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首頁",
      "item": BASE_URL,
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "長照補助試算",
      "item": BASE_URL,
    },
  ],
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
        <meta name="theme-color" content="#FCF5EE" />
        <meta name="color-scheme" content="light" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />

        {/* Primary structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* FAQ structured data for voice search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(voiceFaqJsonLd) }}
        />
        {/* HowTo structured data for application process */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
        {/* Breadcrumb structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className="antialiased bg-apple-gray-50 text-[17px] text-apple-gray-900">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
        {/* 無障礙：跳至主要內容 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-apple-gray-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-[14px] focus:font-semibold"
        >
          跳至主要內容
        </a>
        <NavBar />
        <ErrorBoundary>
          <main id="main-content">
            {children}
          </main>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
