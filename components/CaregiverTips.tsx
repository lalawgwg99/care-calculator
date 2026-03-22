"use client";

const TIPS = [
  {
    emoji: "☕",
    title: "記得照顧自己",
    content: "主要照顧者的身心健康和長輩一樣重要。每天給自己至少 30 分鐘的獨處時間，就算只是喝杯咖啡也好。",
  },
  {
    emoji: "📱",
    title: "善用喘息服務",
    content: "政府的第四包「喘息服務」就是為了讓您休息而設計的。CMS 2～6 級每年有 $32,340 的額度，可以申請臨時替代照顧。",
  },
  {
    emoji: "👥",
    title: "建立支持網絡",
    content: "加入當地的家庭照顧者支持團體。許多縣市的家庭照顧者關懷總會（0800-507-272）都有免費諮詢和支持活動。",
  },
  {
    emoji: "📝",
    title: "做好財務紀錄",
    content: "每月記錄長照相關支出，不僅方便報稅扣除（每人每年上限 12 萬），也能幫助您掌握長期的財務狀況。",
  },
];

export default function CaregiverTips() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mb-16">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-[32px] p-8 sm:p-10 border border-orange-100/50">
        <div className="text-center mb-8">
          <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 tracking-tight mb-2">
            🤗 給照顧者的溫柔提醒
          </h3>
          <p className="text-[15px] text-amber-800/60">
            照顧長輩的同時，也請好好照顧自己。
          </p>
        </div>

        {/* 1925 安心專線 */}
        <a
          href="tel:1925"
          className="flex items-center gap-4 bg-blue-50/80 rounded-[20px] p-5 border border-blue-100/60 mb-4 hover:bg-blue-100/60 transition-colors group"
        >
          <div className="text-[32px] flex-shrink-0">💙</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[16px] font-bold text-blue-800 mb-1">照顧者心理支援熱線</h4>
            <p className="text-[13px] text-blue-700/70 leading-relaxed">
              感到情緒崩潰、無法入睡或難以繼續照顧時，請撥打
              <strong className="text-blue-700"> 安心專線 1925</strong>（24 小時 · 免付費）
            </p>
          </div>
          <div className="text-[13px] font-bold text-white bg-blue-600 group-hover:bg-blue-700 transition-colors px-4 py-2 rounded-full flex-shrink-0">
            撥打 1925
          </div>
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-[20px] p-5 border border-white/50 shadow-sm"
            >
              <div className="text-[28px] mb-3">{tip.emoji}</div>
              <h4 className="text-[16px] font-bold text-apple-gray-900 mb-2">{tip.title}</h4>
              <p className="text-[14px] text-apple-gray-600 leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
