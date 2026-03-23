"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StartupIdea {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  minCost: number;
  maxCost: number;
  monthlyIncomeMin: number;
  monthlyIncomeMax: number;
  risk: "low" | "medium" | "high";
  steps: string[];
  tags: string[];
}

const IDEAS: StartupIdea[] = [
  {
    id: "online-tutoring",
    icon: "📚",
    title: "線上教學 / 家教",
    tagline: "把你的專業變成收入",
    description:
      "利用 YouTube、Hahow、TutorABC 或 LINE 群組，將你擅長的技能（語言、料理、電腦、才藝）包裝成課程或一對一家教。幾乎零成本，時間彈性，照顧空檔就能接案。",
    minCost: 0,
    maxCost: 5000,
    monthlyIncomeMin: 15000,
    monthlyIncomeMax: 45000,
    risk: "low",
    steps: [
      "列出 3 個你比一般人更懂的主題",
      "在 Hahow / 蝦皮學習 上架試賣課程（免費）",
      "用手機拍 1 支免費示範影片貼到 Facebook 社團",
      "收到第一筆報名後，用費用購置更好的設備",
    ],
    tags: ["彈性時間", "在家工作", "技能變現"],
  },
  {
    id: "shopee-resell",
    icon: "🛍️",
    title: "蝦皮 / 露天代購網拍",
    tagline: "選對商品，流量幫你賺錢",
    description:
      "從日本、韓國、泰國代購熱門商品，或在台灣批貨後於蝦皮上架。先以 NT$10,000–20,000 小批進貨測試市場，虧損風險有限，成功就追加備貨。",
    minCost: 5000,
    maxCost: 20000,
    monthlyIncomeMin: 10000,
    monthlyIncomeMax: 35000,
    risk: "low",
    steps: [
      "研究蝦皮「熱賣排行」，找毛利 40% 以上的品類",
      "以 NT$5,000 小批進貨（或先用無庫存代購模式）",
      "拍攝商品照、撰寫 SEO 標題後上架",
      "達到 20 筆好評後，追加熱銷品項備貨",
    ],
    tags: ["副業入門", "電商", "可兼職"],
  },
  {
    id: "home-baking",
    icon: "🧁",
    title: "居家烘焙 / 手作食品",
    tagline: "廚房就是你的工廠",
    description:
      "利用現有廚房製作磅蛋糕、手工餅乾、米製品等，透過 Instagram、LINE 群、農夫市集銷售。申請「食品小規模工廠」登記（費用低）後可正式接商業訂單。",
    minCost: 10000,
    maxCost: 30000,
    monthlyIncomeMin: 15000,
    monthlyIncomeMax: 35000,
    risk: "medium",
    steps: [
      "確認 1–2 個主力品項，試做 10 次穩定配方",
      "向親友試賣取得 20 則真實評價",
      "辦理「食品業者登錄」（免費）取得合法資格",
      "上架 Pinkoi / 蝦皮，並接受客製化禮盒訂單",
    ],
    tags: ["在家創業", "手作", "禮品市場"],
  },
  {
    id: "pet-sitter",
    icon: "🐾",
    title: "寵物保母 / 到府照顧",
    tagline: "台灣養寵物比生小孩多",
    description:
      "取得寵物業登記後，提供到府餵食、遛狗、住宿陪伴服務。台灣寵物消費年年成長，保母費每日 NT$800–1,500，假日更高，客戶黏著度極高。",
    minCost: 3000,
    maxCost: 10000,
    monthlyIncomeMin: 20000,
    monthlyIncomeMax: 45000,
    risk: "low",
    steps: [
      "完成寵物急救課程（費用約 NT$1,500）",
      "在 Pawbook / DoggyBo 等平台建立個人頁面",
      "前 5 位客戶半價優惠換取 5 星好評",
      "累積 20 則評價後調回正常定價",
    ],
    tags: ["服務業", "寵物", "社區型"],
  },
  {
    id: "content-creator",
    icon: "🎥",
    title: "自媒體 / 短影音",
    tagline: "一支手機，養活一個頻道",
    description:
      "在 YouTube Shorts、TikTok、Instagram Reels 發布短影音。選定利基主題（長照日記、料理、旅遊、生活），廣告分潤加上業配，6 個月內可達月收 NT$10,000，潛力無上限。",
    minCost: 5000,
    maxCost: 15000,
    monthlyIncomeMin: 5000,
    monthlyIncomeMax: 80000,
    risk: "medium",
    steps: [
      "選定一個你能持續 6 個月的主題，每週發 3 支",
      "購入補光燈 + 手機支架（約 NT$2,000）",
      "複製前 20 支業界熱門影片的結構框架",
      "訂閱數達 1,000 後開啟 YouTube 合作夥伴計畫",
    ],
    tags: ["長期收益", "被動收入", "創意工作"],
  },
  {
    id: "second-hand",
    icon: "♻️",
    title: "二手商品翻售",
    tagline: "別人丟的，你的寶",
    description:
      "到二手店、露天、Facebook 社團尋找低估價商品，清潔整理後以市價在蝦皮或 eBay 轉售。家電、相機、球鞋、古著都是高利潤品類，每月翻售 20–30 件可達 NT$15,000 以上。",
    minCost: 10000,
    maxCost: 30000,
    monthlyIncomeMin: 10000,
    monthlyIncomeMax: 30000,
    risk: "medium",
    steps: [
      "選定 1 個你熟悉的品類（球鞋、相機、古著）",
      "以 NT$10,000 為採購預算，先做 10 筆小單測試",
      "學習基本清潔維修，提高商品定價空間",
      "建立固定的貨源管道（二手店員工、拆房舊貨）",
    ],
    tags: ["低門檻", "現金流", "即時獲利"],
  },
  {
    id: "micro-farm",
    icon: "🌱",
    title: "陽台微型農場 / 植栽",
    tagline: "綠色經濟，兼顧療癒",
    description:
      "在陽台或租用小農地種植香草、多肉、芽菜或觀賞植物，透過農夫市集、Pinkoi、社群媒體銷售。啟動成本極低，且與長照照顧者的療癒需求高度契合。",
    minCost: 5000,
    maxCost: 20000,
    monthlyIncomeMin: 8000,
    monthlyIncomeMax: 20000,
    risk: "medium",
    steps: [
      "從 10–20 種植栽開始，記錄成活率與成本",
      "加入「植物交換」Facebook 社團建立人脈",
      "在農夫市集擺攤一次（攤位費約 NT$500）測試市場",
      "打造品牌包裝，強調「照顧者療癒種植」故事",
    ],
    tags: ["療癒系", "環保", "農夫市集"],
  },
];

