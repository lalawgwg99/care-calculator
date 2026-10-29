"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import InstitutionSubsidyCalculator from "@/components/InstitutionSubsidyCalculator";

const STEPS = [
  {
    title: "第 1 步：確認資格",
    body: "先確認住民符合三類資格之一：經照管中心評估達 CMS 第 4 級以上、持有中度以上身心障礙證明，或為 112 年 1 月 1 日前已入住的既有住民。還沒評估過，先撥 1966 申請長照需要評估。",
  },
  {
    title: "第 2 步：備妥文件",
    body: "住民身分證、申請人身分證、入住機構契約書（可確認入住機構、住民、簽約人、入住期間、簽約日期之部分即可，不須整份）、申請人（或住民）本人存摺、長照需要等級核定函或身心障礙證明（二擇一）。住民已逝世者另附死亡證明或除戶證明。",
  },
  {
    title: "第 3 步：向機構所在地縣市政府申請",
    body: "受理機關為申請補助年度內最近一次入住機構所在地之直轄市、縣（市）政府。受理期間各縣市不同（例如臺中市 115 年度為 9 月 14 日至 12 月 16 日），請以機構所在地縣市政府公告為準，逾期不受理。",
  },
  {
    title: "第 4 步：審核、按月認列、分期撥付",
    body: "縣市政府依補助年度內實際入住情形按月認列（當月入住達當月日曆天數二分之一以上認列 1 個月），115 年起分 2 期撥付。補助以實際自付額為上限；有疑問可撥 1966 或洽各縣市服務窗口。",
  },
];

export default function InstitutionSubsidyPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="coins" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">機構補助試算</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">住宿式機構補助試算器</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          入住機構每個月到底能補多少、自己還要付多少？選機構類型、資格、月費與認列月數，
          直接算出 115 年度現制的每年補助與每月實付缺口。
        </p>
      </div>

      <section className="bg-amber-50 border border-amber-200 rounded-[14px] p-5 mb-5">
        <h2 className="font-bold text-[15px] text-amber-900 mb-2">⚠️ 算之前先分清：這條錢不看所得</h2>
        <p className="text-[13px] text-amber-800 leading-relaxed">
          住宿式服務機構使用者補助自 112 年起取消排富規定：一般戶與中低、低收入戶在本方案的金額相同，
          所以本試算不以所得分級算錢。(中)低收入戶另有縣市「失能老人機構公費安置費補助」，金額依各縣市規定、
          且同一月份不得與本方案重複領取（須擇一），請洽戶籍地區公所，本頁不硬算。
        </p>
      </section>

      <InstitutionSubsidyCalculator />

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">申請步驟（115 年度）</h2>
        <div className="space-y-3">
          {STEPS.map((step) => (
            <div key={step.title}>
              <div className="font-semibold text-[14px] text-apple-gray-900">{step.title}</div>
              <p className="text-[13px] text-apple-gray-600 leading-relaxed mt-1">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">內容依據與免責</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>衛生福利部長照專區「住宿式服務使用者補助方案」（更新 115-10-01）：自 115 年起每月最高 15,000 元、每年最高 18 萬元，按月認列、分 2 期撥付；自 112 年起每年最高 12 萬元並取消排富規定。查證日期 2026 年 10 月 29 日。</li>
          <li>臺中市政府衛生局「115 年度住宿式服務機構使用者補助方案」申請作業須知（依據衛部顧字第 1151962241 號函）：機構類型、資格、月數認列規則、金額（中、重度失能 15,000 元／月、既有住民 5,000 元／月）、自付額上限、申請文件、受理機關。查證日期 2026 年 10 月 29 日。</li>
          <li>舊制對照：112–114 年為每年最高 12 萬元（中、重度失能）／6 萬元（既有住民），僅供對照；本試算以 115 年度現制計算。</li>
          <li>本站不推薦特定機構；試算金額僅供參考，最終補助以照管中心／縣市政府核定為準，補助以實際自付額為上限。</li>
        </ul>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link href="/tools/facility-costs" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">機構費用行情</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">先看政府核定的收費上限，再估月費要填多少</div>
        </Link>
        <Link href="/tools/facility-checklist" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">機構挑選檢核表</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">參觀前、中、後三階段清單＋紅旗警訊</div>
        </Link>
      </section>
    </main>
  );
}
