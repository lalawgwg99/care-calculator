"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  items: Array<{ text: string; hint?: string }>;
}

const STAGES: Stage[] = [
  {
    id: "before",
    title: "參觀前：先做功課",
    subtitle: "在家就能查，不必跑現場",
    items: [
      { text: "確認合法立案", hint: "在衛福部長照機構查詢系統或縣市政府網站，查得到這家機構的立案資料" },
      { text: "查最近一次評鑑結果與年度", hint: "評鑑每 3 年一次；先記下它是哪一年評的、結果如何，太舊的參考價值有限" },
      { text: "查近 3 年裁罰紀錄", hint: "縣市政府會公告機構裁罰；搜尋機構全名＋「裁罰」「評鑑」看有無重大違規" },
      { text: "列出長輩的特殊需求", hint: "鼻胃管、尿管、透析接送、失智遊走、需要復健等，先寫下來，參觀時逐項對照機構能不能做" },
      { text: "下載定型化契約範本", hint: "衛福部有住宿式長照機構、護理之家、老人福利機構的契約範本，之後拿來和機構契約逐條比" },
      { text: "安排兩個時段參觀", hint: "平日白天之外，再約一次傍晚或假日——夜間與假日的人力最能看出真實配置" },
    ],
  },
  {
    id: "during",
    title: "參觀中：現場逐項看",
    subtitle: "不要只看展示房，要看住民實際生活的區域",
    items: [
      { text: "聞氣味", hint: "明顯的尿味、霉味代表清潔頻率或通風有問題，是最難造假的指標" },
      { text: "看住民狀態", hint: "衣著是否整潔、指甲頭髮有沒有人整理、住民表情是放鬆還是呆坐" },
      { text: "看照服員怎麼互動", hint: "是否直呼住民名字、語氣如何、回應呼叫鈴的速度；順手按一次呼叫鈴測試" },
      { text: "問白天與夜間人力比", hint: "直接問數字並要求看排班表。老人福利機構（養護型）法定最低為照服員日間 1:8、夜間 1:25；只達最低標準，代表照顧會比較趕" },
      { text: "問護理人員是否 24 小時在院", hint: "夜間住民不適、跌倒時由誰處理？有管路（鼻胃管、尿管）的長輩尤其要確認" },
      { text: "問身體約束政策", hint: "什麼情況會用約束帶？是否需醫師評估與家屬簽同意書、多久重新評估一次？答不出流程的機構要小心" },
      { text: "要求書面收費明細", hint: "月費包含什麼、哪些另計（耗材、管路照護、陪同就醫、洗衣、特殊餐食），逐項確認並帶走書面資料" },
      { text: "看一餐實際餐食", hint: "挑用餐時間去，看菜色份量；問剁碎餐、糊餐、管灌飲食怎麼處理、要不要加價" },
      { text: "問活動與復健安排", hint: "每天有什麼活動？復健一週幾次、誰執行？長期臥床住民的翻身與帶下床頻率" },
      { text: "問感染與緊急事件通知", hint: "流感或新冠群聚時怎麼隔離、多久通知家屬？住民送醫時誰陪同、費用誰付" },
      { text: "問探視與申訴管道", hint: "探視時間是否合理、申訴電話是否公告在明顯處、退住與保證金退還條件" },
    ],
  },
  {
    id: "after",
    title: "參觀後：冷靜再決定",
    subtitle: "不要在現場簽約",
    items: [
      { text: "契約和定型化契約範本逐條比對", hint: "特別看收費、退費、事故責任、終止契約四部分；機構版本少了範本保障條款就問清楚" },
      { text: "確認試住或短住選項", hint: "先短住 1–2 週再決定長期入住，能大幅降低選錯的代價" },
      { text: "把沒問完的問題打電話再問一次", hint: "看機構回應的速度與態度——入住前都這樣，入住後只會更慢" },
      { text: "至少比較 2–3 家", hint: "用同一份清單評比，費用與人力比並排看，差異會很清楚" },
      { text: "開家庭會議確認分工", hint: "誰付費、誰探視、緊急聯絡人是誰，白紙黑字講清楚再簽約" },
    ],
  },
];

