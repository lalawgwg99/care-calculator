import type { Metadata } from "next";
import Link from "next/link";
import { POLICY_SOURCES, POLICY_VERSION } from "@/lib/policyData";
import { absoluteUrl, pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "關於我們",
  description:
    "CarePilot 長照領航員是台灣的長照補助試算站。我們把複雜的長照補助算清楚：輸入失能等級和收入狀況，30 秒知道政府補助多少、自己要貼多少。",
  alternates: pageAlternates("/about"),
  openGraph: {
    title: "關於我們 | CarePilot 長照領航員",
    description: "我們是誰、資料從哪來、數字多久核對一次，都寫在這裡。",
    url: absoluteUrl("/about"),
    locale: "zh_TW",
    type: "website",
  },
};

const SOURCES = [
  { label: "衛福部長照專區", href: POLICY_SOURCES.longTermCare },
  { label: "長照 3.0 修正說明", href: POLICY_SOURCES.longTermCareAmendment },
  { label: "輔具補助說明", href: POLICY_SOURCES.assistiveDevices },
  { label: "財政部長照扣除額", href: POLICY_SOURCES.longTermCareTax },
  { label: "勞動部外籍看護薪資", href: POLICY_SOURCES.foreignCaregiverWage },
];

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      {/* 麵包屑 */}
      <nav className="text-[13px] text-apple-gray-400 mb-6" aria-label="麵包屑">
        <Link href="/" className="hover:text-apple-gray-700">首頁</Link>
        <span className="mx-2">/</span>
        <span className="text-apple-gray-600">關於我們</span>
      </nav>

      <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-apple-gray-900 mb-6">
        關於 CarePilot
      </h1>

      <section className="mb-10">
        <h2 className="text-[19px] font-bold text-apple-gray-900 mb-3">我們是誰</h2>
        <p className="text-[15px] text-apple-gray-600 leading-relaxed mb-3">
          CarePilot 長照領航員（carepilot1966.com）是一個台灣的長照補助試算網站。
          我們不是政府單位，也不是仲介或機構，只做一件事：把複雜的長照補助算清楚。
        </p>
        <p className="text-[15px] text-apple-gray-600 leading-relaxed">
          會做這個站，是因為我們發現太多家庭在長輩需要照顧時，第一個卡住的都是同一個問題：
          「一個月到底要花多少錢？」法規寫得很複雜，補助分四包錢，CMS
          等級、收入身分、交通分區、輔具組別，每個都會影響金額。與其讓大家自己翻法規，
          不如做一個試算工具，輸入幾個條件，30 秒就有答案。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[19px] font-bold text-apple-gray-900 mb-3">資料從哪裡來</h2>
        <p className="text-[15px] text-apple-gray-600 leading-relaxed mb-4">
          站上所有補助金額、給付額度、自付比例，都依據以下主管機關公開資料整理。
          中央政策資料最後核對日：<strong className="text-apple-gray-800">{POLICY_VERSION}</strong>。
          政策會調整，數字僅供試算參考，實際資格與金額以照管中心核定為準。
        </p>
        <ul className="space-y-2.5">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-medium text-apple-orange hover:underline underline-offset-4"
              >
                {s.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 rounded-[18px] border border-amber-200 bg-amber-50/70 p-5">
        <h2 className="text-[16px] font-bold text-apple-gray-900 mb-2">免責聲明</h2>
        <ul className="text-[14px] text-apple-gray-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>本站試算結果僅供參考，不是醫療建議，也不是政府核定金額。</li>
          <li>實際補助資格、CMS 等級與金額，由各縣市照管中心評估核定。</li>
          <li>政策可能調整，重大決策前請撥打 1966 長照專線或向照管中心確認。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-[19px] font-bold text-apple-gray-900 mb-3">聯絡我們</h2>
        <p className="text-[15px] text-apple-gray-600 leading-relaxed mb-4">
          長照相關問題（申請、資格、補助），最快的方式是直接打
          <a href="tel:1966" className="font-bold text-apple-orange hover:underline underline-offset-4 mx-1">
            1966
          </a>
          長照專線（週一至週五 8:30–12:00、13:30–17:30，市話手機直撥免付費）。
        </p>
        <p className="text-[15px] text-apple-gray-600 leading-relaxed">
          網站功能或內容建議，歡迎來信：
          <a
            href="mailto:hello@carepilot1966.com"
            className="font-semibold text-apple-orange hover:underline underline-offset-4"
          >
            hello@carepilot1966.com
          </a>
          。
        </p>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/#calculator"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[15px] font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          回去試算 →
        </Link>
      </div>
    </main>
  );
}
