"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import BarthelSelfCheck from "@/components/BarthelSelfCheck";

export default function BarthelCheckPage() {
  return (
    <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-4">
          <Icon name="clipboard" size={18} />
          <span className="text-[13px] font-semibold text-teal-800">生活功能自評</span>
        </div>
        <h1 className="text-[30px] font-bold text-apple-gray-900 mb-3">巴氏量表自評工具</h1>
        <p className="text-[15px] text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          進食、洗澡、穿衣、如廁、移位、行走……十項日常生活逐項點選，即時加總 0–100 分，
          用白話告訴你分數代表的依賴程度。填之前請先看警語：這是自評，不是正式評估。
        </p>
      </div>

      <BarthelSelfCheck />

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">使用前先看：三個前提</h2>
        <div className="space-y-2.5 text-[13px] text-apple-gray-600 leading-relaxed">
          <p>
            <strong className="text-apple-gray-900">1. 這不是診斷工具。</strong>
            本頁是生活功能自評參考，不能判斷長輩得了什麼病、屬於哪一期，也不能作為任何申請的核定依據。正式評估請由醫療專業人員或照管中心（1966）進行。
          </p>
          <p>
            <strong className="text-apple-gray-900">2. 分數不等於申請資格。</strong>
            台灣各項申請的實際門檻分數尚未在本頁核實，本頁不會告訴你「符合／不符合申請資格」；看到低分不代表一定申請得到，看到高分也不代表申請不到，一切以相關單位核定為準。
          </p>
          <p>
            <strong className="text-apple-gray-900">3. 評的是「現在做得到」。</strong>
            依長輩今天實際能做到的程度點選，不要填「希望他做到」或「以前做得到」。狀況突然變差時，先就醫檢查身體原因，不要只看分數。
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">內容依據</h2>
        <ul className="space-y-2 text-[13px] text-apple-gray-600 leading-relaxed list-disc pl-5">
          <li>巴氏量表（Barthel Index）十項權重：移位 15 分、行走 15 分、進食／穿衣／大便控制／小便控制／如廁／上下樓梯各 10 分、洗澡／修飾各 5 分，滿分 100 分。查證日期 2026 年 10 月 29 日。</li>
          <li>五段分數區間：0–20 分完全依賴、21–60 分嚴重依賴、61–90 分中度依賴、91–99 分輕度依賴、100 分完全獨立（多來源一致：三軍總醫院功能狀態評量表、國立臺北護理健康大學護理系教材、臺灣復健醫誌 2020 年巴氏量表信度研究）。</li>
          <li>求助資源：長照專線 1966、家庭照顧者關懷總會 0800-507-272。</li>
        </ul>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link href="/tools/institution-subsidy" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">住宿式機構補助試算器</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">自評後若在考慮機構，先算補助與每月實付缺口</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">兩邊每月總自付同屏對照，含補助抵扣與家人請假成本</div>
        </Link>
      </section>
    </main>
  );
}
