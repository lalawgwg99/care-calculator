"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import {
  calculateCareBudget,
  getCMSLevelName,
  getIncomeStatusName,
  type CMSLevel,
  type IncomeStatus,
} from "@/lib/careLogic";
import { ASSISTIVE_DEVICE_GROUPS, getRespiteYearlyQuota, POLICY_VERSION } from "@/lib/policyData";
import {
  buildDischargeTimeline,
  DISCHARGE_DISCLAIMER,
  DISCHARGE_DOCS,
  DISCHARGE_SOURCES,
  formatDateZh,
  parseLocalDate,
  PHASE_LABELS,
  toDateInputValue,
  addDays,
  type DischargePhase,
} from "@/lib/dischargePlan";

const STORAGE_KEY = "carepilot-discharge-v1";
const PHASE_ORDER: DischargePhase[] = ["before", "day", "after"];

const fmt = (n: number) => Math.round(n).toLocaleString("zh-TW");

function defaultDischargeDate(): string {
  return toDateInputValue(addDays(new Date(), 7));
}

export default function CareReport() {
  const [elderName, setElderName] = useState("");
  const [dischargeDate, setDischargeDate] = useState(defaultDischargeDate);
  const [cmsLevel, setCmsLevel] = useState<CMSLevel | null>(null);
  const [incomeStatus, setIncomeStatus] = useState<IncomeStatus>("general");
  const [carePlan, setCarePlan] = useState<"home" | "institution" | "undecided">("undecided");
  const [facilityFee, setFacilityFee] = useState(45000);
  const [facilityExtras, setFacilityExtras] = useState(2000);
  const [homeConsumables, setHomeConsumables] = useState(3000);
  const [leaveDays, setLeaveDays] = useState(0);
  const [dailyWage, setDailyWage] = useState(1500);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [docsChecked, setDocsChecked] = useState<Set<string>>(new Set());
  const [generatedAt] = useState(() => new Date());

  // 從出院清單頁帶入日期，並讀取同一份勾選狀態
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get("discharge");
      if (d && parseLocalDate(d)) setDischargeDate(d);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { checked?: string[]; docsChecked?: string[] };
        if (saved.checked) setChecked(new Set(saved.checked));
        if (saved.docsChecked) setDocsChecked(new Set(saved.docsChecked));
      }
    } catch {}
  }, []);

  const discharge = parseLocalDate(dischargeDate);
  const timeline = useMemo(() => (discharge ? buildDischargeTimeline(discharge) : []), [discharge]);

  const home = useMemo(
    () => (cmsLevel ? calculateCareBudget(cmsLevel, incomeStatus, "home-care", { transportRegion: "region1" }) : null),
    [cmsLevel, incomeStatus]
  );
  const institution = useMemo(
    () => (cmsLevel ? calculateCareBudget(cmsLevel, incomeStatus, "institution", {}) : null),
    [cmsLevel, incomeStatus]
  );

  const leaveCost = leaveDays * dailyWage;
  const homeTotal = home ? home.outOfPocketMonthly + homeConsumables + leaveCost : null;
  const subsidyApplied = institution ? Math.min(institution.totalSubsidyMonthly, facilityFee) : 0;
  const facilityTotal = institution ? Math.max(0, facilityFee - subsidyApplied) + facilityExtras : null;
  const diff = homeTotal !== null && facilityTotal !== null ? homeTotal - facilityTotal : null;

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleDoc = (label: string) =>
    setDocsChecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const handlePrint = () => window.print();

  const carePlanLabel = carePlan === "home" ? "在宅照顧" : carePlan === "institution" ? "住宿式機構" : "尚未決定";
  const respiteYearly = cmsLevel ? getRespiteYearlyQuota(cmsLevel) : 0;

  return (
    <div className="space-y-5">
      {/* 免費說明 */}
      <section className="rounded-[14px] border border-teal-100 bg-teal-50 p-5">
        <div className="flex items-start gap-3">
          <Icon name="check" size={20} />
          <div>
            <div className="font-bold text-[15px] text-apple-gray-900">完全免費，不收費、不需註冊、不需兌換碼</div>
            <p className="text-[13px] text-apple-gray-600 mt-1 leading-relaxed">
              這頁看到的全部資訊都已包含在免費版中，沒有任何功能被鎖住。這份報告書只是把待辦時程、成本對照、應備文件整理成一頁，
              方便你免費列印成 PDF，帶去醫院或照管中心。
            </p>
          </div>
        </div>
      </section>

      {/* 輸入區（螢幕專用，不列印） */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:hidden">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-4">填入長輩的狀況，報告書自動帶入數字</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">長輩稱呼（選填，只顯示在報告書上）</span>
            <input
              type="text"
              value={elderName}
              onChange={(e) => setElderName(e.target.value)}
              placeholder="例如：阿嬤、爸爸"
              className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">預計出院日期</span>
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => e.target.value && setDischargeDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </label>
          <div>
            <div className="text-[13px] text-apple-gray-600 mb-2">
              失能等級（CMS）{cmsLevel ? `：${cmsLevel} 級・${getCMSLevelName(cmsLevel)}` : "（未選）"}
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {([1, 2, 3, 4, 5, 6, 7, 8] as CMSLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setCmsLevel(lv)}
                  className={`py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    cmsLevel === lv ? "bg-teal-600 text-white" : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-apple-gray-400">還不知道等級？先用首頁主試算估算，或撥 1966 由照管中心評估。</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[13px] text-apple-gray-600">身份別</span>
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
              <span className="text-[13px] text-apple-gray-600">目前傾向</span>
              <select
                value={carePlan}
                onChange={(e) => setCarePlan(e.target.value as "home" | "institution" | "undecided")}
                className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              >
                <option value="undecided">尚未決定</option>
                <option value="home">在宅照顧</option>
                <option value="institution">住宿式機構</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">機構月費（可依實際報價修改）</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-apple-gray-400 text-[13px]">$</span>
              <input
                type="number"
                min={0}
                value={facilityFee}
                onChange={(e) => setFacilityFee(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
              <span className="text-apple-gray-400 text-[13px] shrink-0">/月</span>
            </div>
            <span className="block mt-1 text-[12px] text-apple-gray-400">預設 $45,000 為本站既有全國平均估算，請依實際報價修改</span>
          </label>
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">在宅耗材費（尿布、看護墊等，可修改）</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-apple-gray-400 text-[13px]">$</span>
              <input
                type="number"
                min={0}
                value={homeConsumables}
                onChange={(e) => setHomeConsumables(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
              <span className="text-apple-gray-400 text-[13px] shrink-0">/月</span>
            </div>
            <span className="block mt-1 text-[12px] text-apple-gray-400">無官方標準金額，預設 $3,000 為常見估算</span>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[14px] px-5 py-2.5 rounded-full transition-colors"
          >
            <Icon name="printer" size={16} />
            免費下載 PDF（列印）
          </button>
          <span className="text-[12px] text-apple-gray-500">在列印對話框選擇「另存為 PDF」即可存檔；不用註冊、不用付費。</span>
        </div>
      </section>

      {/* ===== 報告書本體（列印範圍） ===== */}
      <div className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 sm:p-7 print:shadow-none print:border-0 print:p-0">
        <div className="text-center border-b border-apple-gray-200 pb-4">
          <div className="text-[13px] font-semibold text-teal-700">CarePilot 長照領航員・免費照顧報告書</div>
          <h2 className="text-[22px] font-bold text-apple-gray-900 mt-1">
            {elderName ? `${elderName}的照顧報告書` : "照顧報告書"}
          </h2>
          <p className="text-[13px] text-apple-gray-500 mt-1">
            產生日期 {formatDateZh(generatedAt)}
            {discharge ? `・預計出院 ${formatDateZh(discharge)}` : ""}
            {cmsLevel ? `・CMS ${cmsLevel} 級（${getCMSLevelName(cmsLevel)}）・${getIncomeStatusName(incomeStatus)}` : "・CMS 等級未評估"}
            {`・目前傾向：${carePlanLabel}`}
          </p>
          <p className="text-[12px] text-teal-700 mt-1">本報告書完全免費；頁面全部資訊皆已包含在免費版中。</p>
        </div>

        {/* 一、待辦時程 */}
        <section className="mt-5">
          <h3 className="font-bold text-[16px] text-apple-gray-900">一、出院待辦時程</h3>
          {PHASE_ORDER.map((phase) => {
            const tasks = timeline.filter((t) => t.phase === phase);
            if (tasks.length === 0) return null;
            return (
              <div key={phase} className="mt-3">
                <div className="text-[13px] font-semibold text-teal-700">{PHASE_LABELS[phase]}</div>
                <ul className="mt-1.5 space-y-2">
                  {tasks.map((task) => {
                    const done = checked.has(task.id);
                    return (
                      <li key={task.id} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggle(task.id)}
                          className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0 print:hidden"
                        />
                        <span className="hidden print:inline shrink-0 w-4 text-center">{done ? "☑" : "☐"}</span>
                        <span>
                          <strong className="text-apple-gray-900 tabular-nums">{formatDateZh(task.date)}</strong>{" "}
                          <span className={done ? "line-through text-apple-gray-400" : "text-apple-gray-800"}>{task.title}</span>
                          <span className="block text-apple-gray-500">{task.detail}</span>
                          {task.contact && <span className="block text-teal-700 text-[12px]">聯絡：{task.contact}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>

        {/* 二、成本對照表 */}
        <section className="mt-6">
          <h3 className="font-bold text-[16px] text-apple-gray-900">二、在宅 vs 機構每月成本對照</h3>
          {cmsLevel === null || home === null || institution === null || homeTotal === null || facilityTotal === null || diff === null ? (
            <p className="mt-2 text-[13px] text-apple-gray-500 leading-relaxed">
              請先在上方選擇 CMS 等級，成本對照表才會顯示試算。還不知道等級，可用首頁主試算估算，或撥 1966 由照管中心評估。
            </p>
          ) : (
            <>
              <table className="mt-3 w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-apple-gray-200 text-left">
                    <th className="py-2 pr-2 font-semibold text-apple-gray-900">項目</th>
                    <th className="py-2 pr-2 font-semibold text-teal-700 text-right">在宅（每月）</th>
                    <th className="py-2 font-semibold text-indigo-700 text-right">機構（每月）</th>
                  </tr>
                </thead>
                <tbody className="text-apple-gray-700">
                  <tr className="border-b border-apple-gray-100">
                    <td className="py-2 pr-2">長照服務部分負擔</td>
                    <td className="py-2 pr-2 text-right tabular-nums">${fmt(home.outOfPocketMonthly)}</td>
                    <td className="py-2 text-right tabular-nums">—</td>
                  </tr>
                  <tr className="border-b border-apple-gray-100">
                    <td className="py-2 pr-2">機構月費（已扣補助 ${fmt(subsidyApplied)}）</td>
                    <td className="py-2 pr-2 text-right tabular-nums">—</td>
                    <td className="py-2 text-right tabular-nums">${fmt(Math.max(0, facilityFee - subsidyApplied))}</td>
                  </tr>
                  <tr className="border-b border-apple-gray-100">
                    <td className="py-2 pr-2">耗材／另計自費</td>
                    <td className="py-2 pr-2 text-right tabular-nums">${fmt(homeConsumables)}</td>
                    <td className="py-2 text-right tabular-nums">${fmt(facilityExtras)}</td>
                  </tr>
                  <tr className="border-b border-apple-gray-100">
                    <td className="py-2 pr-2">家人請假成本（{leaveDays} 天 × ${fmt(dailyWage)}）</td>
                    <td className="py-2 pr-2 text-right tabular-nums">${fmt(leaveCost)}</td>
                    <td className="py-2 text-right tabular-nums">—</td>
                  </tr>
                  <tr className="border-b-2 border-apple-gray-200 font-bold text-apple-gray-900">
                    <td className="py-2 pr-2">每月總自付</td>
                    <td className="py-2 pr-2 text-right tabular-nums">${fmt(homeTotal)}</td>
                    <td className="py-2 text-right tabular-nums">${fmt(facilityTotal)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-[13px] text-apple-gray-700">
                {diff > 0 ? `機構每月較省 $${fmt(diff)}（每年約 $${fmt(diff * 12)}）` : diff < 0 ? `在宅每月較省 $${fmt(Math.abs(diff))}（每年約 $${fmt(Math.abs(diff) * 12)}）` : "兩邊每月總自付相同"}
                。政府另補助在宅長照服務約 ${fmt(home.totalSubsidyMonthly)}/月。
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-apple-gray-500 leading-relaxed list-disc pl-5">
                {respiteYearly > 0 && <li>喘息服務年額度 ${fmt(respiteYearly)}（CMS {cmsLevel} 級），未併入上表月費。</li>}
                <li>
                  輔具及居家無障礙每 3 年額度 ${fmt(ASSISTIVE_DEVICE_GROUPS.group1.threeYearQuota)}（第一組）／
                  ${fmt(ASSISTIVE_DEVICE_GROUPS.group2.threeYearQuota)}（第二組），以核定為準，未併入上表月費。
                </li>
                <li>住宿補助一年分 2 期撥付，是事後補助款；上表以每月攤算方便比較，實際現金流請留意撥款時間。</li>
                <li>在宅試算假設長照服務使用至核定額度上限；實際金額以照管中心核定計畫、機構契約為準。</li>
              </ul>
            </>
          )}
        </section>

        {/* 三、應備文件 */}
        <section className="mt-6">
          <h3 className="font-bold text-[16px] text-apple-gray-900">三、應備文件清單</h3>
          <ul className="mt-2 space-y-1.5">
            {DISCHARGE_DOCS.map((doc) => {
              const done = docsChecked.has(doc.label);
              return (
                <li key={doc.label} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleDoc(doc.label)}
                    className="mt-0.5 accent-teal-600 w-4 h-4 shrink-0 print:hidden"
                  />
                  <span className="hidden print:inline shrink-0 w-4 text-center">{done ? "☑" : "☐"}</span>
                  <span>
                    <span className={done ? "line-through text-apple-gray-400" : "text-apple-gray-800"}>
                      {doc.label}
                      <span className="ml-2 text-[11px] font-semibold text-apple-gray-500">（{doc.required}）</span>
                    </span>
                    <span className="block text-apple-gray-500">{doc.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 免責與來源 */}
        <section className="mt-6 border-t border-apple-gray-200 pt-4">
          <h3 className="font-bold text-[14px] text-apple-gray-900">免責聲明</h3>
          <p className="mt-1.5 text-[12px] text-apple-gray-500 leading-relaxed">{DISCHARGE_DISCLAIMER}</p>
          <p className="mt-1.5 text-[12px] text-apple-gray-500 leading-relaxed">
            本報告書僅供一般資訊參考，不是醫療建議；輸入的資料僅存在你的瀏覽器，不會上傳本站伺服器。補助金額與政策以衛福部最新公告為準
            （政策資料版本 {POLICY_VERSION}）。出院準備銜接長照服務說明見{" "}
            <a href={DISCHARGE_SOURCES.dischargePlan} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
              1966 長照專區
            </a>
            ，或撥打長照專線 1966。
          </p>
        </section>
      </div>

      {/* 相關工具 */}
      <section className="mt-5 grid sm:grid-cols-2 gap-3 print:hidden">
        <Link href="/tools/discharge-checklist" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">出院準備倒數待辦清單</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">出院前 7 天到出院後 3 天，逐項勾完就安心</div>
        </Link>
        <Link href="/tools/home-vs-institution" className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-4 hover:shadow-apple-hover transition-shadow">
          <div className="font-semibold text-[14px] text-apple-gray-900">在宅 vs 機構總成本比較</div>
          <div className="text-[12px] text-apple-gray-500 mt-1">改耗材、請假天數、機構月費，細調兩邊的每月總自付</div>
        </Link>
      </section>
    </div>
  );
}
