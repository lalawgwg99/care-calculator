import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";
import DiaryClient from "./DiaryClient";

export const metadata: Metadata = {
  title: "照顧日記 | CarePilot 長照領航員",
  description:
    "每天 1 分鐘記錄長輩的食慾、精神與狀況，AI 每週幫你整理成摘要。記錄只存在你的瀏覽器，不上傳到網路。",
  alternates: pageAlternates("/diary"),
  openGraph: {
    title: "照顧日記 | CarePilot 長照領航員",
    description: "每天 1 分鐘記錄長輩狀況，AI 每週整理摘要。記錄只存在你的瀏覽器。",
    type: "website",
    url: absoluteUrl("/diary"),
  },
};

export default function DiaryPage() {
  return <DiaryClient />;
}
