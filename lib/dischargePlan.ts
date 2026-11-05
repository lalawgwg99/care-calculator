/**
 * 出院準備倒數待辦清單 — 共用邏輯（純函式，可單元測試）。
 *
 * 時程依據（2026-11-05 核實）：
 * - 衛福部 106 年起推動「出院準備銜接長照服務計畫」；出院後銜接長照平均天數
 *   106 年 51 天 → 113 年 4 天；115 年起目標平均 2 天內完成銜接，逐步朝出院
 *   當天接上服務邁進（衛福部 2026-03-06 新聞，苗栗縣長期照護處轉載）。
 * - 出院前 3 天由評估人員執行 CMS 及照顧問題評估；出院返家 7 天內取得所需
 *   長照服務（1966.gov.tw「出院準備銜接長照服務」、彰化縣衛生局）。
 * - 申請管道：住院期間向參與計畫的醫院提出，或撥打長照專線 1966。
 */

export type DischargePhase = "before" | "day" | "after";

export interface DischargeTask {
  id: string;
  phase: DischargePhase;
  /** 相對於出院日的天數：負數為出院前，正數為出院後，0 為出院當天 */
  offsetDays: number;
  title: string;
  detail: string;
  contact?: string;
}

export const DISCHARGE_TASKS: DischargeTask[] = [
  {
    id: "contact-team",
    phase: "before",
    offsetDays: -7,
    title: "向醫院出院準備小組提出需求",
    detail:
      "住院期間向參與「出院準備銜接長照服務計畫」的醫院提出，請出院準備小組協助安排評估與服務媒合。",
    contact: "醫院出院準備小組／醫務社工",
  },
  {
    id: "call-1966",
    phase: "before",
    offsetDays: -7,
    title: "打 1966 申請長照服務",
    detail:
      "說明長輩狀況與預計出院日，由照管中心協助申請；也可以請醫院協助轉介，不用自己跑兩邊。",
    contact: "長照專線 1966",
  },
  {
    id: "prepare-docs",
    phase: "before",
    offsetDays: -5,
    title: "備齊應備文件",
    detail: "身分證、健保卡、診斷書或出院病摘先備好，評估與申請時都要用到（完整清單見下方文件區）。",
  },
  {
    id: "home-env",
    phase: "before",
    offsetDays: -5,
    title: "居家環境先改什麼",
    detail: "動線淨空、浴室防滑、床邊扶手、夜燈、常用物品放伸手可及處；需要輔具或無障礙改善可先問照管專員額度。",
  },
  {
    id: "cms-assessment",
    phase: "before",
    offsetDays: -3,
    title: "CMS 評估（照管專員）",
    detail:
      "出院前 3 天由評估人員執行長照需要等級（CMS）及照顧問題評估；再由長照 A 單位個案管理員依等級與給付額度擬定照顧計畫。",
    contact: "照管專員／長照 A 單位",
  },
  {
    id: "med-handover",
    phase: "before",
    offsetDays: -2,
    title: "藥物／管路交接要問什麼",
    detail: "藥物清單與用法、管路更換頻率、傷口照護方式、回診時間，以及出現哪些狀況要立刻回醫院。",
  },
  {
    id: "confirm-first-day",
    phase: "before",
    offsetDays: -1,
    title: "確認首日服務安排",
    detail: "居服員、日照中心或交通接送的首日時間、服務內容與聯絡窗口，確認出院當天有人接手。",
  },
  {
    id: "discharge-day",
    phase: "day",
    offsetDays: 0,
    title: "出院當天",
    detail:
      "辦理出院手續、領藥、核對藥物與出院摘要；115 年政策目標是長照服務出院當天接軌，返家後 7 天內取得所需服務。",
  },
  {
    id: "first-day-check",
    phase: "after",
    offsetDays: 1,
    title: "服務首日確認",
    detail: "居服員到府時間與照顧內容核對；交通接送是否順利；長輩返家第一晚的狀況記下來回報。",
  },
  {
    id: "followup-review",
    phase: "after",
    offsetDays: 3,
    title: "回診與計畫檢討",
    detail: "依約回診；有異常狀況先聯絡回診醫院或 A 單位；與個管師檢討照顧計畫是否需要調整。",
  },
];

export interface DischargeDoc {
  label: string;
  detail: string;
  required: "必備" | "視需要" | "如有";
}

