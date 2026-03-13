"use client";

import { useState } from "react";

interface LegalNavigatorProps {
  elderlyAssets?: number;
  cmsLevel?: number;
}

interface LegalDoc {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  urgency: "high" | "medium" | "low";
  urgencyLabel: string;
  showCondition: (props: LegalNavigatorProps) => boolean;
  steps: { step: string; detail: string }[];
  requiredDocs: string[];
  estimatedTime: string;
  cost: string;
  tip: string;
  officialLink: string;
  officialLinkLabel: string;
}

const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "disability-cert",
    icon: "🏥",
    title: "身心障礙證明申請",
    subtitle: "解鎖更多補助與減免的第一步",
    urgency: "high",
    urgencyLabel: "優先辦理",
    showCondition: () => true,
    steps: [
      { step: "到戶籍地公所領取申請表", detail: "攜帶身分證、一吋照片 3 張、印章" },
      { step: "到指定醫院做身障鑑定", detail: "由醫療團隊依 ICF 架構評估，約需 1-2 小時" },
      { step: "等待鑑定報告與核定", detail: "約 1-3 個月，核定後公所會通知領證" },
      { step: "領取身心障礙證明", detail: "可申請各項補助：停車、牌照稅、健保減免等" },
    ],
    requiredDocs: ["身分證正反面影本", "一吋照片 3 張", "戶口名簿影本", "印章", "診斷證明書（有的話）"],
    estimatedTime: "申請到核定約 1-3 個月",
    cost: "鑑定費約 $200-$600（依醫院而異）",
    tip: "拿到身障證明後，記得回來「隱形省下的錢」模組重新試算，健保減免、牌照稅免徵等都會自動加入！",
    officialLink: "https://www.sfaa.gov.tw/SFAA/Pages/List.aspx?nodeid=162",
    officialLinkLabel: "衛福部身心障礙服務入口",
  },
  {
    id: "advance-directive",
    icon: "📋",
    title: "預立醫療決定 (AD)",
    subtitle: "讓長輩的醫療意願被尊重",
    urgency: "medium",
    urgencyLabel: "建議討論",
    showCondition: () => true,
    steps: [
      { step: "與家人共同討論", detail: "了解長輩對未來醫療處置的意願（插管、電擊、洗腎等）" },
      { step: "到醫院接受「預立醫療照護諮商 (ACP)」", detail: "需至少一位二親等內家屬陪同，由醫療團隊說明各項選擇" },
      { step: "簽署預立醫療決定書", detail: "需經公證人公證或兩位見證人見證" },
      { step: "註記於健保卡", detail: "醫院協助將 AD 登錄於健保 IC 卡，全國醫療院所可查詢" },
    ],
    requiredDocs: ["身分證", "健保卡", "二親等內家屬陪同（至少一人）"],
    estimatedTime: "預約到完成約 2-4 週",
    cost: "ACP 諮商費約 $2,000-$3,500（部分醫院有補助）",
    tip: "AD 不等於放棄治療。它是讓長輩在意識清楚時，預先表達「什麼治療我要、什麼我不要」，避免家屬未來做痛苦決定。",
    officialLink: "https://hpcod.mohw.gov.tw/HospiceWeb/",
    officialLinkLabel: "安寧緩和醫療及器官捐贈意願資訊系統",
  },
  {
    id: "trust-guardianship",
    icon: "🏦",
    title: "財產信託 / 意定監護",
    subtitle: "保護長輩的財產安全",
    urgency: "high",
    urgencyLabel: "越早越好",
    showCondition: (props) => (props.elderlyAssets ?? 0) > 1000000,
    steps: [
      { step: "評估長輩財產狀況", detail: "盤點存款、不動產、保險、投資等資產" },
      { step: "選擇保護方式", detail: "信託：委託銀行管理財產，防詐騙。意定監護：指定未來的監護人" },
      { step: "信託：與銀行簽約", detail: "攜帶長輩本人（需意識清楚）到銀行辦理安養信託" },
      { step: "意定監護：到法院公證", detail: "由長輩本人與受任人共同到法院或公證處簽署" },
    ],
    requiredDocs: ["長輩身分證", "財產相關文件", "受任人/受益人身分證", "醫師診斷證明（證明意識清楚）"],
    estimatedTime: "信託約 1-2 週、意定監護約 2-4 週",
    cost: "信託：簽約費 $1,000-$5,000 + 年管理費 0.3%-0.5%。意定監護：公證費約 $1,000-$3,000",
    tip: "失智症長輩的財產最容易被詐騙或不當挪用。趁長輩還能表達意願時辦理，是最重要的保護。等到嚴重失智後，法律上已無法自行簽署。",
    officialLink: "https://www.trust.org.tw/",
    officialLinkLabel: "信託公會安養信託專區",
  },
];

