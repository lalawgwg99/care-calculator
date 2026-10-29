"use client";

import { useMemo, useState } from "react";

/**
 * 住宿式服務機構使用者補助方案（115 年度／2026 年現制）試算邏輯。
 *
 * 數字依據（查證 2026-10-29）：
 * - 衛福部長照專區「住宿式服務使用者補助方案」（更新 115-10-01）：
 *   115 年起每月最高 15,000 元、每年最高 18 萬元，按月認列、分 2 期撥付；
 *   112 年起每年最高 12 萬元並取消排富規定。
 * - 臺中市政府衛生局「115 年度住宿式服務機構使用者補助方案」申請作業須知
 *   （依據衛部顧字第 1151962241 號函）：中、重度失能者 15,000 元／月，
 *   既有住民 5,000 元／月；補助以實際支付之住宿費用自付額為上限；
 *   當月入住達當月日曆天數二分之一以上認列 1 個月。
 *
 * 誠實邊界：
 * - 本方案自 112 年起取消排富，所得身分（一般／中低／低收）不影響本方案金額，
 *   因此所得身分只做說明分支，不進算式；(中)低收入戶另有縣市「失能老人
 *   機構公費安置費補助」，金額依各縣市規定，本頁不硬算，導向戶籍地區公所。
 * - 身心障礙者住宿費用加碼補助（5,000 元／月）同一月份不得與本方案重複領取，
 *   故只作提醒，不併入總額。
 */

export type InstitutionType =
  | "nursing"
  | "psychiatric"
  | "elderly"
  | "disability"
  | "veterans"
  | "ltc"
  | "other";

export type QualifyType = "cms4" | "disability" | "existing" | "none";

export type IncomeType = "general" | "midlow" | "low";

export interface SubsidyInput {
  institution: InstitutionType;
  qualify: QualifyType;
  monthlyFee: number;
  months: number;
  transition: boolean;
}

export interface SubsidyResult {
  eligible: boolean;
  ineligibleReason: string | null;
  monthlySubsidy: number;
  annualSubsidy: number;
  monthlyGap: number;
  annualGap: number;
  annualCap: number;
  selfPayTotal: number;
}

export const MONTHLY_SEVERE = 15000;
export const MONTHLY_EXISTING = 5000;
export const ANNUAL_CAP_SEVERE = 180000;
export const ANNUAL_CAP_EXISTING = 60000;
export const TRANSITION_GUARANTEE = 120000;

export function calcInstitutionSubsidy(input: SubsidyInput): SubsidyResult {
  const fee = Math.max(0, Math.floor(Number(input.monthlyFee) || 0));
  const months = Math.min(12, Math.max(0, Math.floor(Number(input.months) || 0)));
  const selfPayTotal = fee * months;

  if (input.institution === "other") {
    return {
      eligible: false,
      ineligibleReason:
        "你選的機構類型不在 115 年度方案列出的指定機構範圍內（例如安養床）。本方案只補助入住指定 7 類機構的住民，請先確認機構類型，或洽 1966 詢問。",
      monthlySubsidy: 0,
      annualSubsidy: 0,
      monthlyGap: fee,
      annualGap: selfPayTotal,
      annualCap: 0,
      selfPayTotal,
    };
  }

  if (input.qualify === "none") {
    return {
      eligible: false,
      ineligibleReason:
        "三類資格都不符合：未達 CMS 第 4 級、未持有中度以上身心障礙證明，也不是 112 年 1 月 1 日前已入住的既有住民。本方案無法補助，建議先撥 1966 做長照需要評估。",
      monthlySubsidy: 0,
      annualSubsidy: 0,
      monthlyGap: fee,
      annualGap: selfPayTotal,
      annualCap: 0,
      selfPayTotal,
    };
  }

  const monthlySubsidy =
    input.qualify === "existing" ? MONTHLY_EXISTING : MONTHLY_SEVERE;
  const annualCap =
    input.qualify === "existing" ? ANNUAL_CAP_EXISTING : ANNUAL_CAP_SEVERE;

  let annualSubsidy: number;
  if (input.transition && input.qualify !== "existing") {
    // 115 年度過渡保障：114 年度曾核定 12 萬元、且 115 年 1–8 月期間實際入住
    // 累計達 180 日者，該期間補助保障核給 12 萬元；9 月起按月認列。
    annualSubsidy = Math.min(
      TRANSITION_GUARANTEE + Math.max(0, months - 8) * MONTHLY_SEVERE,
      annualCap,
      selfPayTotal
    );
  } else {
    annualSubsidy = Math.min(monthlySubsidy * months, annualCap, selfPayTotal);
  }

  return {
    eligible: true,
    ineligibleReason: null,
    monthlySubsidy,
    annualSubsidy,
    monthlyGap: Math.max(0, fee - monthlySubsidy),
    annualGap: selfPayTotal - annualSubsidy,
    annualCap,
    selfPayTotal,
  };
}

