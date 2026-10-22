"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import ForeignCaregiverGuide from "@/components/ForeignCaregiverGuide";
import { POLICY_SOURCES } from "@/lib/policyData";

const MANAGEMENT = [
  {
    title: "休假怎麼安排",
    body: "家庭看護工不適用勞基法，休假依勞動契約：常見約定為每 7 日休 1 日。休假日出勤要給加班費或補休，二擇一要在契約講清楚。看護休假當天沒人接手是最常見的困擾——經評估 CMS 2 級以上的家庭，可申請長照喘息服務與短期替代照顧，兩者合計每年最高 52 天，撥 1966 申請。",
  },
  {
    title: "還能用長照服務嗎",
    body: "可以。聘有外籍看護的家庭經評估仍可使用長照服務，只是「照顧及專業服務」額度打 3 折（剩 30%）；114 年 9 月 1 日起，30% 額度內除專業服務外，也能用日間照顧與家庭托顧。交通接送、輔具、喘息服務不打折。額度算法本站主試算的「外籍看護」模式已內建。",
  },
  {
    title: "溝通與磨合",
    body: "前 1–3 個月是磨合期：把作息、飲食禁忌、用藥時間寫成清單（可請仲介協助翻譯），比口頭交代有效。遇到溝通障礙可撥 1955 專線，有三方通譯。看護的工作範圍以照顧被看護者為限，指派去做幫傭、店面或他人照顧等許可外工作，雇主會被處罰。",
  },
  {
    title: "雇主的法定義務",
    body: "按月給付薪資並保留紀錄；提供食宿；入國後 3 日內安排健康檢查，之後每滿 6、18、30 個月再檢；不得扣留移工的護照、居留證與薪資（扣留證件違法）；期滿可在國內直接續聘，不必出國，也不用再付一次國外仲介費。",
  },
  {
    title: "仲介怎麼挑",
    body: "本站不推薦任何仲介公司。簽約前到勞動力發展署網站查仲介的許可與評鑑等級，收費逐項對照法定上限（本頁試算已內建），契約要用勞動部的定型化契約範本比對；要求拿收據。也可以不透過仲介，向「直接聘僱聯合服務中心」自行辦理，省下仲介費但文件要自己跑。",
  },
];

const FAQS = [
  {
    q: "80 歲免評上路後，是不是人人請得到外籍看護？",
    a: "免評只是免掉醫院評估這一關。國內求才、招募許可、引進流程都還在，且新制採輕重分流、重症優先，一般案件依案量依序處理。勞動部預估新制增加約 10 萬名申請者，等待時間可能拉長，這是申請前要有的心理準備。",
  },
  {
    q: "請外籍看護一個月到底要多少錢？",
    a: "以月薪 20,000 元、每月 4 天加班費計算：月薪＋加班費 2,668＋就業安定費 2,000＋健保 1,428＋職災約 56＋意外險月攤約 33＋仲介服務費月攤約 167，每月約 26,352 元；第一年另加一次性仲介登記介紹費（上限 20,000 元）。實際金額用本頁試算依你的條件調整。",
  },
  {
    q: "仲介費被超收怎麼辦？",
    a: "先對照上限：向雇主收的登記費＋介紹費合計不得超過移工第一個月薪資、服務費每年 2,000 元且不得預收；向移工收的服務費第 1 年每月 1,800 元為上限。保留契約與收據，撥 1955 向勞動部檢舉，超收可處超收金額 10–20 倍罰鍰。",
  },
  {
    q: "外籍看護和外籍幫傭有什麼不同？",
    a: "看護工照顧的是失能的被看護者，資格看被看護者的年齡、疾病與失能評估；幫傭做的是家務與育兒協助，資格採家庭點數制。兩者工作範圍不能互換：請看護工來做全家家事，或請幫傭照顧失能長輩，都屬許可外工作。",
  },
];

export default function ForeignCaregiverPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="users" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">聘僱攻略</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">外籍看護聘僱全攻略</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          先自測資格，再算每月成本。資格依勞動部 2025 年 8 月 1 日免評新制，費用逐項對照法定標準，本站不推薦任何仲介。
        </p>
      </div>

      <ForeignCaregiverGuide />

      {/* 管理實務 */}
      <section className="mt-8">
        <h2 className="font-bold text-[18px] text-apple-gray-900 mb-4">三、聘僱後管理實務</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {MANAGEMENT.map((m) => (
            <div key={m.title} className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
              <h3 className="font-bold text-[15px] text-apple-gray-900 mb-2">{m.title}</h3>
              <p className="text-[13px] text-apple-gray-600 leading-relaxed">{m.body}</p>
            </div>
          ))}
          <div className="bg-teal-50 rounded-[14px] border border-teal-100 p-5">
            <h3 className="font-bold text-[15px] text-teal-900 mb-2">諮詢與申訴管道</h3>
            <p className="text-[13px] text-teal-800/80 leading-relaxed">
              1955 勞工諮詢申訴專線（雇主與移工皆可，含三方通譯）／1966 長照專線（喘息與替代照顧）／
              直接聘僱聯合服務中心（自行辦理聘僱）／各縣市長期照顧管理中心（國內求才推介）。
            </p>
          </div>
        </div>
      </section>

      {/* 來源 */}
      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">數據來源（核實日期：2026 年 10 月 22 日）</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>資格條件：就業服務法第 46 條修正（2025 年 8 月 1 日施行）與勞動部「輕重分流、重症優先」配套，見勞動力發展署公告及本站政策來源頁。</li>
          <li>
            月薪與就業安定費：勞動力發展署雇主常見問答（
            <a href={POLICY_SOURCES.foreignCaregiverWage} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
              fw.wda.gov.tw
            </a>
            ），家事移工月薪 $20,000（2022 年 8 月 10 日起）。
          </li>
          <li>仲介收費上限：勞動部「私立就業服務機構收費項目及金額標準」第 3 條、第 6 條。</li>
          <li>健保費：115 年健保費負擔金額表（投保金額 $29,500 級距，雇主負擔 $1,428）。</li>
          <li>市場實況：勞動部「114 年移工管理及運用調查」（2026 年 1 月公布）——平均月薪 $21,300、加班費平均 $2,800、整月未休假占 34.2%。</li>
          <li>職災保險費與意外險年費為估算值，實際以勞保局繳費單與保險契約為準。</li>
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

      <section className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link href="/" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">長照四包錢主試算</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">選「外籍看護」模式，看長照補助還剩多少</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">還在猶豫照顧方式？先把兩邊的每月總成本算出來</div>
        </Link>
      </section>
    </main>
  );
}
