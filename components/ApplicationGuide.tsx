"use client";

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

export default function ApplicationGuide() {
  return (
    <section className="w-full max-w-2xl mx-auto px-4 mb-16">
      <div className="text-center mb-10">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 tracking-tight mb-3">
          📋 申請長照只要 5 步驟
        </h3>
        <p className="text-[15px] text-apple-gray-500">
          從撥打電話到開始服務，通常只需要 2～4 週。
        </p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-gradient-to-b from-apple-orange/40 via-apple-pink/30 to-apple-orange/10 rounded-full" />

        <div className="space-y-6">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative flex gap-5 items-start">
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
    </section>
  );
}
