/**
 * 2026-10-29 研發小組第 3 輪 P1 新工具手算驗證。
 *
 * 住宿式機構補助試算器：數字依據衛福部長照專區（115-10-01 更新）與
 * 臺中市政府衛生局 115 年度申請作業須知（衛部顧字第 1151962241 號函），
 * 查證 2026-10-29。巴氏量表：十項權重與五段區間見
 * components/BarthelSelfCheck.tsx 檔頭註記。
 */
import {
  calcInstitutionSubsidy,
  MONTHLY_SEVERE,
  MONTHLY_EXISTING,
  ANNUAL_CAP_SEVERE,
  ANNUAL_CAP_EXISTING,
} from "@/components/InstitutionSubsidyCalculator";
import {
  BARTHEL_ITEMS,
  BARTHEL_MAX,
  barthelBand,
} from "@/components/BarthelSelfCheck";

describe("住宿式機構補助試算器（115 年度現制）", () => {
  it("案例 1：中重度、一般護理之家、月費 45,000、12 個月", () => {
    // 手算：月補助 15,000；年補助 = min(15,000×12=180,000, 上限 180,000, 自付 540,000) = 180,000
    // 月缺口 = 45,000−15,000 = 30,000；年缺口 = 540,000−180,000 = 360,000
    const r = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "cms4",
      monthlyFee: 45000,
      months: 12,
      transition: false,
    });
    expect(r.eligible).toBe(true);
    expect(r.monthlySubsidy).toBe(15000);
    expect(r.annualSubsidy).toBe(180000);
    expect(r.monthlyGap).toBe(30000);
    expect(r.annualGap).toBe(360000);
    expect(MONTHLY_SEVERE).toBe(15000);
    expect(ANNUAL_CAP_SEVERE).toBe(180000);
  });

  it("案例 2：既有住民、月費 38,000、12 個月", () => {
    // 手算：月補助 5,000；年補助 = min(5,000×12=60,000, 上限 60,000, 自付 456,000) = 60,000
    // 月缺口 = 38,000−5,000 = 33,000；年缺口 = 456,000−60,000 = 396,000
    const r = calcInstitutionSubsidy({
      institution: "elderly",
      qualify: "existing",
      monthlyFee: 38000,
      months: 12,
      transition: false,
    });
    expect(r.eligible).toBe(true);
    expect(r.monthlySubsidy).toBe(5000);
    expect(r.annualSubsidy).toBe(60000);
    expect(r.monthlyGap).toBe(33000);
    expect(r.annualGap).toBe(396000);
    expect(MONTHLY_EXISTING).toBe(5000);
    expect(ANNUAL_CAP_EXISTING).toBe(60000);
  });

  it("案例 3：自付額上限——中重度、月費 10,000、12 個月，補助不得超過自付", () => {
    // 手算：年補助 = min(180,000, 180,000, 自付 120,000) = 120,000；月缺口 = max(0, 10,000−15,000) = 0
    const r = calcInstitutionSubsidy({
      institution: "ltc",
      qualify: "disability",
      monthlyFee: 10000,
      months: 12,
      transition: false,
    });
    expect(r.annualSubsidy).toBe(120000);
    expect(r.monthlyGap).toBe(0);
    expect(r.annualGap).toBe(0);
  });

  it("案例 4：115 年度過渡保障——中重度、月費 45,000、10 個月", () => {
    // 手算：1–8 月保障 120,000 ＋ 9 月起 2 個月×15,000 = 150,000；未逾 180,000 上限、自付 450,000
    const r = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "cms4",
      monthlyFee: 45000,
      months: 10,
      transition: true,
    });
    expect(r.annualSubsidy).toBe(150000);
    expect(r.monthlyGap).toBe(30000);
  });

  it("不適用：非指定機構類型／三類資格皆非", () => {
    const a = calcInstitutionSubsidy({
      institution: "other",
      qualify: "cms4",
      monthlyFee: 45000,
      months: 12,
      transition: false,
    });
    expect(a.eligible).toBe(false);
    expect(a.annualSubsidy).toBe(0);
    expect(a.ineligibleReason).toBeTruthy();

    const b = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "none",
      monthlyFee: 45000,
      months: 12,
      transition: false,
    });
    expect(b.eligible).toBe(false);
    expect(b.annualSubsidy).toBe(0);
    expect(b.ineligibleReason).toBeTruthy();
  });

  it("邊界：月費 0、月數 0、負數輸入、月數超過 12 個月", () => {
    const zero = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "cms4",
      monthlyFee: 0,
      months: 0,
      transition: false,
    });
    expect(zero.annualSubsidy).toBe(0);
    expect(zero.annualGap).toBe(0);

    const negative = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "cms4",
      monthlyFee: -5000,
      months: -3,
      transition: false,
    });
    expect(negative.annualSubsidy).toBe(0);
    expect(negative.annualGap).toBe(0);

    // 月數 15 個月箝制為 12 個月：年補助 = min(180,000, 180,000, 540,000) = 180,000
    const clamped = calcInstitutionSubsidy({
      institution: "nursing",
      qualify: "cms4",
      monthlyFee: 45000,
      months: 15,
      transition: false,
    });
    expect(clamped.annualSubsidy).toBe(180000);
  });
});

