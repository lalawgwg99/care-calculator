import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

const pathname = "/tools/medical-prep";

export const metadata: Metadata = {
  title: "長照就診準備清單｜症狀、藥物與問題整理",
  description: "看診前快速整理長輩的症狀、用藥、過敏史與想問醫師的問題，產生可直接使用的就診摘要。",
  alternates: pageAlternates(pathname),
  openGraph: {
    title: "長照就診準備清單",
    description: "一次整理症狀、用藥與看診問題，減少遺漏重要資訊。",
    url: absoluteUrl(pathname),
  },
};

export default function MedicalPrepLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
