"use client";

import { useMemo, useState } from "react";

/**
 * 巴氏量表（Barthel Index）自評工具。
 *
 * 權重與分數區間依據（查證 2026-10-29）：
 * - 十項權重：移位 15、行走 15、進食／穿衣／大便控制／小便控制／如廁／
 *   上下樓梯各 10、洗澡／修飾各 5，滿分 100。
 * - 五段區間：0–20 完全依賴、21–60 嚴重依賴、61–90 中度依賴、
 *   91–99 輕度依賴、100 完全獨立（多來源一致：三軍總醫院功能狀態評量表、
 *   國立臺北護理健康大學護理系教材、臺灣復健醫誌 2020 年巴氏量表信度研究）。
 *
 * 誠實邊界：
 * - 本頁是自評參考，不是診斷、也不是正式評估。
 * - 台灣各項申請的實際門檻分數尚未在本頁核實，絕不把分數寫成
 *   「符合／不符合申請資格」的結論；申請資格以照管中心／相關單位核定為準。
 * - 評的是「現在做得到」的狀態，分數會隨身體狀況變化。
 */

export interface BarthelOption {
  label: string;
  score: number;
}

export interface BarthelItem {
  id: string;
  label: string;
  hint: string;
  max: number;
  options: BarthelOption[];
}

export const BARTHEL_ITEMS: BarthelItem[] = [
  {
    id: "feeding",
    label: "進食",
    hint: "自己拿餐具吃完一餐，不需別人餵",
    max: 10,
    options: [
      { label: "獨立完成", score: 10 },
      { label: "需要協助（備餐、切食物、提醒）", score: 5 },
      { label: "完全依賴（需餵食）", score: 0 },
    ],
  },
  {
    id: "bathing",
    label: "洗澡",
    hint: "自己進出浴室、完成全身洗澡",
    max: 5,
    options: [
      { label: "獨立完成", score: 5 },
      { label: "完全依賴", score: 0 },
    ],
  },
  {
    id: "grooming",
    label: "修飾（個人衛生）",
    hint: "洗臉、刷牙、刮鬍子、梳頭等",
    max: 5,
    options: [
      { label: "獨立完成", score: 5 },
      { label: "完全依賴", score: 0 },
    ],
  },
  {
    id: "dressing",
    label: "穿衣",
    hint: "自己穿脫衣服、扣釦子、穿鞋襪",
    max: 10,
    options: [
      { label: "獨立完成", score: 10 },
      { label: "需要協助", score: 5 },
      { label: "完全依賴", score: 0 },
    ],
  },
  {
    id: "bowels",
    label: "大便控制",
    hint: "能否控制排便、自行處理",
    max: 10,
    options: [
      { label: "能控制", score: 10 },
      { label: "偶爾失禁", score: 5 },
      { label: "失禁、需別人處理", score: 0 },
    ],
  },
  {
    id: "bladder",
    label: "小便控制",
    hint: "能否控制排尿、自行使用便器或尿布",
    max: 10,
    options: [
      { label: "能控制", score: 10 },
      { label: "偶爾失禁", score: 5 },
      { label: "失禁、需別人處理", score: 0 },
    ],
  },
  {
    id: "toilet",
    label: "如廁",
    hint: "自己上下馬桶、擦拭、整理衣物",
    max: 10,
    options: [
      { label: "獨立完成", score: 10 },
      { label: "需要協助", score: 5 },
      { label: "完全依賴", score: 0 },
    ],
  },
  {
    id: "transfer",
    label: "移位（床 ↔ 椅／輪椅）",
    hint: "在床和椅子、輪椅之間移動",
    max: 15,
    options: [
      { label: "獨立完成", score: 15 },
      { label: "需要少許協助", score: 10 },
      { label: "需要大量協助", score: 5 },
      { label: "無法移位", score: 0 },
    ],
  },
  {
    id: "mobility",
    label: "行走（平地）",
    hint: "在平地上走動（可用輔具）",
    max: 15,
    options: [
      { label: "獨立行走", score: 15 },
      { label: "輪椅可獨立行動", score: 10 },
      { label: "需要協助行走", score: 5 },
      { label: "無法行動", score: 0 },
    ],
  },
  {
    id: "stairs",
    label: "上下樓梯",
    hint: "自己上下一層樓梯（可用扶手）",
    max: 10,
    options: [
      { label: "獨立完成", score: 10 },
      { label: "需要協助", score: 5 },
      { label: "無法上下樓梯", score: 0 },
    ],
  },
];

export const BARTHEL_MAX = BARTHEL_ITEMS.reduce((sum, item) => sum + item.max, 0);

export interface BarthelBand {
  range: string;
  title: string;
  plain: string;
}

export function barthelBand(score: number): BarthelBand {
  if (score >= 100) {
    return {
      range: "100 分",
      title: "完全獨立",
      plain:
        "日常生活十項都能自己完成，不需要別人動手幫忙。這不代表所有生活面向都不需要支持——外出、理財、就醫安排等仍可能需要家人協助。",
    };
  }
  if (score >= 91) {
    return {
      range: "91–99 分",
      title: "輕度依賴",
      plain:
        "大致能自理，只有 1–2 項需要旁人搭把手。先看是哪幾項失分，把協助集中在那幾項就好，不必全天候陪著。",
    };
  }
  if (score >= 61) {
    return {
      range: "61–90 分",
      title: "中度依賴",
      plain:
        "多數項目能自己來，但有幾項需要協助，照顧人力要排進日常作息。建議把需要協助的項目列出來，和家人或照顧服務討論分工。",
    };
  }
  if (score >= 21) {
    return {
      range: "21–60 分",
      title: "嚴重依賴",
      plain:
        "大多數項目都需要大量協助，幾乎離不開照顧者。建議儘早撥 1966 請照管中心評估，討論居家服務、日間照顧或機構等安排。",
    };
  }
  return {
    range: "0–20 分",
    title: "完全依賴",
    plain:
      "幾乎所有日常生活都需要別人全程協助。照顧負荷最重，建議儘早尋求專業評估與支持資源，不要一個人硬撐。",
  };
}

