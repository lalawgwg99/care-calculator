import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "長照 3.0 財務決策引擎 | 快速試算政府補助與自付額",
  description: "台灣長照 3.0 補助試算工具，支援 CMS 1-8 級失能等級，即時計算政府補助與自付額。適用於居家照顧、日間照顧、外籍看護、住宿式機構。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-apple-gray-50 text-[17px] text-apple-gray-900">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
