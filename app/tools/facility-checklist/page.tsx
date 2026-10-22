"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import FacilityVisitChecklist from "@/components/FacilityVisitChecklist";

export default function FacilityChecklistPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10 print:py-2">
      <div className="text-center mb-8 print:hidden">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="clipboard" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">參觀檢核表</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">機構挑選互動檢核表</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          選機構不能只看評鑑和月費。參觀前、中、後三個階段逐項勾，紅旗警訊另外記，印出來帶著走。
        </p>
      </div>

      <FacilityVisitChecklist />

      {/* 評鑑怎麼看 */}
      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:shadow-none">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">評鑑等級怎麼解讀</h2>
        <div className="space-y-3 text-[13px] text-apple-gray-600 leading-relaxed">
          <p>
            <strong className="text-apple-gray-900">先分清楚機構類型。</strong>
            一般護理之家由衛生局主管，評鑑結果以「合格／不合格」表示；老人福利機構由社會局（處）主管，
            評鑑分優、甲、乙、丙、丁五等（丙、丁等須限期改善）；住宿式長照機構同樣有定期評鑑。問機構評鑑時，先問它是受哪一種評鑑。
          </p>
          <p>
            <strong className="text-apple-gray-900">評鑑有兩個先天限制。</strong>
            一是時效：每 3 年才評一次，人員與經營者都可能已經換過，3 年前的合格不代表現在的品質。
            二是範圍：評鑑看的是「有沒有符合規定」，不是「適不適合你家長輩」——失智照顧做得好不好、夜間人力夠不夠，
            評鑑報告看不出來，只能靠實地參觀與提問補上，這正是上面這份清單的用途。
          </p>
          <p>
            <strong className="text-apple-gray-900">人力比的法定地板。</strong>
            以老人福利機構（養護型）為例，「老人福利機構設立標準」規定照顧服務員日間每照顧 8 人至少置 1 人、
            夜間每 25 人至少 1 人，護理人員每 20 人至少 1 人且隨時至少 1 人上班。這是最低標準不是理想值；
            參觀時問到的數字如果只貼著地板，代表照顧節奏會很趕。護理之家與長照機構的設置標準不同，簽約前可向縣市衛生局確認該類型的標準。
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:hidden">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">資料依據</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>人力配置最低標準：衛福部「老人福利機構設立標準」（全國法規資料庫），核實日期 2026 年 10 月 22 日。</li>
          <li>評鑑限制（時效落差、合格不等於適合）：整理自長照資訊網站 twneed.org 對評鑑制度的說明與實務參觀建議。</li>
          <li>契約範本：衛生福利部公告之住宿式長照服務機構、護理之家、老人福利機構定型化契約範本。</li>
        </ul>
        <p className="mt-3 text-[12px] text-apple-gray-400">CarePilot 不推薦、不排名任何特定機構，也未收受機構廣告或轉介費用。</p>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-3 print:hidden">
        <Link href="/tools/facility-costs" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">機構費用行情</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">縣市官方核定的護理之家收費上限，先看行情再參觀</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">先算兩邊每月實付差距，再決定要不要找機構</div>
        </Link>
      </section>
    </main>
  );
}