export default function BarthelSelfCheck() {
  const [scores, setScores] = useState<(number | null)[]>(
    () => BARTHEL_ITEMS.map(() => null)
  );

  const answered = scores.filter((s) => s !== null).length;
  const total = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const complete = answered === BARTHEL_ITEMS.length;
  const band = useMemo(() => (complete ? barthelBand(total) : null), [complete, total]);

  const setScore = (index: number, score: number) => {
    setScores((prev) => prev.map((s, i) => (i === index ? score : s)));
  };

  const reset = () => setScores(BARTHEL_ITEMS.map(() => null));

  return (
    <div className="space-y-5">
      <section className="bg-amber-50 border border-amber-200 rounded-[14px] p-5">
        <h2 className="font-bold text-[15px] text-amber-900 mb-2">⚠️ 先說清楚：這是自評，不是正式評估</h2>
        <ul className="space-y-1.5 text-[13px] text-amber-800 leading-relaxed list-disc pl-5">
          <li>本頁幫你把長輩「現在做得到」的狀態換算成巴氏量表分數，方便和家人、醫療團隊溝通；它不能診斷疾病，也不能取代專業評估。</li>
          <li>台灣各項申請（例如外籍看護、機構補助）的實際門檻分數尚未在本頁核實，本頁<strong>不會</strong>告訴你「符合／不符合申請資格」；申請資格以照管中心／相關單位核定為準。</li>
          <li>分數會隨身體狀況變化；若長輩狀況突然變差，請先就醫檢查身體原因（感染、脫水、藥物副作用等），不要只看分數。</li>
        </ul>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="font-bold text-[16px] text-apple-gray-900">
            10 項逐項點選（已填 {answered}／10 項）
          </h2>
          <button
            type="button"
            onClick={reset}
            className="text-[13px] text-apple-gray-500 underline underline-offset-2 hover:text-apple-gray-900"
          >
            全部重填
          </button>
        </div>
        <div className="space-y-4">
          {BARTHEL_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="border border-apple-gray-200/60 rounded-[12px] p-4"
            >
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <div className="font-semibold text-[14px] text-apple-gray-900">
                  {index + 1}. {item.label}
                  <span className="text-apple-gray-400 font-normal text-[12px] ml-2">
                    滿分 {item.max} 分
                  </span>
                </div>
                <div className="text-[12px] text-apple-gray-500">{item.hint}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {item.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setScore(index, opt.score)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                      scores[index] === opt.score
                        ? "border-teal-600 bg-teal-50 font-semibold text-teal-900"
                        : "border-apple-gray-200/80 hover:border-apple-gray-400 text-apple-gray-700"
                    }`}
                  >
                    {opt.label}（{opt.score} 分）
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">自評結果</h2>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="text-[40px] leading-none font-bold text-apple-gray-900 font-mono">
            {total}
          </div>
          <div className="text-[15px] text-apple-gray-500 pb-1">／ 100 分</div>
          {!complete && (
            <div className="text-[13px] text-amber-700 pb-1">
              目前加總（未填項目以 0 計）；完成 10 項後顯示分數區間。
            </div>
          )}
        </div>
        {band ? (
          <div className="mt-4 bg-teal-50 rounded-[12px] p-4">
            <div className="font-bold text-[16px] text-teal-900">
              {band.range}：{band.title}
            </div>
            <p className="text-[14px] text-teal-800 leading-relaxed mt-1.5">{band.plain}</p>
            <p className="text-[13px] text-teal-700 leading-relaxed mt-2">
              下一步建議：把這張自評結果帶去和醫療團隊或照管中心（1966）討論；正式評估與任何申請資格，都以專業人員與相關單位的核定為準，本頁分數不等於核定結果。
            </p>
          </div>
        ) : (
          <div className="mt-4 bg-apple-gray-50 rounded-[12px] p-4 text-[13px] text-apple-gray-600 leading-relaxed">
            還差 {BARTHEL_ITEMS.length - answered} 項沒填。全部填完後，這裡會顯示分數代表的依賴程度與白話說明。
          </div>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-apple-gray-400 border-b border-apple-gray-100">
                <th className="py-2 pr-3 font-medium">分數區間</th>
                <th className="py-2 font-medium">依賴程度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-50 text-apple-gray-700">
              <tr><td className="py-2 pr-3 font-mono">100 分</td><td className="py-2">完全獨立</td></tr>
              <tr><td className="py-2 pr-3 font-mono">91–99 分</td><td className="py-2">輕度依賴</td></tr>
              <tr><td className="py-2 pr-3 font-mono">61–90 分</td><td className="py-2">中度依賴</td></tr>
              <tr><td className="py-2 pr-3 font-mono">21–60 分</td><td className="py-2">嚴重依賴</td></tr>
              <tr><td className="py-2 pr-3 font-mono">0–20 分</td><td className="py-2">完全依賴</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
