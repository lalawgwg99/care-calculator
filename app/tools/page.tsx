"use client";

import NavBar from "@/components/NavBar";

const TOOLS = [
  {
    id: "dementia-sim",
    icon: "🧠",
    title: "失智溝通模擬器",
    description: "5 個真實情境，學習專業的溝通技巧。測測你的照顧溝通力！",
    href: "/tools/dementia-sim",
    tag: "互動遊戲",
    tagColor: "bg-purple-100 text-purple-700",
    available: true,
  },
  {
    id: "burnout-check",
    icon: "💛",
    title: "照顧者壓力檢測",
    description: "10 題自我檢測，1 分鐘了解自己的壓力狀態。照顧別人之前，先看看自己。",
    href: "/tools/burnout-check",
    tag: "心理支持",
    tagColor: "bg-rose-100 text-rose-700",
    available: true,
  },
  {
    id: "medical-prep",
    icon: "🏥",
    title: "就醫神隊友",
    description: "看診前填寫，自動生成「就醫提問單」，拿手機給醫生看就好。",
    href: "/tools/medical-prep",
    tag: "實用工具",
    tagColor: "bg-blue-100 text-blue-700",
    available: true,
  },
  {
    id: "caregiver-comm",
    icon: "🗣️",
    title: "看護溝通卡",
    description: "一鍵生成中印/中越雙語對照的照顧清單，貼冰箱或傳 LINE。",
    href: "/tools/caregiver-comm",
    tag: "實用工具",
    tagColor: "bg-blue-100 text-blue-700",
    available: true,
  },
  {
    id: "care-timeline",
    icon: "📅",
    title: "照顧時間軸",
    description: "根據疾病和 CMS 等級，看到未來每個階段該準備什麼。",
    href: "/tools/care-timeline",
    tag: "規劃工具",
    tagColor: "bg-green-100 text-green-700",
    available: false,
  },
  {
    id: "reablement",
    icon: "🌟",
    title: "每週微光任務卡",
    description: "每週 3 個適合長輩的生活小任務，打卡累積復能點數。",
    href: "/tools/reablement",
    tag: "復能訓練",
    tagColor: "bg-amber-100 text-amber-700",
    available: false,
  },
];

export default function ToolsPage() {
  return (
    <>
      <NavBar currentSection="tools" />
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[48px] mb-3">🧰</div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-apple-gray-900 tracking-tight mb-3">
              照顧工具箱
            </h1>
            <p className="text-[16px] text-apple-gray-500">
              讓每天的照顧更輕鬆一點
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <div key={tool.id} className="relative">
                {tool.available ? (
                  <a
                    href={tool.href}
                    className="block bg-white rounded-[24px] p-6 border border-apple-gray-200/50 shadow-sm hover:shadow-apple-warm hover:border-apple-gray-300/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-[36px]">{tool.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-[16px] font-bold text-apple-gray-900">{tool.title}</h3>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                            {tool.tag}
                          </span>
                        </div>
                        <p className="text-[13px] text-apple-gray-500 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white/60 rounded-[24px] p-6 border border-apple-gray-200/30 opacity-60">
                    <div className="flex items-start gap-4">
                      <div className="text-[36px] grayscale">{tool.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-[16px] font-bold text-apple-gray-600">{tool.title}</h3>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-apple-gray-100 text-apple-gray-500">
                            即將推出
                          </span>
                        </div>
                        <p className="text-[13px] text-apple-gray-400 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA to calculator */}
          <div className="mt-10 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[15px] font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
            >
              💰 先算算看政府補助多少 →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
