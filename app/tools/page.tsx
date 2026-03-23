import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "實用工具 | 長照決策引擎",
  description: "保險補充計算、法律事項引導、疾病照顧檔案、遊戲化評估工具、就診準備清單、復能任務卡等長照實用工具。",
};

const TOOL_GROUPS = [
  {
    title: "財務 & 法律",
    color: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    tools: [
      {
        href: "/insurance",
        icon: "🛡️",
        title: "保險補充計算",
        desc: "計算私人保險能補足多少長照缺口",
      },
      {
        href: "/insurance#legal",
        icon: "⚖️",
        title: "法律事項引導",
        desc: "監護宣告、安養信託、遺囑規劃逐步引導",
      },
    ],
  },
  {
    title: "疾病照顧",
    color: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    tools: [
      {
        href: "/tools/conditions",
        icon: "🫀",
        title: "疾病照顧檔案",
        desc: "失智症、中風、帕金森等常見疾病照顧指引",
      },
      {
        href: "/tools/conditions#timeline",
        icon: "📅",
        title: "照顧歷程時間軸",
        desc: "各階段照顧需求與費用預估",
      },
      {
        href: "/tools/conditions#checklist",
        icon: "📋",
        title: "機構評估清單",
        desc: "選擇居家或住宿機構的評估評分表",
      },
    ],
  },
  {
    title: "照顧者健康",
    color: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    tools: [
      {
        href: "/tools/caregiverhealth",
        icon: "🧠",
        title: "失智症體驗模擬",
        desc: "體驗失智症長輩的日常挑戰，培養同理心",
      },
      {
        href: "/tools/caregiverhealth#burnout",
        icon: "💆",
        title: "照顧者倦怠檢測",
        desc: "10 題評估身心狀態，配對喘息支持資源",
      },
    ],
  },
  {
    title: "日常照顧",
    color: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    tools: [
      {
        href: "/tools/daily",
        icon: "🏥",
        title: "就診準備清單",
        desc: "生命徵象、用藥清單、問診問題一次備齊",
      },
      {
        href: "/tools/daily#comm",
        icon: "💬",
        title: "家庭溝通模板",
        desc: "交班訊息、家庭會議議程、緊急通知範本",
      },
      {
        href: "/tools/reablement",
        icon: "🌟",
        title: "微光復能任務卡",
        desc: "每週復能活動卡，身體、認知、社交全方位",
      },
    ],
  },
  {
    title: "創業 & 收入",
    color: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    tools: [
      {
        href: "/tools/startup-ideas",
        icon: "💡",
        title: "5萬元創業方案",
        desc: "適合照顧者的低成本創業點子，補貼長照費用",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">🛠️</span>
          <span className="text-[13px] font-semibold text-amber-800">實用工具箱</span>
        </div>
        <h1 className="text-[32px] font-bold text-apple-gray-900 mb-3">
          長照照顧工具
        </h1>
        <p className="text-[16px] text-apple-gray-500 max-w-xl mx-auto">
          從財務規劃到日常照顧，提供照顧家庭最需要的實用工具
        </p>
      </div>

      {/* Tool Groups */}
      <div className="space-y-8">
        {TOOL_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-[16px] font-semibold text-apple-gray-500 uppercase tracking-wider mb-3 px-1">
              {group.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`bg-gradient-to-br ${group.color} border border-white/80 rounded-[20px] p-5 flex items-start gap-4 hover:shadow-apple-hover transition-shadow group`}
                >
                  <div className={`${group.iconBg} rounded-[14px] w-11 h-11 flex items-center justify-center text-[22px] shrink-0`}>
                    {tool.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-apple-gray-900 group-hover:text-amber-800 transition-colors">
                      {tool.title}
                    </div>
                    <div className="text-[13px] text-apple-gray-500 mt-0.5 leading-snug">
                      {tool.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Resource Search CTA */}
      <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-[24px] p-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-[17px] text-apple-gray-900 mb-1">找不到合適的資源？</div>
          <div className="text-[14px] text-apple-gray-500">搜尋台灣各縣市照顧機構、政府服務與支持團體</div>
        </div>
        <Link
          href="/search"
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[14px] px-5 py-2.5 rounded-full transition-colors"
        >
          資源搜尋 →
        </Link>
      </div>
    </main>
  );
}
