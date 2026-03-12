"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "1",
    title: "撥打長照專線 1966",
    desc: "市話免付費、手機可撥打。告知家中長輩的基本狀況。",
    tip: "建議先記下長輩的身分證字號和健保卡號。",
    icon: "📞",
  },
  {
    num: "2",
    title: "照管專員到府評估",
    desc: "專員會在 7～14 天內到家中，用 CMS 量表評估長輩的失能等級。",
    tip: "評估當天建議主要照顧者在場，方便說明日常狀況。",
    icon: "🏠",
  },
  {
    num: "3",
    title: "收到核定結果通知",
    desc: "評估完成後約 5～10 個工作天，會收到核定公文，告知等級與可用額度。",
    tip: "如果對結果有疑義，可以在 30 天內申請重新評估。",
    icon: "📄",
  },
  {
    num: "4",
    title: "與服務單位簽約",
    desc: "照管專員會推薦合適的長照服務單位（居服中心、日照中心等），協助您簽約。",
    tip: "可以先參觀 2～3 間單位，選擇服務態度最好的那間。",
    icon: "✍️",
  },
  {
    num: "5",
    title: "開始接受服務",
    desc: "簽約後最快 3～5 天就會有照服員到府服務。每月可依需求調整服務項目。",
    tip: "記得保留服務紀錄單，每月核對帳單金額。",
    icon: "🤝",
  },
];

// 住宿式機構補助申請專屬流程
const INSTITUTION_STEPS = [
  {
    num: "1",
    title: "確認資格：CMS 4 級以上",
    desc: "先透過 1966 申請 CMS 等級評估。需達第 4 級以上（或中度以上身心障礙證明）。",
    tip: "自 112 年起已取消排富條款，不論家庭收入皆可申請。",
    icon: "✅",
  },
  {
    num: "2",
    title: "選擇合法立案機構",
    desc: "入住依法設立的住宿式長照機構（護理之家、老人福利機構、身障機構等）。",
    tip: "可上衛福部「長照服務資源地理地圖」查詢合法機構。",
    icon: "🏥",
  },
  {
    num: "3",
    title: "累計入住滿 180 天",
    desc: "當年度入住天數需累計達 180 天，即可申請全額 $120,000 年度補助。未滿 180 天按月計算。",
    tip: "建議年初入住以確保達標。年中入住者第一年補助可能較少。",
    icon: "📅",
  },
  {
    num: "4",
    title: "機構協助申請或自行申請",
    desc: "多數機構會代為彙整資料，向縣市政府提出補助申請。也可自行向戶籍所在地的社會局申請。",
    tip: "申請需檢附入住證明、身分證件影本、金融帳戶資料。",
    icon: "📋",
  },
  {
    num: "5",
    title: "審核通過、撥款入帳",
    desc: "審核約需 1～2 個月。通過後補助款直接匯入指定帳戶。",
    tip: "補助為事後申請制，通常在隔年初統一受理上年度申請。",
    icon: "💰",
  },
];

// 各縣市照管中心聯絡資訊
const REGIONAL_CONTACTS = [
  { region: "台北市", phone: "02-2597-5202", center: "台北市長期照顧管理中心" },
  { region: "新北市", phone: "02-2960-3456", center: "新北市長期照顧管理中心" },
  { region: "桃園市", phone: "03-332-1328", center: "桃園市長期照顧管理中心" },
  { region: "台中市", phone: "04-2515-2888", center: "台中市長期照顧管理中心" },
  { region: "台南市", phone: "06-293-1232", center: "台南市長期照顧管理中心" },
  { region: "高雄市", phone: "07-713-4000", center: "高雄市長期照顧管理中心" },
];

