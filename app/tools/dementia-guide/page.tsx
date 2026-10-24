"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import DementiaGuide from "@/components/DementiaGuide";

export default function DementiaGuidePage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="heart" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">失智照護</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">失智行為應對速查</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          半夜不睡、吵著出門、懷疑被偷、拒絕洗澡、重複問話——這五種情境最常讓照顧者崩潰。
          選你正在遇到的狀況，看當下怎麼做、什麼不能做、什麼時候要求助。
        </p>
      </div>

      <DementiaGuide />

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">使用前先看：三個前提</h2>
        <div className="space-y-2.5 text-[13px] text-apple-gray-600 leading-relaxed">
          <p>
            <strong className="text-apple-gray-900">1. 行為突然改變，先想身體原因。</strong>
            失智長輩行為「突然」惡化（幾天內），常見原因是泌尿道感染、脫水、便秘、疼痛或新藥副作用，而不是失智惡化。這類情況可以治療，請先就醫檢查。
          </p>
          <p>
            <strong className="text-apple-gray-900">2. 這不是診斷工具。</strong>
            本頁是照護應對參考，不能判斷長輩是否失智、屬於哪一型或哪一期。懷疑失智請至神經內科或精神科記憶門診評估，或經由各縣市失智共同照護中心協助。
          </p>
          <p>
            <strong className="text-apple-gray-900">3. 每個長輩適用的方法不同。</strong>
            同一個方法對不同個案效果不同，本頁整理的是衛教資料中最常建議、風險最低的作法；若某招無效，換一招，不要硬套。
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">內容依據</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>臺大醫院健康教育中心衛教單張「失智症照護實用技巧和建議——問題行為篇」：日落症候群、睡眠與妄想應對，查證日期 2026 年 10 月 22 日。</li>
          <li>大里仁愛醫院失智共同照護中心衛教資料（李綜合醫療社團法人）：被偷妄想占比、錯認與吵著回家的應對，查證日期 2026 年 10 月 22 日。</li>
          <li>衛生福利部新營醫院（2026 年）：拒絕洗澡「停、找、拆、選、換」五字口訣與進階期拒絕照護比例。</li>
          <li>求助資源：台灣失智症協會失智症關懷專線 0800-474-580、長照專線 1966、家庭照顧者關懷總會 0800-507-272。</li>
        </ul>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link href="/blog/dementia-care-subsidy-guide" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">失智症家庭的完整費用規劃</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">認知功能障礙的照顧路徑與補助，一頁看完</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">當在家照顧撐不住時，先算清楚另一條路的代價</div>
        </Link>
      </section>
    </main>
  );
}
