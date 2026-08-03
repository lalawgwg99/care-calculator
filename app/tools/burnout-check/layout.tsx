import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

const pathname = "/tools/burnout-check";

export const metadata: Metadata = {
  title: "照顧者倦怠檢測｜免費評估照顧壓力",
  description: "用 10 題快速評估照顧者的身體、情緒、社交與財務壓力，取得分級結果與可行的支援建議。",
  alternates: pageAlternates(pathname),
  openGraph: {
    title: "照顧者倦怠檢測｜免費評估照顧壓力",
    description: "10 題快速了解目前的照顧負荷，找出需要優先處理的壓力來源。",
    url: absoluteUrl(pathname),
  },
};

export default function BurnoutCheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
