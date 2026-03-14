"use client";

import { useState } from "react";

interface LegalItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  steps: string[];
  checklist: string[];
  note: string;
}

const LEGAL_ITEMS: LegalItem[] = [
  {
    id: "guardianship",
    icon: "🏛️",
    title: "監護宣告",
    subtitle: "保護失能長輩的法律權益",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-100",
    steps: [
      "向地方法院家事庭提出聲請（配偶、四親等內親屬均可聲請）",
      "法院指定鑑定醫院，由精神科醫師評估心智狀態",
      "法院裁定，通常 2~6 個月審理完畢",
      "裁定確定後，監護人可代理長輩進行法律行為",
    ],
    checklist: [
      "準備戶籍謄本（三個月內）",
      "備妥診斷書（內科或神經科）",
      "填寫聲請狀（法院有範本）",
      "繳納聲請費約 1,000 元",
      "參與法院詢問程序",
    ],
    note: "監護宣告後，監護人每年須向法院報告財產狀況，不可任意動用長輩財產。",
  },
  {
    id: "trust",
    icon: "🏦",
    title: "安養信託",
    subtitle: "確保照顧費用安全且專款專用",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-100",
    steps: [
      "選擇信託銀行（各大行庫均有長照信託服務）",
      "與銀行信託部門簽訂信託契約",
      "將指定財產（存款、不動產）移交信託管理",
      "銀行依契約按月撥款支付照顧費用",
    ],
    checklist: [
      "確認可信託財產項目與金額",
      "決定信託受益人（通常為本人）",
      "指定信託監察人（子女或律師）",
      "了解信託管理費（約每年 0.3~0.5%）",
      "與家人討論信託條件與變更機制",
    ],
    note: "安養信託可搭配「意定監護」，在長輩仍有行為能力時預先規劃，比法院指定更有彈性。",
  },
  {
    id: "will",
    icon: "📜",
    title: "遺囑規劃",
    subtitle: "預先安排財產與照顧意願",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-100",
    steps: [
      "確認遺囑形式：自書遺囑（本人手寫）或公證遺囑（至公證處辦理）",
      "列明財產清單與分配方式，注意特留分規定",
      "指定遺囑執行人（建議為律師或信任的家人）",
      "妥善保管並告知可信任的人遺囑存放地點",
    ],
    checklist: [
      "自書遺囑：全文親筆書寫、簽名、日期",
      "公證遺囑：攜帶身份證，至法院或民間公證人辦理",
      "確認不動產、金融資產均納入遺囑",
      "考慮是否指定安葬方式",
      "每 3~5 年或重大事件後重新確認內容",
    ],
    note: "子女有「特留分」保障（應繼分的 1/2），遺囑不可低於此比例，否則子女可主張扣還。",
  },
  {
    id: "assets",
    icon: "💰",
    title: "財產管理",
    subtitle: "整理並保障長輩名下財產",
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-100",
    steps: [
      "盤點長輩名下不動產（地政事務所查詢）、存款、股票等資產",
      "申請財產清查（向戶政事務所申請財產歸戶清單）",
      "與家人達成共識，建立透明管理機制",
      "必要時委任律師或信託機構協助管理",
    ],
    checklist: [
      "整理不動產權狀與租賃合約",
      "列出所有金融帳戶（銀行、郵局、證券）",
      "確認保險契約（受益人、保單內容）",
      "取得長輩同意後辦理財產代管或授權書",
      "保存所有文件於安全地點並備份",
    ],
    note: "若長輩仍有行為能力，建議以「授權書」（特別授權或一般授權）方式處理，不需進行監護宣告。",
  },
];

export default function LegalNavigator() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));
  const toggleCheck = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5 border-b border-indigo-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">⚖️</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">法律事項引導</h2>
            <p className="text-[13px] text-indigo-800/60 mt-0.5">為長輩的未來做好法律準備</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {LEGAL_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          const checkedCount = item.checklist.filter((_, i) => checked[`${item.id}-${i}`]).length;

          return (
            <div key={item.id} className={`border rounded-[20px] overflow-hidden transition-all ${item.bgColor}`}>
              {/* Header */}
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[24px]">{item.icon}</span>
                  <div>
                    <div className={`font-bold text-[15px] ${item.color}`}>{item.title}</div>
                    <div className="text-[12px] text-apple-gray-500">{item.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {checkedCount > 0 && (
                    <span className="text-[12px] bg-white/80 px-2 py-0.5 rounded-full text-apple-gray-600 font-medium">
                      {checkedCount}/{item.checklist.length}
                    </span>
                  )}
                  <span className="text-[18px] text-apple-gray-400">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Steps */}
                  <div>
                    <div className="text-[13px] font-semibold text-apple-gray-600 mb-2">📌 辦理流程</div>
                    <ol className="space-y-2">
                      {item.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-[13px] text-apple-gray-700">
                          <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white mt-0.5 ${item.color.replace("text-", "bg-")}`}>
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="text-[13px] font-semibold text-apple-gray-600 mb-2">✅ 準備清單</div>
                    <div className="space-y-2">
                      {item.checklist.map((c, i) => {
                        const key = `${item.id}-${i}`;
                        return (
                          <label key={i} className="flex items-start gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={!!checked[key]}
                              onChange={() => toggleCheck(key)}
                              className="mt-0.5 accent-indigo-500 w-4 h-4 shrink-0"
                            />
                            <span className={`text-[13px] transition-colors ${checked[key] ? "line-through text-apple-gray-400" : "text-apple-gray-700"}`}>
                              {c}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-white/70 rounded-[12px] p-3 border border-white">
                    <p className="text-[12px] text-apple-gray-500 leading-relaxed">
                      💡 <strong>注意：</strong>{item.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
