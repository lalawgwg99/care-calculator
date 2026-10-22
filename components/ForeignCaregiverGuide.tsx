"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import {
  FOREIGN_CAREGIVER_2026,
  FOREIGN_CAREGIVER_ESTIMATES,
  caregiverOvertimeDailyWage,
} from "@/lib/policyData";

const fmt = (n: number) => Math.round(n).toLocaleString("zh-TW");

type AgeBand = "80+" | "70-79" | "under70";
type CancerStage = "none" | "stage2" | "stage4";

const BARTHTEL_TEXT: Record<AgeBand, string> = {
  "80+": "80–84 歲：巴氏量表 60 分以下；85 歲以上：未滿 100 分（輕度依賴）即可。",
  "70-79": "未滿 80 歲：巴氏量表 35 分以下，或經醫療團隊判定有全日照護需求。",
  under70: "未滿 80 歲：巴氏量表 35 分以下，或經醫療團隊判定有全日照護需求。",
};

export default function ForeignCaregiverGuide() {
  // ===== 資格自測 =====
  const [ageBand, setAgeBand] = useState<AgeBand>("80+");
  const [cancer, setCancer] = useState<CancerStage>("none");
  const [otherExempt, setOtherExempt] = useState(false);

  const eligibility = useMemo(() => {
    if (ageBand === "80+") {
      return {
        kind: "exempt" as const,
        title: "免評：年齡符合 2025 年新制",
        body: "被看護者年滿 80 歲，依就業服務法第 46 條修正（2025 年 8 月 1 日施行），免經醫療機構專業評估（免巴氏量表）。仍須完成國內求才並取得勞動部招募許可；新制採「輕重分流、重症優先」，一般案件依案量依序處理，等待時間可能比重症案件長。",
      };
    }
    if (cancer === "stage4") {
      return {
        kind: "exempt" as const,
        title: "免評：重症擴大免評對象",
        body: "癌症第 4 期以上（不分年齡）屬勞動部擴大的重症免評對象，可用 1 年內有效的現有證明申請，不必重新做巴氏量表評估，且案件優先處理。",
      };
    }
    if (ageBand === "70-79" && cancer === "stage2") {
      return {
        kind: "exempt" as const,
        title: "免評：70–79 歲癌症二期以上",
        body: "被看護者 70 歲至 79 歲且罹患癌症二期以上，依 2025 年 8 月 1 日新制免經醫療機構專業評估。申請時檢附癌症診斷證明，再完成國內求才與招募許可即可。",
      };
    }
    if (otherExempt) {
      return {
        kind: "exempt" as const,
        title: "免評：符合其他免評情形",
        body: "全癱無法自行下床、過去 1 年內曾聘僱外籍看護或中階技術看護、領有公告類別的特定身心障礙證明，或已連續使用長照照顧服務 6 個月以上（經評估 CMS 2 級以上），都可免赴醫院做巴氏量表評估，改以現有證明申請。實際認定以勞動力發展署與各縣市照管中心為準。",
      };
    }
    return {
      kind: "barthel" as const,
      title: "需要巴氏量表評估",
      body: `依目前答案，不符合免評條件，需到醫院由醫療團隊開立「病症暨失能診斷證明書」。通過門檻：${BARTHTEL_TEXT[ageBand]}評估後向照管中心辦理國內推介，再向勞動部申請招募許可。`,
    };
  }, [ageBand, cancer, otherExempt]);

  // ===== 費用試算 =====
  const [monthlyWage, setMonthlyWage] = useState<number>(FOREIGN_CAREGIVER_2026.contractMonthlyWage);
  const [overtimeDays, setOvertimeDays] = useState(4);
  const [agencyIntroFee, setAgencyIntroFee] = useState(20000);
  const [useAgency, setUseAgency] = useState(true);

  const overtimeDaily = caregiverOvertimeDailyWage(monthlyWage);
  const overtimePay = overtimeDaily * overtimeDays;
  const agencyServiceMonthly = useAgency ? FOREIGN_CAREGIVER_ESTIMATES.agencyServiceFeeYearlyCap / 12 : 0;
  const accidentMonthly = FOREIGN_CAREGIVER_ESTIMATES.accidentInsuranceYearly / 12;

  const monthlyTotal =
    monthlyWage +
    overtimePay +
    FOREIGN_CAREGIVER_2026.employmentStabilityFee +
    FOREIGN_CAREGIVER_2026.employerNhiEstimate +
    FOREIGN_CAREGIVER_ESTIMATES.occupationalInsuranceMonthly +
    accidentMonthly +
    agencyServiceMonthly;

  const firstYearTotal = monthlyTotal * 12 + (useAgency ? agencyIntroFee : 0);

  const costRows: Array<{ label: string; value: number; note: string }> = [
    { label: "月薪（勞動契約）", value: monthlyWage, note: "家事移工月薪自 2022 年 8 月 10 日起為 $20,000，可自行依契約修改" },
    { label: `加班費（${overtimeDays} 天 × $${fmt(overtimeDaily)}）`, value: overtimePay, note: "每 7 日休 1 日為契約常見約定；休假日出勤以月薪 ÷ 30 計，或改給補休" },
    { label: "就業安定費", value: FOREIGN_CAREGIVER_2026.employmentStabilityFee, note: "家庭看護工雇主每月 $2,000，勞動部按季寄發繳款單" },
    { label: "健保費（雇主負擔）", value: FOREIGN_CAREGIVER_2026.employerNhiEstimate, note: "115 年投保金額 $29,500 級距估算，移工自付 $458 另由其薪資負擔" },
    { label: "職災保險費（估算）", value: FOREIGN_CAREGIVER_ESTIMATES.occupationalInsuranceMonthly, note: "雇主依法須投保，費率 0.18%，約 $56/月，以勞保局繳費單為準" },
    { label: "意外險（月攤）", value: accidentMonthly, note: "勞動契約要求投保 30 萬元以上意外險，年費約 $355–$495，預設以 $400/年估算" },
    { label: "仲介服務費（月攤）", value: agencyServiceMonthly, note: useAgency ? "法定上限每年 $2,000，不得預收；自行直聘則無此項" : "自行透過直接聘僱聯合服務中心辦理，無仲介服務費" },
  ];

  return (
    <div className="space-y-5">
      {/* 資格自測 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">一、資格自測：能不能申請？</h2>
        <p className="text-[13px] text-apple-gray-500 mb-4 leading-relaxed">
          申請的是「外籍家庭看護工」，審查對象是被看護者。雇主須為配偶、直系血親、三親等內旁系血親或一親等姻親等法定親屬。
        </p>
        <div className="space-y-4">
          <div>
            <div className="text-[13px] text-apple-gray-600 mb-2">被看護者年齡</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { v: "80+", t: "80 歲以上" },
                  { v: "70-79", t: "70–79 歲" },
                  { v: "under70", t: "未滿 70 歲" },
                ] as Array<{ v: AgeBand; t: string }>
              ).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setAgeBand(o.v)}
                  className={`py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    ageBand === o.v ? "bg-teal-600 text-white" : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[13px] text-apple-gray-600 mb-2">被看護者是否罹患癌症？</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { v: "none", t: "無" },
                  { v: "stage2", t: "二期或三期" },
                  { v: "stage4", t: "四期以上" },
                ] as Array<{ v: CancerStage; t: string }>
              ).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setCancer(o.v)}
                  className={`py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    cancer === o.v ? "bg-teal-600 text-white" : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-2.5 bg-apple-gray-50 rounded-lg px-3 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={otherExempt}
              onChange={(e) => setOtherExempt(e.target.checked)}
              className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0"
            />
            <span className="text-[13px] text-apple-gray-700 leading-snug">
              有以下任一情形：全癱無法自行下床／過去 1 年曾聘僱看護或中階技術看護／領有特定身心障礙證明／已連續使用長照照顧服務 6 個月以上
            </span>
          </label>
        </div>
        <div
          className={`mt-4 rounded-[12px] border p-4 ${
            eligibility.kind === "exempt" ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
          }`}
        >
          <div className={`font-bold text-[15px] mb-1 ${eligibility.kind === "exempt" ? "text-emerald-800" : "text-amber-800"}`}>
            {eligibility.title}
          </div>
          <p className="text-[13px] text-apple-gray-600 leading-relaxed">{eligibility.body}</p>
          <p className="mt-2 text-[12px] text-apple-gray-400">自測結果僅供初步判斷，資格認定以勞動部勞動力發展署公告與審查為準。</p>
        </div>
      </section>

      {/* 費用試算 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">二、費用試算：雇主每月要付多少？</h2>
        <p className="text-[13px] text-apple-gray-500 mb-4 leading-relaxed">
          不含食宿（雇主須提供）。勞動部 114 年移工管理及運用調查：家庭看護工平均月薪約 $21,300、加班費平均約 $2,800，可作市場對照。
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">月薪</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-apple-gray-400 text-[13px]">$</span>
              <input
                type="number"
                min={0}
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">每月加班天數（休假日出勤）</span>
            <select
              value={overtimeDays}
              onChange={(e) => setOvertimeDays(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} 天{d === 4 ? "（休假全月未休，常見情形）" : d === 0 ? "（休假都有休）" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2.5 bg-apple-gray-50 rounded-lg px-3 py-2.5 cursor-pointer self-end">
            <input
              type="checkbox"
              checked={useAgency}
              onChange={(e) => setUseAgency(e.target.checked)}
              className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0"
            />
            <span className="text-[13px] text-apple-gray-700 leading-snug">委託仲介辦理（自行直聘可取消勾選）</span>
          </label>
        </div>

        <div className="divide-y divide-apple-gray-100">
          {costRows.map((r) => (
            <div key={r.label} className="py-2 flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[14px] text-apple-gray-700">{r.label}</div>
                <div className="text-[12px] text-apple-gray-400 leading-snug">{r.note}</div>
              </div>
              <div className="text-[15px] font-medium text-apple-gray-900 tabular-nums shrink-0">${fmt(r.value)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-[12px] bg-teal-50 border border-teal-100 p-4 text-center">
            <div className="text-[12px] text-teal-700 font-semibold">每月固定支出</div>
            <div className="text-[26px] font-bold text-teal-800 tabular-nums">${fmt(monthlyTotal)}</div>
          </div>
          <div className="rounded-[12px] bg-apple-gray-50 border border-apple-gray-200 p-4 text-center">
            <div className="text-[12px] text-apple-gray-500 font-semibold">第一年總成本（含一次性仲介費）</div>
            <div className="text-[26px] font-bold text-apple-gray-900 tabular-nums">${fmt(firstYearTotal)}</div>
            {useAgency && (
              <div className="mt-1 text-[12px] text-apple-gray-400 flex items-center justify-center gap-1 flex-wrap">
                一次性登記費＋介紹費
                <div className="flex items-center gap-1">
                  <span>$</span>
                  <input
                    type="number"
                    min={0}
                    value={agencyIntroFee}
                    onChange={(e) => setAgencyIntroFee(Number(e.target.value) || 0)}
                    className="w-24 rounded-md border border-apple-gray-200 px-2 py-1 text-[13px] text-apple-gray-900"
                  />
                </div>
                （法定上限為第一個月薪資 ${fmt(monthlyWage)}）
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-[12px] text-apple-gray-400 leading-relaxed flex gap-1.5">
          <Icon name="alert" size={14} />
          <span>
            移工自己負擔的仲介服務費（第 1 年每月上限 $1,800、第 2 年 $1,700、第 3 年起 $1,500）由移工依其與仲介的契約給付，
            雇主不得代扣、也不得出錢代付再從薪資扣回。仲介向雇主或移工超收，可撥 1955 檢舉。
          </span>
        </p>
      </section>
    </div>
  );
}
