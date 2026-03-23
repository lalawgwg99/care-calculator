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
const faqJsonLd = {
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
        <meta name="theme-color" content="#FFF7ED" />
        <meta name="color-scheme" content="light" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Primary structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* FAQ structured data for voice search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        <NavBar />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