export default function ApplicationGuide() {
  const [showInstitutionPath, setShowInstitutionPath] = useState(false);
  const [showRegionalContacts, setShowRegionalContacts] = useState(false);

  const currentSteps = showInstitutionPath ? INSTITUTION_STEPS : STEPS;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 mb-16">
      <div className="text-center mb-10">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 tracking-tight mb-3">
          📋 申請長照只要 5 步驟
        </h3>
        <p className="text-[15px] text-apple-gray-500 mb-5">
          從撥打電話到開始服務，通常只需要 2～4 週。
        </p>

        {/* 切換：一般申請 vs 機構補助 */}
        <div className="inline-flex bg-apple-gray-100 rounded-full p-1">
          <button
            onClick={() => setShowInstitutionPath(false)}
            className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
              !showInstitutionPath
                ? "bg-white text-apple-gray-900 shadow-sm"
                : "text-apple-gray-500 hover:text-apple-gray-700"
            }`}
          >
            居家／日照申請
          </button>
          <button
            onClick={() => setShowInstitutionPath(true)}
            className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
              showInstitutionPath
                ? "bg-white text-apple-gray-900 shadow-sm"
                : "text-apple-gray-500 hover:text-apple-gray-700"
            }`}
          >
            住宿式機構補助
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-gradient-to-b from-apple-orange/40 via-apple-pink/30 to-apple-orange/10 rounded-full" />

        <div className="space-y-6">
          {currentSteps.map((step, idx) => (
            <div key={`${showInstitutionPath ? 'inst' : 'home'}-${idx}`} className="relative flex gap-5 items-start">
              {/* Circle indicator */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200/60 flex items-center justify-center text-[24px] flex-shrink-0 shadow-sm">
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white rounded-[20px] border border-apple-gray-200/50 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-bold text-apple-orange bg-apple-orange/10 rounded-full px-2.5 py-0.5">
                    步驟 {step.num}
                  </span>
                </div>
                <h4 className="text-[17px] font-bold text-apple-gray-900 mb-1.5">{step.title}</h4>
                <p className="text-[14px] text-apple-gray-600 leading-relaxed mb-3">{step.desc}</p>
                <div className="bg-amber-50/60 rounded-[12px] px-4 py-3 border border-orange-100/50">
                  <p className="text-[13px] text-amber-800/70 leading-relaxed">
                    💡 <strong>小提醒：</strong>{step.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1966 快速撥打 + 地區聯絡 */}
      <div className="mt-10 space-y-4">
        {/* 1966 CTA */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[24px] p-6 border border-emerald-200/50 text-center">
          <p className="text-[15px] text-emerald-800 font-medium mb-3">
            不知道從何開始？撥打長照專線，專人引導您
          </p>
          <a
            href="tel:1966"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-[17px] font-bold shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition-colors"
          >
            📞 撥打 1966（免費）
          </a>
          <p className="text-[12px] text-emerald-600/60 mt-3">
            服務時間：週一至週五 08:30～12:00、13:30～17:30
          </p>
        </div>

        {/* 地區照管中心 */}
        <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
          <button
            onClick={() => setShowRegionalContacts(!showRegionalContacts)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-[18px]">📍</span>
              <span className="text-[15px] font-bold text-apple-gray-900">各縣市照管中心聯絡電話</span>
            </div>
            <span className={`text-apple-gray-400 text-[18px] transition-transform duration-300 ${showRegionalContacts ? "rotate-45" : ""}`}>+</span>
          </button>
          {showRegionalContacts && (
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REGIONAL_CONTACTS.map((contact) => (
                  <div key={contact.region} className="flex items-center justify-between p-3 bg-apple-gray-50 rounded-[14px]">
                    <div>
                      <div className="text-[14px] font-semibold text-apple-gray-900">{contact.region}</div>
                      <div className="text-[12px] text-apple-gray-500">{contact.center}</div>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/-/g, '')}`}
                      className="text-[14px] font-mono font-bold text-apple-blue hover:underline flex-shrink-0"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-apple-gray-400 mt-3 text-center">
                其他縣市請撥打 1966 轉接當地照管中心
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
