"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

const STORAGE_KEY = "carepilot-diary-v1";
const WEEKDAY_NAMES = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];

// appetite / mood: -1 = 未填，0 = 差，1 = 普通，2 = 好
interface DayRecord {
  appetite: number;
  mood: number;
  fall: boolean;
  note: string;
}

type Store = Record<string, DayRecord[]>; // key: 週一的 YYYY-MM-DD

const emptyDay = (): DayRecord => ({ appetite: -1, mood: -1, fall: false, note: "" });

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function mondayOf(d: Date) {
  const x = new Date(d);
  const diff = (x.getDay() + 6) % 7; // 週一為起點
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function shortDate(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Store;
  } catch {
    return {};
  }
}

function hasData(d: DayRecord) {
  return d.appetite !== -1 || d.mood !== -1 || d.fall || d.note.trim() !== "";
}

const RATE_OPTS = [
  { label: "好", value: 2, on: "bg-green-100 border-green-400 text-green-800" },
  { label: "普通", value: 1, on: "bg-amber-100 border-amber-400 text-amber-800" },
  { label: "差", value: 0, on: "bg-red-100 border-red-400 text-red-700" },
];
const FALL_OPTS = [
  { label: "沒有", value: false, on: "bg-green-100 border-green-400 text-green-800" },
  { label: "有", value: true, on: "bg-red-100 border-red-400 text-red-700" },
];
const OFF_CLS =
  "bg-white border-apple-gray-200 text-apple-gray-500 hover:border-apple-gray-300";

