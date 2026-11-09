/**
 * 出院倒數待辦清單 — 日期推算手算驗證。
 *
 * 以 2026-11-12（週四）為出院日逐項手算：
 * D-7 = 11/05（週四）、D-5 = 11/07（週六）、D-3 = 11/09（週一）、
 * D-2 = 11/10（週二）、D-1 = 11/11（週三）、D+1 = 11/13（週五）、D+3 = 11/15（週日）。
 */
import {
  addDays,
  buildDischargeTimeline,
  defaultDischargeDate,
  DISCHARGE_DOCS,
  DISCHARGE_STORAGE_KEY,
  DISCHARGE_TASKS,
  formatDateZh,
  loadDischargeState,
  parseLocalDate,
  resolveDischargeDate,
  saveDischargeState,
  toDateInputValue,
} from "@/lib/dischargePlan";

describe("出院倒數待辦清單（日期推算）", () => {
  it("以 2026-11-12 為出院日，各待辦日期逐項相符", () => {
    const discharge = parseLocalDate("2026-11-12");
    expect(discharge).not.toBeNull();
    const timeline = buildDischargeTimeline(discharge!);
    const byId = new Map(timeline.map((t) => [t.id, t]));
    expect(toDateInputValue(byId.get("contact-team")!.date)).toBe("2026-11-05");
    expect(toDateInputValue(byId.get("call-1966")!.date)).toBe("2026-11-05");
    expect(toDateInputValue(byId.get("prepare-docs")!.date)).toBe("2026-11-07");
    expect(toDateInputValue(byId.get("home-env")!.date)).toBe("2026-11-07");
    expect(toDateInputValue(byId.get("cms-assessment")!.date)).toBe("2026-11-09");
    expect(toDateInputValue(byId.get("med-handover")!.date)).toBe("2026-11-10");
    expect(toDateInputValue(byId.get("confirm-first-day")!.date)).toBe("2026-11-11");
    expect(toDateInputValue(byId.get("discharge-day")!.date)).toBe("2026-11-12");
    expect(toDateInputValue(byId.get("first-day-check")!.date)).toBe("2026-11-13");
    expect(toDateInputValue(byId.get("followup-review")!.date)).toBe("2026-11-15");
  });

  it("三階段任務數：出院前 7 項、當天 1 項、出院後 2 項，共 10 項", () => {
    expect(DISCHARGE_TASKS).toHaveLength(10);
    expect(DISCHARGE_TASKS.filter((t) => t.phase === "before")).toHaveLength(7);
    expect(DISCHARGE_TASKS.filter((t) => t.phase === "day")).toHaveLength(1);
    expect(DISCHARGE_TASKS.filter((t) => t.phase === "after")).toHaveLength(2);
  });

  it("跨月推算正確：出院日 2026-12-02 時 D-7 為 11/25", () => {
    const timeline = buildDischargeTimeline(parseLocalDate("2026-12-02")!);
    const first = timeline.find((t) => t.id === "contact-team")!;
    expect(toDateInputValue(first.date)).toBe("2026-11-25");
  });

  it("中文日期格式：2026-11-12 為 11月12日（週四）", () => {
    expect(formatDateZh(parseLocalDate("2026-11-12")!)).toBe("11月12日（週四）");
  });

  it("addDays 不改變原日期物件", () => {
    const d = parseLocalDate("2026-11-12")!;
    addDays(d, -7);
    expect(toDateInputValue(d)).toBe("2026-11-12");
  });

  it("parseLocalDate 拒絕不合法輸入", () => {
    expect(parseLocalDate("")).toBeNull();
    expect(parseLocalDate("2026/11/12")).toBeNull();
    expect(parseLocalDate("not-a-date")).toBeNull();
    // 月／日超出範圍不接受 Date 自動進位（2026-13-99、2026-02-30 皆無效）
    expect(parseLocalDate("2026-13-99")).toBeNull();
    expect(parseLocalDate("2026-02-30")).toBeNull();
    expect(parseLocalDate("2026-00-10")).toBeNull();
    expect(parseLocalDate("2026-11-00")).toBeNull();
  });

  it("應備文件清單 7 項，必備 3 項（身分證、健保卡、診斷書或出院病摘）", () => {
    expect(DISCHARGE_DOCS).toHaveLength(7);
    const required = DISCHARGE_DOCS.filter((d) => d.required === "必備").map((d) => d.label);
    expect(required).toEqual(["身分證（長輩本人）", "健保卡", "診斷書或出院病摘"]);
  });
});

