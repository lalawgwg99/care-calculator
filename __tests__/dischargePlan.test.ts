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
  DISCHARGE_DOCS,
  DISCHARGE_TASKS,
  formatDateZh,
  parseLocalDate,
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
  });

  it("應備文件清單 7 項，必備 3 項（身分證、健保卡、診斷書或出院病摘）", () => {
    expect(DISCHARGE_DOCS).toHaveLength(7);
    const required = DISCHARGE_DOCS.filter((d) => d.required === "必備").map((d) => d.label);
    expect(required).toEqual(["身分證（長輩本人）", "健保卡", "診斷書或出院病摘"]);
  });
});