const RISK_CONFIG = {
  low: { label: "低風險", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "中風險", color: "bg-amber-100 text-amber-700" },
  high: { label: "高風險", color: "bg-rose-100 text-rose-700" },
};

function formatNTD(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1)} 萬`;
  }
  return `${amount.toLocaleString()}`;
}

export default function StartupIdeas() {
  const [budget, setBudget] = useState(50000);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const eligibleIdeas = IDEAS.filter((idea) => idea.minCost <= budget);

  return (
    <div className="space-y-8">
      {/* Budget Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-100 rounded-[24px] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-violet-100 rounded-[14px] w-12 h-12 flex items-center justify-center text-2xl">
            💰
          </div>
          <div>
            <div className="font-bold text-[18px] text-apple-gray-900">
              您的可用預算
            </div>
            <div className="text-[13px] text-apple-gray-500">
              拖拉調整，篩選適合的創業方案
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <input
            type="range"
            min={5000}
            max={50000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="flex-1 accent-violet-500 h-2 cursor-pointer"
          />
          <div className="bg-white border border-purple-200 rounded-[12px] px-4 py-2 min-w-[100px] text-center">
            <span className="font-bold text-[17px] text-violet-700">
              NT${budget.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-[12px] text-apple-gray-500 px-1">
          <span>NT$5,000</span>
          <span>NT$50,000</span>
        </div>

        <div className="mt-4 bg-white/70 rounded-[14px] px-4 py-3 flex items-center gap-2">
          <span className="text-[20px]">✅</span>
          <span className="text-[14px] text-apple-gray-700">
            您的預算可啟動{" "}
            <span className="font-bold text-violet-700">{eligibleIdeas.length}</span>{" "}
            個創業方案
          </span>
        </div>
      </motion.div>

      {/* Ideas Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {IDEAS.map((idea, index) => {
          const eligible = idea.minCost <= budget;
          const isExpanded = expandedId === idea.id;
          const risk = RISK_CONFIG[idea.risk];

          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: eligible ? 1 : 0.4, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border rounded-[20px] overflow-hidden transition-all duration-200 ${
                eligible
                  ? "border-purple-100 shadow-sm hover:shadow-apple-hover cursor-pointer"
                  : "border-gray-100 cursor-not-allowed"
              }`}
              onClick={() => eligible && setExpandedId(isExpanded ? null : idea.id)}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-50 rounded-[14px] w-12 h-12 flex items-center justify-center text-[24px] shrink-0">
                    {idea.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[15px] text-apple-gray-900">
                        {idea.title}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${risk.color}`}>
                        {risk.label}
                      </span>
                    </div>
                    <div className="text-[12px] text-violet-600 font-medium mt-0.5">
                      {idea.tagline}
                    </div>
                  </div>
                </div>

                {/* Cost & Income */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-[12px] p-3">
                    <div className="text-[11px] text-apple-gray-500 mb-1">啟動成本</div>
                    <div className="font-bold text-[14px] text-apple-gray-900">
                      NT${formatNTD(idea.minCost)}
                      {idea.maxCost > idea.minCost && (
                        <span className="font-normal text-[12px] text-apple-gray-500">
                          {" "}– {formatNTD(idea.maxCost)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-[12px] p-3">
                    <div className="text-[11px] text-apple-gray-500 mb-1">月收潛力</div>
                    <div className="font-bold text-[14px] text-emerald-700">
                      NT${formatNTD(idea.monthlyIncomeMin)}
                      <span className="font-normal text-[12px]">
                        {" "}– {formatNTD(idea.monthlyIncomeMax)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mt-3">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {eligible && (
                  <div className="mt-3 text-[12px] text-apple-gray-500 flex items-center gap-1">
                    <span>{isExpanded ? "▲" : "▼"}</span>
                    <span>{isExpanded ? "收起" : "查看如何開始"}</span>
                  </div>
                )}

                {!eligible && (
                  <div className="mt-3 text-[12px] text-rose-500">
                    ⚠️ 需要 NT${idea.minCost.toLocaleString()} 以上預算
                  </div>
                )}
              </div>

              {/* Expandable Steps */}
              <AnimatePresence>
                {isExpanded && eligible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-purple-50">
                      <p className="text-[13px] text-apple-gray-600 mt-4 mb-3 leading-relaxed">
                        {idea.description}
                      </p>
                      <div className="font-semibold text-[13px] text-apple-gray-700 mb-2">
                        🚀 馬上可以做的 4 步驟：
                      </div>
                      <ol className="space-y-2">
                        {idea.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-[13px] text-apple-gray-700">
                            <span className="bg-violet-100 text-violet-700 rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-[16px] p-4 text-[12px] text-amber-800 leading-relaxed">
        <span className="font-semibold">⚠️ 重要提醒：</span>
        以上收入數字為市場參考範圍，實際結果因個人努力、市場條件與執行力而有差異。創業有風險，建議先以副業形式驗證，再全力投入。
      </div>
    </div>
  );
}