const INSTITUTIONS: { value: InstitutionType; label: string }[] = [
  { value: "nursing", label: "一般護理之家" },
  { value: "psychiatric", label: "精神護理之家" },
  { value: "elderly", label: "老人福利機構（除安養床外）" },
  { value: "disability", label: "身心障礙福利機構" },
  { value: "veterans", label: "榮譽國民之家（自費養護床）" },
  { value: "ltc", label: "住宿式長照機構" },
  { value: "other", label: "其他（安養床等未列入類型）" },
];

const QUALIFIES: { value: QualifyType; label: string; hint: string }[] = [
  { value: "cms4", label: "CMS 第 4 級以上", hint: "經照管中心評估達長照需要等級 4 級以上" },
  { value: "disability", label: "身障證明中度以上", hint: "持有中度以上身心障礙證明" },
  { value: "existing", label: "既有住民", hint: "112 年 1 月 1 日前已入住，且未達 4 級" },
  { value: "none", label: "以上皆非", hint: "未評估、未達 4 級、也無身障證明" },
];

const INCOMES: { value: IncomeType; label: string }[] = [
  { value: "general", label: "一般戶" },
  { value: "midlow", label: "中低收入戶" },
  { value: "low", label: "低收入戶" },
];

const fmt = (n: number) => `NT$${n.toLocaleString()}`;

