"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import HomeVsInstitutionCompare from "@/components/HomeVsInstitutionCompare";
import { POLICY_SOURCES, POLICY_VERSION } from "@/lib/policyData";

const FAQS = [
  {
    q: "在家照顧一定比住機構便宜嗎？",
    a: "不一定。失能等級低、家人時間充裕時，在宅的現金支出明顯較低；但等級高、服務用量大，再加上家人請假的薪資損失，在宅的總成本可能接近甚至超過機構。本頁把請假成本列為可編輯欄位，就是要讓這筆隱形成本現形。",
  },
  {
    q: "住宿式機構補助每月 15,000 元的資格是什麼？",
    a: "入住依法設立的住宿式機構（不含安養床），且經評估達 CMS 第 4 級以上，或領有中度以上身心障礙證明，每月最高補助 15,000 元、全年最高 180,000 元，無排富條款。2023 年 1 月 1 日前已入住、未達 4 級的既有住民每月 5,000 元。新制採按月認列：當月實際入住達當月日曆天數二分之一以上，即認列 1 個月。",
  },
  {
    q: "在宅的「長照服務部分負擔」是怎麼算出來的？",
    a: "本站以長照四包錢計算：照顧及專業服務、交通接送、喘息服務三包，依你的 CMS 等級、身份別與交通分區，假設額度用滿時的部分負擔。一般戶的照顧與喘息部分負擔為 16%，交通依分區為 21%–30%。實際使用量低於額度時，自付會比試算低。",
  },
  {
    q: "比較表沒有算進去的費用有哪些？",
    a: "輔具及居家無障礙額度是每 3 年一次（第一組 40,000 元、第二組 60,000 元），不是每月支出，所以只在在宅欄下方註記，沒有併入月費。機構端常見的保證金、管路照護費、耗材費各家不同，已列「機構另計自費」欄位供你依契約填寫。",
  },
];

export default function HomeVsInstitutionPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="scale" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">總成本比較</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">在宅 vs 機構：每月總自付比較</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          在宅不是只有長照部分負擔，機構也不是只有月費。把耗材、家人請假、住宿補助都算進來，兩邊的每月實付放在同一張表。
        </p>
      </div>

      <HomeVsInstitutionCompare />

      {/* 數據來源 */}
      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">數據來源與計算依據</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>
            長照服務額度與部分負擔：衛生福利部「長期照顧給付及支付基準」，經本站政策資料庫整理（版本 {POLICY_VERSION}）。
            官方說明見{" "}
            <a href={POLICY_SOURCES.longTermCare} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
              1966 長照專區
            </a>
            。
          </li>
          <li>
            住宿式機構補助：衛生福利部「住宿式服務機構使用者補助方案」115 年度新制（每月最高 15,000 元、按月認列、無排富），
            修正說明見{" "}
            <a href={POLICY_SOURCES.longTermCareAmendment} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
              衛福部公告
            </a>
            。
          </li>
          <li>機構月費預設 $45,000 為本站先前採用的全國平均估算，並非官方統計；各機構收費以各縣市核定／備查及機構契約為準，可參考本站「機構費用行情」整理的官方核定上限。</li>
          <li>耗材與家人請假沒有官方標準金額，本頁預設值僅供起算，請依家中實際狀況修改。</li>
        </ul>
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
        <Link href="/" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">長照四包錢主試算</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">先算政府每月補助多少、自付多少</div>
        </Link>
        <Link href="/tools/facility-costs" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">機構費用行情</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">各縣市官方核定的護理之家收費上限</div>
        </Link>
        <Link href="/tools/facility-checklist" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">機構挑選檢核表</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">參觀機構前、中、後要確認的事項</div>
        </Link>
      </section>
    </main>
  );
}
