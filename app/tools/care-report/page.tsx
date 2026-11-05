import Icon from "@/components/Icon";
import CareReport from "@/components/CareReport";
import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "免費照顧報告書｜出院待辦＋成本對照＋應備文件，一頁印出來帶著走 | CarePilot 長照領航員",
  description:
    "免費產生個人化照顧報告書：已填好的出院待辦時程、在宅 vs 機構每月成本對照、應備文件清單，可列印成 PDF 帶去醫院或照管中心。不需註冊、不需兌換碼、不收費。",
  alternates: pageAlternates("/tools/care-report"),
  openGraph: {
    title: "免費照顧報告書 | CarePilot 長照領航員",
    description: "待辦時程、成本對照、應備文件整理成一頁，免費列印成 PDF 帶著走。",
    type: "website",
    url: absoluteUrl("/tools/care-report"),
  },
};

export default function CareReportPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8 print:hidden">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="doc" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">免費報告書</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">免費照顧報告書</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          出院待辦時程、在宅 vs 機構每月成本對照、應備文件清單，整理成一頁。填好就印，帶去醫院或照管中心直接用。
          完全免費，不需註冊、不需兌換碼。
        </p>
      </div>

      <CareReport />
    </main>
  );
}
