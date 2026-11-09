"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import {
  buildDischargeTimeline,
  defaultDischargeDate,
  DISCHARGE_DISCLAIMER,
  DISCHARGE_DOCS,
  formatDateZh,
  isPastDay,
  loadDischargeState,
  parseLocalDate,
  PHASE_LABELS,
  saveDischargeState,
  type DischargePhase,
} from "@/lib/dischargePlan";

const PHASE_ORDER: DischargePhase[] = ["before", "day", "after"];

const PHASE_STYLE: Record<DischargePhase, string> = {
  before: "bg-teal-50 border-teal-100 text-teal-800",
  day: "bg-amber-50 border-amber-100 text-amber-800",
  after: "bg-indigo-50 border-indigo-100 text-indigo-800",
};

export default function DischargeChecklist() {
  // 同步修復（2026-11-05）：四個狀態一律用 lazy initializer 直接從共用
  // localStorage 讀，首次 render 就正確。舊版「先渲染空狀態、再用 useEffect
  // 讀取修正」會讓首次載入看到未勾選，且 mount 時的寫入 effect 會先以空
  // 集合蓋掉已存勾選。出院日期也要寫進同一份紀錄，報告書才讀得到。
  const [dischargeDate, setDischargeDate] = useState(
    () => loadDischargeState()?.dischargeDate ?? defaultDischargeDate()
  );
  const [elderName, setElderName] = useState("");
  const [checked, setChecked] = useState<Set<string>>(() => new Set(loadDischargeState()?.checked ?? []));
  const [docsChecked, setDocsChecked] = useState<Set<string>>(() => new Set(loadDischargeState()?.docsChecked ?? []));

  useEffect(() => {
    saveDischargeState({ dischargeDate, checked: [...checked], docsChecked: [...docsChecked] });
  }, [dischargeDate, checked, docsChecked]);

  const discharge = parseLocalDate(dischargeDate);
  const pastDischarge = discharge ? isPastDay(discharge) : false;
  const timeline = useMemo(() => (discharge ? buildDischargeTimeline(discharge) : []), [discharge]);

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

  const doneCount = checked.size;
  const totalCount = timeline.length;

  return (
    <div className="space-y-5">
      {/* 輸入區 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">預計出院日期</span>
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => e.target.value && setDischargeDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <span className="block mt-1 text-[12px] text-apple-gray-400">還沒確定日期也沒關係，先用預估日期排時程，確定後再改</span>
          </label>
          <label className="block">
            <span className="text-[13px] text-apple-gray-600">長輩稱呼（選填，只顯示在你的清單上）</span>
            <input
              type="text"
              value={elderName}
              onChange={(e) => setElderName(e.target.value)}
              placeholder="例如：阿嬤、爸爸"
              className="mt-1 w-full rounded-lg border border-apple-gray-200 px-3 py-2 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <span className="block mt-1 text-[12px] text-apple-gray-400">只存在你的瀏覽器，不會上傳</span>
          </label>
        </div>
        {!discharge && (
          <p className="mt-4 rounded-[10px] bg-red-50 border border-red-200 px-3 py-2 text-[13px] text-red-800 leading-relaxed">
            出院日期無效（年份須為 100–9999 年），請重新選擇日期；下方待辦時程暫不顯示。
          </p>
        )}
        {discharge && pastDischarge && (
          <p className="mt-4 rounded-[10px] bg-amber-50 border border-amber-200 px-3 py-2 text-[13px] text-amber-900 leading-relaxed">
            提醒：預計出院日 {formatDateZh(discharge)} 已過去，以下待辦時程僅供回顧；若日期有誤請重新選擇。
          </p>
        )}
        {discharge && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="text-[14px] text-apple-gray-700">
              預計 <strong className="text-apple-gray-900">{formatDateZh(discharge)}</strong> 出院
              {elderName ? `，${elderName}的待辦清單` : ""}
            </div>
            <div className="ml-auto text-[13px] font-semibold text-teal-700">
              已完成 {doneCount} / {totalCount} 項
            </div>
            <div className="w-full bg-apple-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all"
                style={{ width: totalCount ? `${(doneCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
          </div>
        )}
      </section>

      {/* 三階段待辦 */}
      {PHASE_ORDER.map((phase) => {
        const tasks = timeline.filter((t) => t.phase === phase);
        if (tasks.length === 0) return null;
        return (
          <section key={phase} className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:shadow-none">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-semibold ${PHASE_STYLE[phase]}`}>
              <Icon name="calendar" size={15} />
              {PHASE_LABELS[phase]}
            </div>
            <ul className="mt-4 space-y-3">
              {tasks.map((task) => {
                const done = checked.has(task.id);
                return (
                  <li key={task.id}>
                    <label className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-2 hover:bg-apple-gray-50">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(task.id)}
                        className="mt-1 accent-teal-600 w-4 h-4 shrink-0"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[13px] font-semibold text-teal-700 tabular-nums shrink-0">
                            {formatDateZh(task.date)}
                          </span>
                          <span className={`text-[15px] font-semibold text-apple-gray-900 ${done ? "line-through text-apple-gray-400" : ""}`}>
                            {task.title}
                          </span>
                        </span>
                        <span className="block mt-1 text-[13px] text-apple-gray-600 leading-relaxed">{task.detail}</span>
                        {task.contact && (
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 bg-teal-50 rounded-full px-2 py-0.5">
                            <Icon name="phone" size={12} />
                            {task.contact}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {/* 應備文件 */}
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5 print:shadow-none">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-1">應備文件清單</h2>
        <p className="text-[13px] text-apple-gray-500 mb-4">評估與申請時都要用到，先備好才不會在出院前一天手忙腳亂。</p>
        <ul className="space-y-2.5">
          {DISCHARGE_DOCS.map((doc) => {
            const done = docsChecked.has(doc.label);
            return (
              <li key={doc.label}>
                <label className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-apple-gray-50">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleDoc(doc.label)}
                    className="mt-1 accent-teal-600 w-4 h-4 shrink-0"
                  />
                  <span>
                    <span className={`text-[14px] font-medium text-apple-gray-900 ${done ? "line-through text-apple-gray-400" : ""}`}>
                      {doc.label}
                      <span
                        className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                          doc.required === "必備" ? "bg-rose-50 text-rose-700" : "bg-apple-gray-100 text-apple-gray-500"
                        }`}
                      >
                        {doc.required}
                      </span>
                    </span>
                    <span className="block text-[12px] text-apple-gray-500">{doc.detail}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 產生報告書 CTA */}
      <section className="rounded-[14px] border border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 print:hidden">
        <div className="flex-1">
          <div className="font-bold text-[16px] text-apple-gray-900">把這份清單變成一份報告書</div>
          <p className="text-[13px] text-apple-gray-600 mt-1 leading-relaxed">
            待辦時程、成本對照、應備文件整理成一頁，可免費列印成 PDF 帶去醫院或照管中心。完全免費，不需註冊、不需兌換碼。
          </p>
        </div>
        <Link
          href={`/tools/care-report?discharge=${dischargeDate}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[14px] px-5 py-2.5 rounded-full transition-colors"
        >
          <Icon name="doc" size={16} />
          產生免費照顧報告書 →
        </Link>
      </section>

      <p className="text-[12px] text-apple-gray-400 leading-relaxed">{DISCHARGE_DISCLAIMER}</p>
    </div>
  );
}