const RED_FLAGS = [
  "只帶看展示房，不讓進住民實際生活的樓層",
  "拒絕提供書面收費明細，或口頭價格與契約金額不同",
  "要求一次預繳半年以上費用，或高額保證金卻不寫進契約",
  "多數住民被綁在輪椅或床上，問原因卻說不出約束評估流程",
  "呼叫鈴響了很久沒有人回應，現場工作人員明顯不足",
  "評鑑不合格、逾期未評鑑，或問到評鑑就顧左右而言他",
  "契約出現「家屬不得異議」「任何情況概不退費」等字眼",
  "探視規定異常嚴格（只能預約、常被拒絕、不能進房間）",
];

export default function FacilityVisitChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});

  const toggle = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));
  const toggleFlag = (i: number) => setFlags((p) => ({ ...p, [i]: !p[i] }));

  const total = STAGES.reduce((s, st) => s + st.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const flagCount = Object.values(flags).filter(Boolean).length;

  const summary = useMemo(() => {
    if (done === 0) return null;
    if (flagCount >= 2) return `出現 ${flagCount} 項紅旗警訊。建議先暫停這家，把紅旗項目逐項向機構要求說明，無法交代就換下一家。`;
    if (flagCount === 1) return "出現 1 項紅旗警訊，簽約前務必請機構書面說明，不要口頭帶過。";
    if (pct === 100) return "三個階段都確認完了。把這份清單和契約、收費明細放在一起，和家人討論後再決定。";
    return `已確認 ${done}/${total} 項。還沒確認的項目，就是下一家參觀或打電話追問的清單。`;
  }, [done, total, pct, flagCount]);

  return (
    <div className="space-y-5">
      {/* 進度 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:shadow-none">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold text-[16px] text-apple-gray-900">確認進度 {pct}%</div>
            <div className="text-[12px] text-apple-gray-400 mt-0.5">
              {done} / {total} 項已確認{flagCount > 0 ? `・紅旗警訊 ${flagCount} 項` : ""}
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[13px] px-4 py-2 rounded-full transition-colors print:hidden"
          >
            <Icon name="printer" size={16} />
            列印這份清單
          </button>
        </div>
        <div className="mt-3 h-2 bg-apple-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {summary && (
          <p className={`mt-3 text-[13px] leading-relaxed ${flagCount > 0 ? "text-rose-600" : "text-apple-gray-600"}`}>{summary}</p>
        )}
      </section>

      {/* 三階段 */}
      {STAGES.map((stage) => {
        const stageDone = stage.items.filter((_, i) => checked[`${stage.id}-${i}`]).length;
        return (
          <section key={stage.id} className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:shadow-none">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="font-bold text-[16px] text-apple-gray-900">{stage.title}</h2>
              <span className="text-[12px] text-apple-gray-400 shrink-0">
                {stageDone}/{stage.items.length}
              </span>
            </div>
            <p className="text-[12px] text-apple-gray-400 mb-3">{stage.subtitle}</p>
            <div className="space-y-2.5">
              {stage.items.map((item, i) => {
                const key = `${stage.id}-${i}`;
                return (
                  <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggle(key)}
                      className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0"
                    />
                    <span className="text-[14px] leading-relaxed">
                      <span className={checked[key] ? "line-through text-apple-gray-400" : "text-apple-gray-800 group-hover:text-apple-gray-900"}>
                        {item.text}
                      </span>
                      {item.hint && <span className="block text-[12px] text-apple-gray-400 leading-snug mt-0.5">{item.hint}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* 紅旗 */}
      <section className="bg-rose-50 rounded-[14px] border border-rose-100 p-5 print:shadow-none">
        <h2 className="font-bold text-[16px] text-rose-800 mb-1">紅旗警訊：看到就先打問號</h2>
        <p className="text-[12px] text-rose-600/70 mb-3">參觀時若遇到以下情形，勾起來記錄；出現 2 項以上，建議直接換一家。</p>
        <div className="space-y-2.5">
          {RED_FLAGS.map((f, i) => (
            <label key={i} className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!flags[i]}
                onChange={() => toggleFlag(i)}
                className="mt-0.5 accent-rose-600 w-4 h-4 shrink-0"
              />
              <span className={`text-[14px] leading-relaxed ${flags[i] ? "text-rose-700 font-medium" : "text-apple-gray-700"}`}>
                <span className="mr-1">🔴</span>
                {f}
              </span>
            </label>
          ))}
        </div>
      </section>

      <p className="text-[12px] text-apple-gray-400 leading-relaxed text-center">
        本清單為中立的參觀輔助工具，CarePilot 不推薦、不排名任何特定機構。勾選狀態只存在這個頁面，關閉後不會保留，請列印或截圖存檔。
      </p>
    </div>
  );
}