/**
 * 待辦頁 ↔ 報告書同步（2026-11-05 實測 bug 修復）。
 *
 * 實測情境：待辦頁把出院日改成 2026-11-20，報告書仍顯示預設 2026-11-12
 * 與舊時程（11/5、11/7、11/9、11/12、11/13、11/15）；報告書首次打開
 * 待辦顯示未勾選，重新整理後才顯示已勾選。
 * 斷點：待辦頁從不把出院日期寫進 localStorage，報告書日期只從
 * ?discharge= 參數讀；兩頁又都用「先渲染空狀態、再用 useEffect 讀取修正」，
 * 首次載入必先看到未勾選／預設日期，且待辦頁 mount 時的寫入 effect 會先
 * 以空集合蓋掉已存勾選。
 */
describe("出院狀態同步（待辦頁 ↔ 報告書）", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("預設出院日為今天＋7 天", () => {
    expect(defaultDischargeDate()).toBe(toDateInputValue(addDays(new Date(), 7)));
  });

  it("resolveDischargeDate：URL 參數優先於已存日期", () => {
    expect(resolveDischargeDate("2026-11-20", "2026-11-18")).toBe("2026-11-20");
  });

  it("resolveDischargeDate：無參數時用已存日期", () => {
    expect(resolveDischargeDate(null, "2026-11-20")).toBe("2026-11-20");
  });

  it("resolveDischargeDate：無效參數 fallback 到已存日期，無效已存日期 fallback 到預設", () => {
    expect(resolveDischargeDate("not-a-date", "2026-11-20")).toBe("2026-11-20");
    expect(resolveDischargeDate(null, "2026-13-99")).toBe(defaultDischargeDate());
    expect(resolveDischargeDate(null, undefined)).toBe(defaultDischargeDate());
  });

  it("save／load 往返：日期＋勾選＋文件勾選原樣讀回", () => {
    saveDischargeState({
      dischargeDate: "2026-11-20",
      checked: ["contact-team", "call-1966"],
      docsChecked: ["身分證（長輩本人）"],
    });
    expect(loadDischargeState()).toEqual({
      dischargeDate: "2026-11-20",
      checked: ["contact-team", "call-1966"],
      docsChecked: ["身分證（長輩本人）"],
    });
  });

  it("load：無紀錄回 null；損壞 JSON 回 null 不丟例外", () => {
    expect(loadDischargeState()).toBeNull();
    window.localStorage.setItem(DISCHARGE_STORAGE_KEY, "{not json");
    expect(loadDischargeState()).toBeNull();
  });

  it("load：無效日期欄位捨棄、非陣列勾選欄位捨棄，其餘欄位保留", () => {
    window.localStorage.setItem(
      DISCHARGE_STORAGE_KEY,
      JSON.stringify({ dischargeDate: "2026-13-99", checked: "not-an-array", docsChecked: ["健保卡"] })
    );
    expect(loadDischargeState()).toEqual({ docsChecked: ["健保卡"] });
  });

  it("load：未知任務 id／文件名稱捨棄，只保留已知項目（2026-11-09 稽核 BUG-6）", () => {
    window.localStorage.setItem(
      DISCHARGE_STORAGE_KEY,
      JSON.stringify({ checked: ["bogus-id", "contact-team"], docsChecked: ["健保卡", "不存在的文件"] })
    );
    expect(loadDischargeState()).toEqual({ checked: ["contact-team"], docsChecked: ["健保卡"] });
  });

  it("以 2026-11-20 為出院日，時程逐項相符（不再是預設 11-12 的舊時程）", () => {
    const timeline = buildDischargeTimeline(parseLocalDate("2026-11-20")!);
    const byId = new Map(timeline.map((t) => [t.id, t]));
    expect(toDateInputValue(byId.get("contact-team")!.date)).toBe("2026-11-13");
    expect(toDateInputValue(byId.get("call-1966")!.date)).toBe("2026-11-13");
    expect(toDateInputValue(byId.get("prepare-docs")!.date)).toBe("2026-11-15");
    expect(toDateInputValue(byId.get("home-env")!.date)).toBe("2026-11-15");
    expect(toDateInputValue(byId.get("cms-assessment")!.date)).toBe("2026-11-17");
    expect(toDateInputValue(byId.get("med-handover")!.date)).toBe("2026-11-18");
    expect(toDateInputValue(byId.get("confirm-first-day")!.date)).toBe("2026-11-19");
    expect(toDateInputValue(byId.get("discharge-day")!.date)).toBe("2026-11-20");
    expect(toDateInputValue(byId.get("first-day-check")!.date)).toBe("2026-11-21");
    expect(toDateInputValue(byId.get("followup-review")!.date)).toBe("2026-11-23");
    expect(formatDateZh(byId.get("discharge-day")!.date)).toBe("11月20日（週五）");
  });
});
