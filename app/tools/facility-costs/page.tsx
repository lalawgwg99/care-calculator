import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "機構費用行情：官方核定收費上限與實際落差 | CarePilot 長照領航員",
  description:
    "台灣沒有統一的機構行情價，但護理之家的收費受政府核定。整理臺北、臺中官方收費上限、新北精神護理之家基準、高雄市衛生局揭露的實際收費落差，以及自己查行情的正確管道。",
};

export default function FacilityCostsPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="calculator" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">費用行情</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">機構費用行情：先看政府核定的上限</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          台灣沒有全國統一的機構行情表，但護理之家的每一項收費都必須報縣市政府核定，而且有公開的收費基準。
          這一頁整理已查證的官方數據；沒有官方數據的部分，我們不猜，改教你去哪裡查到真的。
        </p>
      </div>

      <section className="bg-amber-50 border border-amber-200 rounded-[14px] p-5 mb-5">
        <h2 className="font-bold text-[15px] text-amber-900 mb-2">⚠️ 先分清三種數字，別被混著談</h2>
        <ul className="space-y-1.5 text-[13px] text-amber-800 leading-relaxed list-disc pl-5">
          <li><strong>核定上限</strong>：政府公告的收費天花板，機構收超過就是違規。本頁臺北、臺中的數字屬這一類。</li>
          <li><strong>實際收費</strong>：機構真正開給住民的價格，通常低於上限，依房型、管路照護、地區落差很大。本頁高雄的數字屬這一類。</li>
          <li><strong>月費之外</strong>：耗材、管路照護、陪同就醫等常另計。比價時要比「全包總額」，不是只比月費。</li>
        </ul>
      </section>

      {/* 一般護理之家上限 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 mb-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">一般護理之家：官方收費上限（月費）</h2>
        <p className="text-[12px] text-apple-gray-400 mb-4">
          月費通常含護理費、生活照顧費、住房費、伙食費；管路照護等項目另有核定計費方式。數字為「每月不得超過」的上限。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-apple-gray-400 border-b border-apple-gray-100">
                <th className="py-2 pr-3 font-medium">縣市／來源</th>
                <th className="py-2 pr-3 font-medium">房型</th>
                <th className="py-2 font-medium text-right">每月上限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-50 text-apple-gray-700">
              <tr><td className="py-2 pr-3">臺北市（衛生局收費基準）</td><td className="py-2 pr-3">特殊照護床</td><td className="py-2 text-right font-semibold">$60,000</td></tr>
              <tr><td className="py-2 pr-3">臺北市</td><td className="py-2 pr-3">雙人房</td><td className="py-2 text-right font-semibold">$49,000</td></tr>
              <tr><td className="py-2 pr-3">臺北市</td><td className="py-2 pr-3">3–4 人房</td><td className="py-2 text-right font-semibold">$45,000</td></tr>
              <tr><td className="py-2 pr-3">臺北市</td><td className="py-2 pr-3">5 人以上房</td><td className="py-2 text-right font-semibold">$42,000</td></tr>
              <tr><td className="py-2 pr-3">臺中市（衛生局收費核定原則）</td><td className="py-2 pr-3">多人房</td><td className="py-2 text-right font-semibold">$50,000</td></tr>
              <tr><td className="py-2 pr-3">臺中市</td><td className="py-2 pr-3">單人房</td><td className="py-2 text-right font-semibold">$60,000</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-apple-gray-400 leading-relaxed">
          臺北市基準另規定：醫材、耗材等非健保給付材料，收費不得超過進價的 115%。臺中市原則另核定日托費每日 $1,000–$2,500、臨托費每小時 $150–$300，管路照顧費（如鼻胃管、導尿管）每月約 $1,000–$2,000 另計。
        </p>
      </section>

      {/* 高雄實際落差 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 mb-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">高雄市：衛生局揭露的實際收費落差</h2>
        <p className="text-[13px] text-apple-gray-600 leading-relaxed">
          2026 年高雄市衛生局稽查說明指出，市內住宿型機構每月收費落差很大，從約 <strong className="text-apple-gray-900">$22,000 到 $60,000</strong> 都有，
          同一座城市價差接近 3 倍。高雄市另規定機構代收代辦購買日常耗材，加價不得超過進價的 10%。
          高雄市衛生局官網有「一般護理之家及住宿型長照機構收費等一覽表」，可查各機構的床位、收費、評鑑與違規紀錄，是目前少數把實際收費公開上網的縣市。
        </p>
      </section>

      {/* 精神護理之家 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 mb-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">精神護理之家：新北市收費基準</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-apple-gray-400 border-b border-apple-gray-100">
                <th className="py-2 pr-3 font-medium">房型</th>
                <th className="py-2 font-medium text-right">長期照護費每月上限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-50 text-apple-gray-700">
              <tr><td className="py-2 pr-3">一般房（5–6 人）</td><td className="py-2 text-right font-semibold">$32,000</td></tr>
              <tr><td className="py-2 pr-3">3–4 人房</td><td className="py-2 text-right font-semibold">$36,000</td></tr>
              <tr><td className="py-2 pr-3">雙人房</td><td className="py-2 text-right font-semibold">$42,000</td></tr>
              <tr><td className="py-2 pr-3">單人房</td><td className="py-2 text-right font-semibold">$54,000</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-apple-gray-400 leading-relaxed">
          含病房費、膳食費、洗衣費、每月醫師診察、一般照護護理費。注意：此基準由新北市政府衛生局於民國 104 年訂定，年代較久，入住前請向該市衛生局確認是否已有新版。
        </p>
      </section>

      {/* 其他類型與查法 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 mb-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">老人福利機構、住宿式長照機構：為什麼沒有統一上限表</h2>
        <div className="space-y-3 text-[13px] text-apple-gray-600 leading-relaxed">
          <p>
            這兩類機構的收費由各機構訂定、報所在地縣市政府核定或備查，政府沒有像護理之家那樣公告統一的房型上限。
            也就是說，行情只能一家一家查——但查的方法是公開的：
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>先在衛福部「長照機構暨長照人員相關管理資訊系統」確認機構合法立案、看評鑑結果。</li>
            <li>到機構所在地縣市衛生局（護理之家、長照機構）或社會局（老人福利機構）網站找「收費標準／收費一覽表」公告；高雄市等縣市有逐家公開。</li>
            <li>查不到就打 1966 或縣市政府總機轉主管科室，問該機構「核定的收費標準」——這是公開資訊，承辦人員可以提供。</li>
            <li>參觀時要求書面收費明細，並和衛福部定型化契約範本比對（見<Link href="/tools/facility-checklist" className="text-teal-700 font-medium">機構挑選檢核表</Link>）。</li>
          </ol>
          <p>
            遇到收費超過公告基準、或巧立名目加收（如材料費之外再收「清潔費」），可向縣市衛生局檢舉；高雄市 2026 年就因這類違規開罰多家機構。
          </p>
        </div>
      </section>

      {/* 補助 */}
      <section className="bg-teal-50 rounded-[14px] border border-teal-100 p-5 mb-5">
        <h2 className="font-bold text-[15px] text-teal-900 mb-2">別忘了扣掉住宿補助</h2>
        <p className="text-[13px] text-teal-800 leading-relaxed">
          住宿式服務機構使用者補助：CMS 4 級以上或持中度以上身心障礙證明者，每月最高補助 $15,000（按月認列，無排富）；
          2023 年 1 月 1 日前已入住的既有住民每月 $5,000。以上面臺北 5 人房上限 $42,000 為例，符合資格者每月實付可降到 $27,000 起。
          用本站的<Link href="/tools/home-vs-institution" className="font-semibold underline">在宅 vs 機構比較器</Link>可以直接把補助扣進去算。
        </p>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">資料來源與查證日期</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>臺北市一般護理之家收費基準：臺北市政府衛生局訂定，臺北市法規查詢系統（laws.taipei.gov.tw），查證日期 2026 年 10 月 22 日。</li>
          <li>臺中市一般護理之家收費核定原則：臺中市政府衛生局訂定（依護理人員法第 21 條核定），查證日期 2026 年 10 月 22 日。</li>
          <li>新北市精神護理之家收費基準：新北市政府衛生局訂定，民國 104 年發布，查證日期 2026 年 10 月 22 日（年代較久，已於文中註明）。</li>
          <li>高雄市實際收費落差與代收加成上限：高雄市政府衛生局 2026 年稽查說明（經中央社、健康 2.0 報導），查證日期 2026 年 10 月 22 日。</li>
          <li>住宿補助金額：衛生福利部 115 年度住宿式服務機構使用者補助方案。</li>
        </ul>
        <p className="mt-3 text-[12px] text-apple-gray-400 leading-relaxed">
          本頁僅刊登可對應官方來源的數字；未列出的縣市與機構類型不代表沒有收費規定，請依上文方法向所在地縣市政府查詢。實際收費以入住契約與各縣市最新核定為準，CarePilot 不經手任何費用、不推薦特定機構。
        </p>
      </section>
    </main>
  );
}
