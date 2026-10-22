"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import {
  calculateCareBudget,
  getCMSLevelName,
  getIncomeStatusName,
  type CMSLevel,
  type IncomeStatus,
} from "@/lib/careLogic";
import { POLICY_VERSION, TRANSPORT_REGIONS, type TransportRegion } from "@/lib/policyData";

const fmt = (n: number) => Math.round(n).toLocaleString("zh-TW");

function MoneyInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] text-apple-gray-600">{label}</span>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-apple-gray-400 text-[13px]">$</span>
        <input
          type="number"
          min={0}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
        <span className="text-apple-gray-400 text-[13px] shrink-0">/月</span>
      </div>
      {hint && <span className="block mt-1 text-[12px] text-apple-gray-400 leading-snug">{hint}</span>}
    </label>
  );
}

function LineItem({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <div>
        <div className="text-[14px] text-apple-gray-700">{label}</div>
        {sub && <div className="text-[12px] text-apple-gray-400">{sub}</div>}
      </div>
      <div className="text-[15px] font-medium text-apple-gray-900 tabular-nums shrink-0">${fmt(value)}</div>
    </div>
  );
}

export default function HomeVsInstitutionCompare() {
  const [cmsLevel, setCmsLevel] = useState<CMSLevel>(5);
  const [incomeStatus, setIncomeStatus] = useState<IncomeStatus>("general");
  const [transportRegion, setTransportRegion] = useState<TransportRegion>("region1");
  const [hasDisabilityCert, setHasDisabilityCert] = useState(false);
  const [isExistingResident, setIsExistingResident] = useState(false);

  // 在宅可編輯成本
  const [homeConsumables, setHomeConsumables] = useState(3000);
  const [leaveDays, setLeaveDays] = useState(0);
  const [dailyWage, setDailyWage] = useState(1500);
  const [homeOther, setHomeOther] = useState(0);

  // 機構可編輯成本
  const [facilityFee, setFacilityFee] = useState(45000);
  const [facilityExtras, setFacilityExtras] = useState(2000);

  const home = useMemo(
    () => calculateCareBudget(cmsLevel, incomeStatus, "home-care", { transportRegion }),
    [cmsLevel, incomeStatus, transportRegion]
  );
  const institution = useMemo(
    () =>
      calculateCareBudget(cmsLevel, incomeStatus, "institution", {
        isExistingResident,
        hasModerateDisabilityCert: hasDisabilityCert,
      }),
    [cmsLevel, incomeStatus, isExistingResident, hasDisabilityCert]
  );

  const leaveCost = leaveDays * dailyWage;
  const homeTotal = home.outOfPocketMonthly + homeConsumables + leaveCost + homeOther;

  const subsidyApplied = Math.min(institution.totalSubsidyMonthly, facilityFee);
  const facilityNetFee = Math.max(0, facilityFee - subsidyApplied);
  const facilityTotal = facilityNetFee + facilityExtras;

  const diff = homeTotal - facilityTotal; // >0 表示在宅較貴
  const cheaperLabel = diff > 0 ? "機構每月較省" : diff < 0 ? "在宅每月較省" : "兩邊相同";

  return (
    <div className="space-y-5">
      {/* 共通設定 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">先選長輩的狀況</h2>
        <div className="space-y-4">
          <div>
            <div className="text-[13px] text-apple-gray-600 mb-2">
              失能等級（CMS）：{cmsLevel} 級・{getCMSLevelName(cmsLevel)}
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {([1, 2, 3, 4, 5, 6, 7, 8] as CMSLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setCmsLevel(lv)}
                  className={`py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    cmsLevel === lv
                      ? "bg-teal-600 text-white"
                      : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-apple-gray-400">
              還不知道等級？先用首頁主試算估算，或撥 1966 由照管中心評估。
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[13px] text-apple-gray-600">身份別（影響部分負擔）</span>
              <select
                value={incomeStatus}
                onChange={(e) => setIncomeStatus(e.target.value as IncomeStatus)}
                className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              >
                <option value="general">一般戶</option>
                <option value="mid-low">中低收入戶</option>
                <option value="low">低收入戶</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[13px] text-apple-gray-600">交通接送分區（影響在宅交通部分負擔）</span>
              <select
                value={transportRegion}
                onChange={(e) => setTransportRegion(e.target.value as TransportRegion)}
                className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              >
                {(Object.keys(TRANSPORT_REGIONS) as TransportRegion[]).map((r) => (
                  <option key={r} value={r}>
                    {TRANSPORT_REGIONS[r].label}（每月額度 ${fmt(TRANSPORT_REGIONS[r].monthlyQuota)}）
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <label className="flex items-start gap-2.5 bg-apple-gray-50 rounded-lg px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDisabilityCert}
                onChange={(e) => setHasDisabilityCert(e.target.checked)}
                className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0"
              />
              <span className="text-[13px] text-apple-gray-700 leading-snug">
                領有中度以上身心障礙證明
                <span className="block text-[12px] text-apple-gray-400">未達 CMS 4 級也可取得住宿補助資格</span>
              </span>
            </label>
            <label className="flex items-start gap-2.5 bg-apple-gray-50 rounded-lg px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isExistingResident}
                onChange={(e) => setIsExistingResident(e.target.checked)}
                className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0"
              />
              <span className="text-[13px] text-apple-gray-700 leading-snug">
                2023 年 1 月 1 日前已入住機構的既有住民
                <span className="block text-[12px] text-apple-gray-400">未達 CMS 4 級者每月補助 $5,000</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 對照 */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        {/* 在宅 */}
        <section className="bg-white rounded-[14px] shadow-apple border border-teal-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4 border-b border-teal-100/60 flex items-center gap-3">
            <Icon name="home" size={24} />
            <div>
              <h2 className="font-bold text-[17px] text-apple-gray-900">住在家裡（在宅）</h2>
              <p className="text-[12px] text-apple-gray-500">長照服務用到核定額度時的每月自付</p>
            </div>
          </div>
          <div className="p-5">
            <div className="divide-y divide-apple-gray-100">
              <LineItem
                label="長照服務部分負擔"
                value={home.outOfPocketMonthly}
                sub={`照顧＋交通＋喘息三包，政府另補助 $${fmt(home.totalSubsidyMonthly)}/月`}
              />
            </div>
            <div className="space-y-3 mt-3">
              <MoneyInput
                label="耗材費（尿布、看護墊、濕紙巾等）"
                value={homeConsumables}
                onChange={setHomeConsumables}
                hint="無官方標準金額，預設 $3,000 為常見估算，請依實際用量修改"
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[13px] text-apple-gray-600">家人每月請假天數</span>
                  <input
                    type="number"
                    min={0}
                    max={31}
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] text-apple-gray-600">請假一天的薪資損失</span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-apple-gray-400 text-[13px]">$</span>
                    <input
                      type="number"
                      min={0}
                      value={dailyWage}
                      onChange={(e) => setDailyWage(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    />
                  </div>
                </label>
              </div>
              <LineItem label="家人請假成本" value={leaveCost} sub="陪同就醫、照顧空窗、臨時狀況的隱形成本" />
              <MoneyInput label="其他自費（自費居服、送餐等）" value={homeOther} onChange={setHomeOther} />
            </div>
            <div className="mt-4 pt-4 border-t-2 border-teal-100 flex items-baseline justify-between">
              <span className="font-bold text-[15px] text-apple-gray-900">在宅每月總自付</span>
              <span className="text-[26px] font-bold text-teal-700 tabular-nums">${fmt(homeTotal)}</span>
            </div>
            {home.assistiveDeviceQuota > 0 && (
              <p className="mt-2 text-[12px] text-apple-gray-400 leading-snug">
                另有輔具及居家無障礙額度 ${fmt(home.assistiveDeviceQuota)}（每 3 年，非每月，不併入上表）。
              </p>
            )}
          </div>
        </section>

        {/* 機構 */}
        <section className="bg-white rounded-[14px] shadow-apple border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-4 border-b border-indigo-100/60 flex items-center gap-3">
            <Icon name="building" size={24} />
            <div>
              <h2 className="font-bold text-[17px] text-apple-gray-900">入住住宿式機構</h2>
              <p className="text-[12px] text-apple-gray-500">護理之家、長照機構、老人福利機構（養護型）</p>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <MoneyInput
                label="機構月費（照護費＋住房＋膳食）"
                value={facilityFee}
                onChange={setFacilityFee}
                hint="預設 $45,000 為本站既有估算（全國平均），各機構與房型差異大，請依實際報價修改；官方核定上限見「機構費用行情」頁"
              />
              <LineItem
                label="住宿式機構補助（每月）"
                value={-subsidyApplied}
                sub={
                  institution.totalSubsidyMonthly > 0
                    ? `每月最高 $${fmt(institution.totalSubsidyMonthly)}，按月認列；以實際自付住宿費為上限`
                    : "目前條件未符合補助資格（需 CMS 4 級以上、中度以上身障證明，或既有住民）"
                }
              />
              <MoneyInput
                label="機構另計自費（耗材、管路照護等）"
                value={facilityExtras}
                onChange={setFacilityExtras}
                hint="不少機構將尿布、管路耗材、特殊護理另計，簽約前請要求書面明細；預設 $2,000 為估算"
              />
            </div>
            <div className="mt-4 pt-4 border-t-2 border-indigo-100 flex items-baseline justify-between">
              <span className="font-bold text-[15px] text-apple-gray-900">機構每月總自付</span>
              <span className="text-[26px] font-bold text-indigo-700 tabular-nums">${fmt(facilityTotal)}</span>
            </div>
            <p className="mt-2 text-[12px] text-apple-gray-400 leading-snug">
              住宿補助一年分 2 期撥付，是事後補助款；上表以每月攤算方便比較，實際現金流請留意撥款時間。
            </p>
          </div>
        </section>
      </div>

      {/* 結論 */}
      <section
        className={`rounded-[14px] border p-5 text-center ${
          diff === 0 ? "bg-apple-gray-50 border-apple-gray-200" : "bg-amber-50 border-amber-100"
        }`}
      >
        <div className="text-[14px] text-apple-gray-600">
          {getIncomeStatusName(incomeStatus)}・CMS {cmsLevel} 級・{cheaperLabel}
        </div>
        <div className="mt-1 text-[22px] font-bold text-apple-gray-900 tabular-nums">
          每月差額 ${fmt(Math.abs(diff))}
          <span className="text-[15px] font-semibold text-apple-gray-500">（每年約 ${fmt(Math.abs(diff) * 12)}）</span>
        </div>
        <p className="mt-2 text-[13px] text-apple-gray-500 leading-relaxed max-w-2xl mx-auto">
          這張表只比「錢」。夜間是否有人能即時處理、長輩的失能進程、家人能持續照顧多久，同樣影響決定；差距在
          $5,000 以內時，建議把照顧品質與家人負荷一起納入考量。
        </p>
      </section>

      <p className="text-[12px] text-apple-gray-400 leading-relaxed">
        試算假設：在宅長照服務使用至核定額度上限。實際金額以照管中心核定計畫、機構契約為準。政策資料版本：{POLICY_VERSION}。
      </p>
    </div>
  );
}