export default function DiaryClient() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [store, setStore] = useState<Store>({});
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [sumError, setSumError] = useState<string | null>(null);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  const monday = useMemo(() => addDays(mondayOf(new Date()), weekOffset * 7), [weekOffset]);
  const weekKey = dateKey(monday);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);
  const todayKey = dateKey(new Date());

  const days: DayRecord[] = useMemo(() => {
    const saved = store[weekKey];
    return Array.from({ length: 7 }, (_, i) => {
      const s = saved?.[i];
      if (s && typeof s === "object") {
        return {
          appetite: typeof s.appetite === "number" ? s.appetite : -1,
          mood: typeof s.mood === "number" ? s.mood : -1,
          fall: !!s.fall,
          note: typeof s.note === "string" ? s.note.slice(0, 100) : "",
        };
      }
      return emptyDay();
    });
  }, [store, weekKey]);

  const updateDay = useCallback(
    (index: number, patch: Partial<DayRecord>) => {
      setStore((prev) => {
        const week = Array.from({ length: 7 }, (_, i) => ({ ...(prev[weekKey]?.[i] ?? emptyDay()) }));
        week[index] = { ...week[index], ...patch };
        const next = { ...prev, [weekKey]: week };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* 空間不足就靜默略過 */
        }
        return next;
      });
    },
    [weekKey]
  );

  useEffect(() => {
    setSummary(null);
    setSumError(null);
  }, [weekKey]);

  const filledDays = days.filter(hasData);
  const isEmptyWeek = filledDays.length === 0;

  const handleSummary = async () => {
    if (summarizing || filledDays.length === 0) return;
    setSummarizing(true);
    setSumError(null);
    try {
      const payloadDays = days
        .filter(hasData)
        .map((d) => ({
          appetite: d.appetite < 0 ? 1 : d.appetite,
          mood: d.mood < 0 ? 1 : d.mood,
          fall: d.fall,
          note: d.note.trim().slice(0, 100),
        }));
      const res = await fetch("https://ai.taicalc.com/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "diary-summary", payload: { days: payloadDays } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.text !== "string" || !data.text) {
        throw new Error(typeof data.error === "string" ? data.error : "ai error");
      }
      setSummary(data.text);
    } catch (e: any) {
      setSumError(
        e?.message === "ai not configured"
          ? "AI 功能還沒開通，請晚點再試一次。"
          : "AI 現在有點忙，晚點再試一次就好。"
      );
    } finally {
      setSummarizing(false);
    }
  };

  const segBtn = (
    active: boolean,
    onCls: string,
    label: string,
    onClick: () => void,
    ariaLabel: string
  ) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`flex-1 py-3 px-2 rounded-2xl border-2 text-[16px] font-semibold transition-all ${
        active ? onCls : OFF_CLS
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <a
          href="/tools"
          className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900 mb-6"
        >
          ← 回到實用工具
        </a>

        {/* Header */}
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-5">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 text-center">
            <div className="text-[48px] mb-4">📓</div>
            <h1 className="text-[28px] font-bold text-apple-gray-900 mb-3">照顧日記</h1>
            <p className="text-[15px] text-apple-gray-600 leading-relaxed">
              每天花 1 分鐘，記下長輩的食慾、精神和狀況。
              <br />
              變化看得見，照顧更安心。
            </p>
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2.5 bg-white rounded-[20px] border border-apple-gray-200/60 px-4 py-3.5 mb-5">
          <span className="text-[18px] shrink-0">🔒</span>
          <p className="text-[13px] text-apple-gray-500 leading-relaxed">
            這些記錄只存在你的手機或瀏覽器裡，不會上傳到網路。換手機或清掉瀏覽器資料的話，記錄就不會跟著過去。
          </p>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="px-4 py-2.5 rounded-full bg-white border border-apple-gray-200 text-[14px] font-semibold text-apple-gray-700 hover:border-apple-gray-300 transition-all"
          >
            ← 上一週
          </button>
          <p className="text-[15px] font-bold text-apple-gray-900 tabular-nums">
            {shortDate(weekDates[0])} – {shortDate(weekDates[6])}
            {weekOffset === 0 && (
              <span className="ml-2 text-[12px] font-semibold text-apple-green bg-green-100 rounded-full px-2.5 py-1">
                本週
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
            disabled={weekOffset >= 0}
            className="px-4 py-2.5 rounded-full bg-white border border-apple-gray-200 text-[14px] font-semibold text-apple-gray-700 hover:border-apple-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一週 →
          </button>
        </div>

        {!ready ? (
          <div className="bg-white rounded-[24px] border border-apple-gray-200/60 p-8 text-center">
            <p className="text-[15px] text-apple-gray-500">載入中…</p>
          </div>
        ) : isEmptyWeek ? (
          /* Empty state */
          <div className="bg-white rounded-[24px] shadow-apple-warm border border-apple-gray-200/60 p-8 text-center mb-5">
            <div className="text-[44px] mb-4">🌱</div>
            <h2 className="text-[19px] font-bold text-apple-gray-900 mb-2">還沒開始記錄，沒關係</h2>
            <p className="text-[15px] text-apple-gray-500 leading-relaxed">
              從今天開始就好。每天睡前花 1 分鐘，點一下長輩今天的食慾和精神，
              週末回頭看，就能發現以前沒注意到的變化。
            </p>
          </div>
        ) : null}

        {/* Day cards */}
        {ready &&
          weekDates.map((date, i) => {
            const d = days[i];
            const isToday = dateKey(date) === todayKey;
            return (
              <section
                key={dateKey(date)}
                className="bg-white rounded-[24px] shadow-apple border border-apple-gray-200/60 p-5 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-apple-gray-900">
                    {shortDate(date)}{" "}
                    <span className="text-[14px] font-medium text-apple-gray-500">
                      {WEEKDAY_NAMES[i]}
                    </span>
                  </h2>
                  {isToday && (
                    <span className="text-[12px] font-semibold text-white bg-apple-orange rounded-full px-2.5 py-1">
                      今天
                    </span>
                  )}
                </div>

                <p className="text-[14px] font-semibold text-apple-gray-700 mb-2">食慾</p>
                <div className="flex gap-2 mb-4" role="group" aria-label={`${shortDate(date)} 食慾`}>
                  {RATE_OPTS.map((o) =>
                    segBtn(
                      d.appetite === o.value,
                      o.on,
                      o.label,
                      () => updateDay(i, { appetite: o.value }),
                      `食慾${o.label}`
                    )
                  )}
                </div>

                <p className="text-[14px] font-semibold text-apple-gray-700 mb-2">精神</p>
                <div className="flex gap-2 mb-4" role="group" aria-label={`${shortDate(date)} 精神`}>
                  {RATE_OPTS.map((o) =>
                    segBtn(
                      d.mood === o.value,
                      o.on,
                      o.label,
                      () => updateDay(i, { mood: o.value }),
                      `精神${o.label}`
                    )
                  )}
                </div>

                <p className="text-[14px] font-semibold text-apple-gray-700 mb-2">有沒有跌倒</p>
                <div className="flex gap-2 mb-4" role="group" aria-label={`${shortDate(date)} 跌倒`}>
                  {FALL_OPTS.map((o) =>
                    segBtn(
                      d.fall === o.value,
                      o.on,
                      o.label,
                      () => updateDay(i, { fall: o.value }),
                      o.value ? "有跌倒" : "沒有跌倒"
                    )
                  )}
                </div>

                <label
                  htmlFor={`note-${dateKey(date)}`}
                  className="text-[14px] font-semibold text-apple-gray-700 mb-2 block"
                >
                  補充一下
                </label>
                <input
                  id={`note-${dateKey(date)}`}
                  type="text"
                  value={d.note}
                  maxLength={100}
                  onChange={(e) => updateDay(i, { note: e.target.value })}
                  placeholder="例如：晚上睡不好、胃口比昨天好一點"
                  className="w-full rounded-2xl border-2 border-apple-gray-200 bg-apple-gray-50 px-4 py-3 text-[15px] text-apple-gray-900 placeholder:text-apple-gray-400 focus:outline-none focus:border-apple-orange/60 focus:bg-white transition-all"
                />
                <p className="text-right text-[12px] text-apple-gray-400 mt-1 tabular-nums">
                  {d.note.length}/100
                </p>
              </section>
            );
          })}

        {/* AI summary */}
        {ready && !isEmptyWeek && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSummary}
              disabled={summarizing}
              className="w-full py-4 rounded-[20px] bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[17px] font-bold shadow-md shadow-orange-200/50 hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-wait"
            >
              {summarizing ? "AI 整理中…" : "✨ AI 本週摘要"}
            </button>

            {sumError && (
              <div className="mt-4 bg-white rounded-[20px] border border-apple-gray-200/60 p-5 text-center">
                <p className="text-[15px] text-apple-gray-600 mb-3">{sumError}</p>
                <button
                  type="button"
                  onClick={handleSummary}
                  className="px-5 py-2.5 rounded-full bg-apple-gray-100 text-[14px] font-semibold text-apple-gray-700 hover:bg-apple-gray-200 transition-all"
                >
                  再試一次
                </button>
              </div>
            )}

            {summary && !summarizing && (
              <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[24px] border border-orange-200/60 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[20px]">📝</span>
                  <h2 className="text-[16px] font-bold text-apple-gray-900">本週摘要</h2>
                </div>
                <p className="text-[15px] text-apple-gray-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
                <p className="mt-4 pt-4 border-t border-orange-200/60 text-[12px] text-apple-gray-500 leading-relaxed">
                  AI 摘要僅供參考，不是醫療建議；有疑慮請諮詢醫生。
                </p>
              </div>
            )}

            {!summary && !sumError && !summarizing && (
              <p className="mt-3 text-center text-[13px] text-apple-gray-400 leading-relaxed">
                AI 會把這週的記錄整理成幾句話，有異常變化會提醒你回診時跟醫生提。
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