export const DISCHARGE_DOCS: DischargeDoc[] = [
  { label: "身分證（長輩本人）", detail: "申請與核對身分用", required: "必備" },
  { label: "健保卡", detail: "就醫與長照申請", required: "必備" },
  { label: "診斷書或出院病摘", detail: "向醫院申請；申請長照與機構入住時常需檢附", required: "必備" },
  { label: "戶口名簿", detail: "需證明親屬關係時檢附", required: "視需要" },
  { label: "身心障礙證明", detail: "影響補助資格（住宿補助、部分負擔）", required: "如有" },
  { label: "存摺封面影本", detail: "補助款撥付帳戶", required: "視需要" },
  { label: "印章", detail: "申請文件用印", required: "視需要" },
];

export const DISCHARGE_SOURCES = {
  dischargePlan: "https://1966.gov.tw/LTC/cp-6458-69942-207.html",
  applyLtc: "https://1966.gov.tw/LTC/cp-6533-70777-207.html",
} as const;

/** 以本地時區解析 YYYY-MM-DD（避免 UTC 換日偏移）。月／日超出範圍視為無效。 */
export function parseLocalDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = Number(m[3]);
  if (mo < 1 || mo > 12 || day < 1) return null;
  const d = new Date(y, mo - 1, day);
  // Date 會自動進位（如 2 月 30 日變 3 月 2 日、13 月變隔年 1 月），須回頭
  // 核對年月日一致才算合法；否則同步解析（參數／已存日期）會放行怪日期。
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== day) return null;
  return d;
}

export function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

const WEEKDAYS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

export function formatDateZh(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}

export interface DatedTask extends DischargeTask {
  date: Date;
}

export function buildDischargeTimeline(dischargeDate: Date): DatedTask[] {
  return DISCHARGE_TASKS.map((t) => ({ ...t, date: addDays(dischargeDate, t.offsetDays) }));
}

export const PHASE_LABELS: Record<DischargePhase, string> = {
  before: "出院前 7 天",
  day: "出院當天",
  after: "出院後 3 天",
};

/**
 * 待辦頁與報告書共用的本機狀態（同一份 localStorage 紀錄）。
 *
 * 斷點說明（2026-11-05 實測）：舊版待辦頁只存 checked／docsChecked、從不存
 * dischargeDate，報告書的日期又只從 ?discharge= 參數讀——經「相關工具」卡片
 * 或直接開網址進報告書時沒有參數，日期就掉回預設值（今天＋7 天），印出來
 * 是錯的時程。舊版兩頁又都用「先渲染空狀態、再用 useEffect 讀取修正」，
 * 首次載入一定先看到未勾選／預設日期，且待辦頁 mount 時的寫入 effect 會
 * 先以初始空集合把已存勾選蓋掉（讀取 effect 的 setState 尚未套用），構成
 * 寫入競態。修法：日期寫進同一份紀錄、兩頁一律用 lazy initializer 直接
 * 從 localStorage 讀（首次 render 就正確，不經 effect 修正、不先寫空值）。
 */
export const DISCHARGE_STORAGE_KEY = "carepilot-discharge-v1";

export interface DischargeSavedState {
  dischargeDate?: string;
  checked?: string[];
  docsChecked?: string[];
}

/** 預設出院日：今天＋7 天（兩頁共用，避免各寫一份漂移）。 */
export function defaultDischargeDate(): string {
  return toDateInputValue(addDays(new Date(), 7));
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/** 讀取共用已存狀態；SSR 時回 null，損壞／格式不符的欄位逐項捨棄。 */
export function loadDischargeState(): DischargeSavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DISCHARGE_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as DischargeSavedState;
    if (typeof saved !== "object" || saved === null) return null;
    const out: DischargeSavedState = {};
    if (typeof saved.dischargeDate === "string" && parseLocalDate(saved.dischargeDate)) {
      out.dischargeDate = saved.dischargeDate;
    }
    if (isStringArray(saved.checked)) out.checked = saved.checked;
    if (isStringArray(saved.docsChecked)) out.docsChecked = saved.docsChecked;
    return out;
  } catch {
    return null;
  }
}

/** 寫回共用已存狀態（SSR 時為空操作，寫入失敗靜默忽略）。 */
export function saveDischargeState(state: DischargeSavedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISCHARGE_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/**
 * 報告書出院日期解析順序：URL ?discharge= 參數（已驗證）＞ 已存日期（已驗證）
 * ＞ 預設（今天＋7 天）。無效值一律往下一層 fallback，不丟例外。
 */
export function resolveDischargeDate(param: string | null, stored?: string): string {
  if (param && parseLocalDate(param)) return param;
  if (stored && parseLocalDate(stored)) return stored;
  return defaultDischargeDate();
}

export const DISCHARGE_DISCLAIMER =
  "本清單僅供一般資訊參考，不是醫療建議。照顧計畫、評估時程與費用以照管專員正式評估、各醫院出院準備小組公告及衛福部最新公告為準；各醫院參與計畫情形不同，請先向住院醫院確認。";
