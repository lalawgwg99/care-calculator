import Link from "next/link";
import Icon from "@/components/Icon";
import DischargeChecklist from "@/components/DischargeChecklist";
import { DISCHARGE_SOURCES } from "@/lib/dischargePlan";
import { POLICY_VERSION } from "@/lib/policyData";
import type { Metadata } from "next";
import { absoluteUrl, pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "出院準備倒數待辦清單｜出院前 7 天到出院後 3 天 | CarePilot 長照領航員",
  description:
    "輸入預計出院日期，自動生成出院前 7 天→出院當天→出院後 3 天的待辦清單：何時聯絡出院準備小組、何時打 1966、CMS 評估時機、藥物／管路交接要問什麼。免費使用。",
  alternates: pageAlternates("/tools/discharge-checklist"),
  openGraph: {
    title: "出院準備倒數待辦清單 | CarePilot 長照領航員",
    description: "出院前 7 天到出院後 3 天，待辦事項按日期排好，逐項勾完就安心。",
    type: "website",
    url: absoluteUrl("/tools/discharge-checklist"),
  },
};

const FAQS = [
  {
    q: "一定要出院前 7 天才開始準備嗎？",
    a: "不用，越早越好。出院前 7 天只是這份倒數清單的起點——住院期間就可以向醫院出院準備小組提出需求，愈早提出，評估與服務媒合的時間愈充裕。",
  },
  {
    q: "還沒決定在宅照顧還是住機構，可以先申請長照嗎？",
    a: "可以。先打 1966 或請醫院協助轉介，照管專員會先做 CMS 評估，照顧計畫再依長輩狀況與家屬意願討論。在宅或機構的費用比較，可以用本站「在宅 vs 機構總成本比較」先試算。",
  },
  {
    q: "出院當天長照服務一定接得上嗎？",
    a: "115 年政策目標是出院當天接軌、平均 2 天內完成銜接（113 年平均為 4 天）。實際安排以醫院出院準備小組與長照 A 單位為準；建議出院前 3 天完成 CMS 評估，留出媒合時間。",
  },
];

export default function DischargeChecklistPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="hospital" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">出院準備</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">出院準備倒數待辦清單</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          輸入預計出院日期，出院前 7 天到出院後 3 天的待辦事項按日期排好：何時聯絡出院準備小組、何時打
          1966、CMS 評估時機、藥物交接要問什麼。逐項勾完，回家那天不手忙腳亂。
        </p>
      </div>

      <DischargeChecklist />

      {/* 政策背景 */}
      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">為什麼出院前就要開始準備</h2>
        <div className="space-y-3 text-[13px] text-apple-gray-600 leading-relaxed">
          <p>
            衛福部自 106 年推動「出院準備銜接長照服務計畫」，出院後銜接長照的平均天數，已從 106 年的{" "}
            <strong className="text-apple-gray-900">51 天</strong>大幅縮短至 113 年的{" "}
            <strong className="text-apple-gray-900">4 天</strong>；115 年起更以
            <strong className="text-apple-gray-900">平均 2 天內完成銜接</strong>為目標，逐步朝向出院當天即能接上長照服務邁進。
            關鍵就在住院期間：醫院出院準備團隊在住院期間主動介入，協助完成長照需要等級評估、核定簡易照顧計畫並進行服務媒合。
          </p>
          <p>
            依計畫流程，出院前 3 天由評估人員執行 CMS 及照顧問題評估，後續由長照 A 單位個案管理員擬定照顧計畫，
            協助個案於出院返家 7 天內取得所需長照服務。住院期間可向參與計畫的醫院提出申請，或撥打長照專線{" "}
            <strong className="text-apple-gray-900">1966</strong>。
          </p>
          <p className="text-[12px] text-apple-gray-400">
            來源：衛福部長照專區「出院準備銜接長照服務」（
            <a href={DISCHARGE_SOURCES.dischargePlan} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
              1966.gov.tw
            </a>
            ）、衛福部 2026-03-06 新聞；政策資料版本 {POLICY_VERSION}。各醫院參與計畫情形與流程，以各醫院出院準備小組公告為準。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-8">
        <h2 className="font-bold text-[18px] text-apple-gray-900 mb-4">常見問題</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 px-5 py-4 group">
              <summary className="font-semibold text-[15px] text-apple-gray-900 cursor-pointer list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-teal-600 transition-transform group-open:rotate-45 text-lg leading-none">＋</span>
              </summary>
              <p className="mt-3 text-[14px] text-apple-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 相關工具 */}
      <section className="mt-8 grid sm:grid-cols-3 gap-3">
        <Link href="/tools/care-report" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">免費照顧報告書</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">待辦時程＋成本對照＋文件清單，一頁印出來帶著走</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">兩邊每月總自付同屏對照，含補助抵扣與家人請假成本</div>
        </Link>
        <Link href="/tools/medical-prep" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">就診準備清單</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">回診前用藥清單與問診問題一次備齊</div>
        </Link>
      </section>
    </main>
  );
}
