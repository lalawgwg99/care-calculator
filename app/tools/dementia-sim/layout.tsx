import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

const pathname = "/tools/dementia-sim";

export const metadata: Metadata = {
  title: "失智症溝通情境模擬｜照顧對話練習",
  description: "透過常見失智照顧情境練習對話技巧，了解不同回應如何影響長輩壓力與溝通結果。",
  alternates: pageAlternates(pathname),
  openGraph: {
    title: "失智症溝通情境模擬",
    description: "用互動情境練習更合適的失智症照顧溝通方式。",
    url: absoluteUrl(pathname),
  },
};

export default function DementiaSimLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
