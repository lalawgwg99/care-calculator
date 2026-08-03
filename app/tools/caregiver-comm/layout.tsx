import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

const pathname = "/tools/caregiver-comm";

export const metadata: Metadata = {
  title: "外籍看護雙語溝通卡｜中文、印尼文、越南文",
  description: "免費建立中文、印尼文與越南文照顧聯絡簿，快速整理每日照顧事項並分享給外籍看護。",
  alternates: pageAlternates(pathname),
  openGraph: {
    title: "外籍看護雙語溝通卡",
    description: "用中文、印尼文與越南文快速建立每日照顧聯絡簿。",
    url: absoluteUrl(pathname),
  },
};

export default function CaregiverCommLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