describe("巴氏量表自評工具", () => {
  it("十項權重加總為滿分 100，且每項滿分等於其最高選項分數", () => {
    expect(BARTHEL_ITEMS).toHaveLength(10);
    expect(BARTHEL_MAX).toBe(100);
    for (const item of BARTHEL_ITEMS) {
      expect(Math.max(...item.options.map((o) => o.score))).toBe(item.max);
    }
    // 權重明細：移位 15、行走 15、進食／穿衣／大便／小便／如廁／樓梯各 10、洗澡／修飾各 5
    const byId = Object.fromEntries(BARTHEL_ITEMS.map((i) => [i.id, i.max]));
    expect(byId).toEqual({
      feeding: 10,
      bathing: 5,
      grooming: 5,
      dressing: 10,
      bowels: 10,
      bladder: 10,
      toilet: 10,
      transfer: 15,
      mobility: 15,
      stairs: 10,
    });
  });

  it("情境 1：滿分——十項皆獨立，總分 100，完全獨立", () => {
    // 手算：10+5+5+10+10+10+10+15+15+10 = 100
    const total = BARTHEL_ITEMS.reduce(
      (sum, item) => sum + Math.max(...item.options.map((o) => o.score)),
      0
    );
    expect(total).toBe(100);
    expect(barthelBand(100).title).toBe("完全獨立");
  });

  it("情境 2：零分——十項皆完全依賴，總分 0，完全依賴", () => {
    const total = BARTHEL_ITEMS.reduce(
      (sum, item) => sum + Math.min(...item.options.map((o) => o.score)),
      0
    );
    expect(total).toBe(0);
    expect(barthelBand(0).title).toBe("完全依賴");
  });

  it("情境 3：部分依賴——混合選項，總分 65，中度依賴", () => {
    // 手算：進食 10＋洗澡 0＋修飾 5＋穿衣 5＋大便 10＋小便 5＋如廁 5＋移位 10＋行走 10＋樓梯 5 = 65
    const picked = [10, 0, 5, 5, 10, 5, 5, 10, 10, 5];
    const total = picked.reduce((a, b) => a + b, 0);
    expect(total).toBe(65);
    expect(barthelBand(65).title).toBe("中度依賴");
    // 驗證這組選項確實存在於各項選項中
    BARTHEL_ITEMS.forEach((item, i) => {
      expect(item.options.map((o) => o.score)).toContain(picked[i]);
    });
  });

  it("分數區間邊界：20／21／60／61／90／91／99／100", () => {
    expect(barthelBand(20).title).toBe("完全依賴");
    expect(barthelBand(21).title).toBe("嚴重依賴");
    expect(barthelBand(60).title).toBe("嚴重依賴");
    expect(barthelBand(61).title).toBe("中度依賴");
    expect(barthelBand(90).title).toBe("中度依賴");
    expect(barthelBand(91).title).toBe("輕度依賴");
    expect(barthelBand(99).title).toBe("輕度依賴");
    expect(barthelBand(100).title).toBe("完全獨立");
  });
});
