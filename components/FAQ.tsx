"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "什麼是長照 2.0 / 3.0？跟我有什麼關係？",
    a: "長照是政府針對失能、失智長輩提供的照顧補助制度。只要家中長輩經評估為 CMS 2 級以上，就可以獲得居家照顧、交通接送、喘息服務等補助。長照 3.0 是 2026 年起的最新版本，擴大了補助範圍與額度。",
  },
  {
    q: "我要怎麼申請長照服務？",
    a: "撥打長照專線 1966（市話免費），專員會安排到府評估長輩的失能等級。評估完成後，照顧管理專員會協助您制定照顧計畫，並安排簽約服務。從撥打電話到開始服務，通常需要 2～4 週。",
  },
  {
    q: "CMS 等級是什麼？要怎麼知道長輩是幾級？",
    a: "CMS（照顧管理評估量表）是衡量長輩失能程度的標準，共分 1～8 級。等級越高，代表需要越多照顧，政府補助也越多。您不需要自行判斷，撥打 1966 後會有專業人員到府評估。本網站也提供快速預估功能，幫您先大致了解。",
  },
  {
    q: "聘外籍看護還能申請長照補助嗎？",
    a: "可以，但補助額度會縮減為原本的 30%，且只能用於「專業服務」（如復健指導、營養諮詢等），不能用於一般的居家照顧服務。",
  },
  {
    q: "長照補助的「四包錢」是什麼意思？",
    a: "政府將長照補助分為四大類：❶ 照顧及專業服務（每月定額）、❷ 交通接送（CMS 4級以上）、❸ 輔具及無障礙改造（每3年上限4萬）、❹ 喘息服務（讓主要照顧者休息的臨時替代照顧）。本工具會自動幫您計算這四包的總合。",
  },
  {
    q: "家裡兄弟姊妹很多，費用怎麼分攤？",
    a: "這正是本工具設計的初衷之一！在完成試算後，您可以在「5 年財務報表」頁面使用「家庭分攤」功能，輸入分攤人數，系統會自動算出每人每月應分攤的金額，方便您在家族群組中討論。",
  },
  {
    q: "等待評估期間，照顧怎麼辦？有什麼過渡方案？",
    a: "從撥打 1966 到正式開始服務，通常需要 2-4 週。這段過渡期可以：① 請醫院社工師協助「出院準備銜接長照」，② 自費短期委託居家服務員（無需長照資格，居服機構可直接預約），③ 聯繫家庭照顧者關懷總會（0800-507-272）詢問緊急喘息資源，④ 詢問當地日照中心是否有「評估前短期體驗」名額。",
  },
  {
    q: "對 CMS 評估結果不滿意，可以怎麼做？",
    a: "收到評估結果後 30 天內，可向縣市照顧管理中心申請「重新評估」，完全免費。建議準備：最新醫師診斷書、日常功能限制的具體描述（如無法自行如廁、需人攙扶才能站立等）、以及生活記錄照片或影片。不需要透過法律途徑，直接由照管中心受理。若結果仍有疑問，可進一步向縣市政府社會局申請行政救濟。",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mb-16">
      <div className="text-center mb-10">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 tracking-tight mb-3">
          💬 常見問題
        </h3>
        <p className="text-[15px] text-apple-gray-500">
          家屬最常問的長照問題，我們幫您整理好了。
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[20px] border border-apple-gray-200/50 overflow-hidden shadow-sm transition-shadow hover:shadow-apple-warm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className="text-[16px] font-semibold text-apple-gray-900 pr-4 leading-snug">
                {item.q}
              </span>
              <span
                className={`text-[20px] text-apple-gray-400 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === idx ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <p className="text-[15px] text-apple-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