const URGENCY_STYLES = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200/50", dot: "bg-apple-red" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/50", dot: "bg-apple-orange" },
  low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200/50", dot: "bg-apple-green" },
};

export default function LegalNavigator({ elderlyAssets = 0, cmsLevel }: LegalNavigatorProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const visibleDocs = LEGAL_DOCS.filter((doc) => doc.showCondition({ elderlyAssets, cmsLevel }));

  if (visibleDocs.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[24px]">📜</span>
          <h4 className="text-[16px] font-bold text-apple-gray-900">接下來該辦什麼？</h4>
        </div>
        <p className="text-[13px] text-apple-gray-500 ml-[36px]">
          這些法律文件越早準備越好，別等到來不及
        </p>
      </div>

      <div className="px-6 pb-6 space-y-3 mt-3">
        {visibleDocs.map((doc) => {
          const isExpanded = expandedDoc === doc.id;
          const style = URGENCY_STYLES[doc.urgency];

          return (
            <div key={doc.id} className="rounded-[16px] border border-apple-gray-200/40 overflow-hidden">
              <button
                onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-apple-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">{doc.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-apple-gray-900">{doc.title}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} ${style.border} border`}>
                        {doc.urgencyLabel}
                      </span>
                    </div>
                    <p className="text-[12px] text-apple-gray-500 mt-0.5">{doc.subtitle}</p>
                  </div>
                </div>
                <span className={`text-apple-gray-400 text-[18px] transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}>+</span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-5 space-y-4">
                  {/* 步驟流程 */}
                  <div className="bg-apple-gray-50/80 rounded-[14px] p-4">
                    <h6 className="text-[13px] font-bold text-apple-gray-700 mb-3">辦理流程</h6>
                    <div className="space-y-3">
                      {doc.steps.map((s, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-apple-orange/10 flex items-center justify-center text-[12px] font-bold text-apple-orange flex-shrink-0">
                              {i + 1}
                            </div>
                            {i < doc.steps.length - 1 && (
                              <div className="w-0.5 flex-1 bg-apple-orange/10 mt-1" />
                            )}
                          </div>
                          <div className="pb-2">
                            <p className="text-[14px] font-semibold text-apple-gray-800">{s.step}</p>
                            <p className="text-[12px] text-apple-gray-500 mt-0.5">{s.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 所需文件 */}
                  <div className="bg-blue-50/40 rounded-[14px] p-4">
                    <h6 className="text-[13px] font-bold text-blue-800 mb-2">需要準備的文件</h6>
                    <div className="space-y-1">
                      {doc.requiredDocs.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-[13px] text-blue-700">
                          <span className="text-blue-400">☐</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 時間與費用 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-apple-gray-50/60 rounded-[12px] p-3">
                      <p className="text-[11px] text-apple-gray-500 mb-0.5">預估時間</p>
                      <p className="text-[13px] font-semibold text-apple-gray-800">{doc.estimatedTime}</p>
                    </div>
                    <div className="bg-apple-gray-50/60 rounded-[12px] p-3">
                      <p className="text-[11px] text-apple-gray-500 mb-0.5">費用</p>
                      <p className="text-[13px] font-semibold text-apple-gray-800">{doc.cost}</p>
                    </div>
                  </div>

                  {/* 小提醒 */}
                  <div className="bg-amber-50/60 rounded-[12px] p-3 border border-amber-100/50">
                    <p className="text-[12px] text-amber-800/80 leading-relaxed">
                      💡 {doc.tip}
                    </p>
                  </div>

                  {/* 官方連結 */}
                  <a
                    href={doc.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-[12px] border border-apple-gray-200/60 text-[13px] font-medium text-apple-blue hover:bg-blue-50/30 transition-colors"
                  >
                    🔗 {doc.officialLinkLabel}
                    <span className="text-[11px] text-apple-gray-400">↗</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