export default function InstitutionSubsidyCalculator() {
  const [institution, setInstitution] = useState<InstitutionType>("nursing");
  const [qualify, setQualify] = useState<QualifyType>("cms4");
  const [income, setIncome] = useState<IncomeType>("general");
  const [feeText, setFeeText] = useState("45000");
  const [monthsText, setMonthsText] = useState("12");
  const [transition, setTransition] = useState(false);

  const result = useMemo(
    () =>
      calcInstitutionSubsidy({
        institution,
        qualify,
        monthlyFee: Number(feeText) || 0,
        months: Number(monthsText) || 0,
        transition: transition && qualify !== "existing",
      }),
    [institution, qualify, feeText, monthsText, transition]
  );

  const monthsNum = Math.min(12, Math.max(0, Math.floor(Number(monthsText) || 0)));
  const feeNum = Math.max(0, Math.floor(Number(feeText) || 0));

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">1. 入住機構類型（115 年度方案指定範圍）</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {INSTITUTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setInstitution(item.value)}
              className={`text-left rounded-[12px] border px-4 py-3 text-[14px] transition-colors ${
                institution === item.value
                  ? "border-teal-600 bg-teal-50 font-semibold text-teal-900"
                  : "border-apple-gray-200/80 hover:border-apple-gray-400 text-apple-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">2. 住民資格（擇一）</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {QUALIFIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setQualify(item.value)}
              className={`text-left rounded-[12px] border px-4 py-3 transition-colors ${
                qualify === item.value
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-apple-gray-200/80 hover:border-apple-gray-400 text-apple-gray-700"
              }`}
            >
              <div className="text-[14px] font-semibold">{item.label}</div>
              <div className="text-[12px] text-apple-gray-500 mt-0.5">{item.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">3. 所得身分（不影響本方案金額，請誠實點選看提醒）</h2>
        <div className="flex flex-wrap gap-2">
          {INCOMES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setIncome(item.value)}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
                income === item.value
                  ? "border-teal-600 bg-teal-50 font-semibold text-teal-900"
                  : "border-apple-gray-200/80 hover:border-apple-gray-400 text-apple-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-apple-gray-600 leading-relaxed mt-3">
          本方案自 112 年起<strong className="text-apple-gray-900">取消排富規定</strong>，一般戶與中低、低收入戶在本方案的補助金額相同。
          {income !== "general" && (
            <>
              {" "}提醒：若你已領取「失能老人機構公費安置費補助」，同一月份不得與本方案重複領取，須擇一；縣市安置補助的金額依各縣市規定，請洽戶籍地區公所，本頁不另試算。
            </>
          )}
        </p>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">4. 費用與月數</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-apple-gray-700">
              機構月費（每月實際自付住宿費，元）
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={feeText}
              onChange={(e) => setFeeText(e.target.value)}
              className="mt-1.5 w-full rounded-[10px] border border-apple-gray-200/80 px-3 py-2.5 text-[15px] outline-none focus:border-teal-600"
            />
            <span className="text-[12px] text-apple-gray-400">
              預設 45,000 元為本站整理之平均參考值，請依契約上的自付金額修改。補助以實際自付額為上限，月費低於補助時只補到月費。
            </span>
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-apple-gray-700">
              認列月數（0–12 個月）
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={12}
              value={monthsText}
              onChange={(e) => setMonthsText(e.target.value)}
              className="mt-1.5 w-full rounded-[10px] border border-apple-gray-200/80 px-3 py-2.5 text-[15px] outline-none focus:border-teal-600"
            />
            <span className="text-[12px] text-apple-gray-400">
              按月認列：當月入住達當月日曆天數二分之一以上認列 1 個月，未滿不認列；住院保留床位原則視為持續入住，但當月住院達二分之一以上者該月不列入。
            </span>
          </label>
        </div>
        {qualify !== "existing" && (
          <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={transition}
              onChange={(e) => setTransition(e.target.checked)}
              className="mt-1 h-4 w-4 accent-teal-700"
            />
            <span className="text-[13px] text-apple-gray-600 leading-relaxed">
              <strong className="text-apple-gray-900">符合 115 年度過渡保障：</strong>
              114 年度曾核定領取 12 萬元，且 115 年 1–8 月期間實際入住累計達 180 日。
              勾選後，1–8 月期間補助保障 12 萬元，9 月起按月認列（全年仍以 18 萬元為上限）。
            </span>
          </label>
        )}
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">試算結果（115 年度現制）</h2>
        {!result.eligible ? (
          <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 text-[14px] text-amber-900 leading-relaxed">
            <strong>目前條件不符合本方案補助。</strong>
            <p className="mt-1">{result.ineligibleReason}</p>
            <p className="mt-2">
              全年自付總額：{fmt(result.selfPayTotal)}（月費 {fmt(feeNum)} × {monthsNum} 個月），補助 0 元。
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-teal-50 rounded-[12px] p-4">
                <div className="text-[13px] text-teal-800">每年補助金額（上限內）</div>
                <div className="text-[28px] font-bold text-teal-900 font-mono mt-1">
                  {fmt(result.annualSubsidy)}
                </div>
                <div className="text-[12px] text-teal-700 mt-1">
                  每月補助 {fmt(result.monthlySubsidy)} × {monthsNum} 個月，全年上限 {fmt(result.annualCap)}，並以實際自付總額 {fmt(result.selfPayTotal)} 為上限
                </div>
              </div>
              <div className="bg-red-50 rounded-[12px] p-4">
                <div className="text-[13px] text-red-800">每月實付缺口（月費 − 月補助）</div>
                <div className="text-[28px] font-bold text-red-900 font-mono mt-1">
                  {fmt(result.monthlyGap)}
                </div>
                <div className="text-[12px] text-red-700 mt-1">
                  全年實付缺口 {fmt(result.annualGap)}（自付總額 {fmt(result.selfPayTotal)} − 補助 {fmt(result.annualSubsidy)}）
                </div>
              </div>
            </div>
            {transition && qualify !== "existing" && (
              <p className="text-[13px] text-apple-gray-600 leading-relaxed mt-3">
                已套用 115 年度過渡保障：1–8 月期間保障 {fmt(TRANSITION_GUARANTEE)}，9 月起按月認列；全年仍以 {fmt(ANNUAL_CAP_SEVERE)} 為上限，並以實際自付總額為上限。
              </p>
            )}
            <p className="text-[13px] text-apple-gray-600 leading-relaxed mt-3">
              提醒：身心障礙者若已依身障辦法領有住宿式照顧費用補助，另可申請每月 5,000 元加碼補助，但同一月份不得與本方案重複領取（擇一），因此加碼金額不併入本試算總額。
            </p>
          </>
        )}
      </section>
    </div>
  );
}
