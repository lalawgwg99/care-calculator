// lib/careCalculator.ts
import {
  getSubsidyRule,
  IncomeStatus,
  CareType,
  INSTITUTION_SUBSIDY,
} from "@/constants/careData";

export interface CareBudgetResult {
  totalSubsidyMonthly: number;
  outOfPocketMonthly: number;
  hasTransportation: boolean;
  assistiveDeviceQuota: number;
  respiteMonthly: number;
  breakdown: {
    careServiceSubsidy: number;
    careServiceCopay: number;
    transportSubsidy: number;
    transportCopay: number;
    respiteSubsidy: number;
    respiteCopay: number;
  };
  institutionInfo?: {
    yearlySubsidy: number;
    monthlySubsidy: number;
    estimatedMonthlyFee: { min: number; max: number };
  };
}

/**
 * 核心計算函數：根據失能等級、收入身份、照顧方式計算政府補助與自付額
 * @param cmsLevel - 失能等級 (1-8)
 * @param incomeStatus - 收入身份 ("general" | "mid-low" | "low")
 * @param careType - 照顧方式 ("home-care" | "day-care" | "foreign-caregiver" | "institution")
 * @returns 包含補助額度、自付額、詳細明細的結果物件
 */
export function calculateCareBudget(
  cmsLevel: number,
  incomeStatus: IncomeStatus,
  careType: CareType
): CareBudgetResult {
  // 驗證輸入
  if (cmsLevel < 1 || cmsLevel > 8) {
    throw new Error("CMS 等級必須介於 1-8");
  }

  // 特殊情況：全日型住宿機構
  // 依衛福部 2023 年公告（取消排富條款）：
  //   - CMS 4 級以上（或中度以上身障）：每年最高 $120,000（月均 $10,000）
  //   - 既有住民（111年底前已入住，CMS 未達 4 級）：每年最高 $60,000（月均 $5,000）
  //   - 入住需滿 180 天（未滿則按月計算）
  //   - 資料來源：https://1966.gov.tw/LTC/cp-6457-69925-207.html
  if (careType === "institution") {
    // CMS 4+ 適用 12 萬/年補助；CMS 1-3 新申請者不適用此補助
    const monthlySubsidy = cmsLevel >= 4 ? INSTITUTION_SUBSIDY.monthlySubsidy : 0;
    const avgMonthlyFee = INSTITUTION_SUBSIDY.estimatedMonthlyFee.min;
    const outOfPocket = Math.max(0, avgMonthlyFee - monthlySubsidy);

    return {
      totalSubsidyMonthly: monthlySubsidy,
      outOfPocketMonthly: outOfPocket,
      hasTransportation: false,
      assistiveDeviceQuota: 0,
      respiteMonthly: 0,
      breakdown: {
        careServiceSubsidy: 0,
        careServiceCopay: 0,
        transportSubsidy: 0,
        transportCopay: 0,
        respiteSubsidy: 0,
        respiteCopay: 0,
      },
      institutionInfo: cmsLevel >= 4 ? INSTITUTION_SUBSIDY : undefined,
    };
  }

  const rule = getSubsidyRule(cmsLevel);
  if (!rule) {
    throw new Error(`找不到 CMS 等級 ${cmsLevel} 的補助規則`);
  }

  // 初始化明細
  let breakdown = {
    careServiceSubsidy: 0,
    careServiceCopay: 0,
    transportSubsidy: 0,
    transportCopay: 0,
    respiteSubsidy: 0,
    respiteCopay: 0,
  };

  // ========== 第一包：照顧及專業服務 ==========
  let careServiceTotal = rule.careServiceMonthly;

  // 邊緣案例：聘僱外籍看護工，補助額度打 3 折
  if (careType === "foreign-caregiver") {
    careServiceTotal = Math.floor(careServiceTotal * 0.3);
  }

  const careServiceCopayRate = rule.careServiceCopay[incomeStatus];
  const careServiceCopay = Math.floor(careServiceTotal * careServiceCopayRate);
  const careServiceSubsidy = careServiceTotal - careServiceCopay;

  breakdown.careServiceSubsidy = careServiceSubsidy;
  breakdown.careServiceCopay = careServiceCopay;

  // ========== 第二包：交通接送服務 ==========
  let transportTotal = 0;
  let transportSubsidy = 0;
  let transportCopay = 0;
  const hasTransportation = rule.transportMonthly !== null && cmsLevel >= 4;

  if (hasTransportation && rule.transportCopay) {
    transportTotal = rule.transportMonthly!;
    const transportCopayRate = rule.transportCopay[incomeStatus];
    transportCopay = Math.floor(transportTotal * transportCopayRate);
    transportSubsidy = transportTotal - transportCopay;
  }

  breakdown.transportSubsidy = transportSubsidy;
  breakdown.transportCopay = transportCopay;

  // ========== 第四包：喘息服務 (攤提到月額) ==========
  let respiteTotal = 0;
  let respiteSubsidy = 0;
  let respiteCopay = 0;

  if (rule.respiteYearly !== null && rule.respiteCopay) {
    respiteTotal = Math.floor(rule.respiteYearly / 12);
    const respiteCopayRate = rule.respiteCopay[incomeStatus];
    respiteCopay = Math.floor(respiteTotal * respiteCopayRate);
    respiteSubsidy = respiteTotal - respiteCopay;
  }

  breakdown.respiteSubsidy = respiteSubsidy;
  breakdown.respiteCopay = respiteCopay;

  // ========== 計算總額 ==========
  const totalSubsidyMonthly = careServiceSubsidy + transportSubsidy + respiteSubsidy;
  const outOfPocketMonthly = careServiceCopay + transportCopay + respiteCopay;

  // ========== 第三包：輔具及無障礙改造 (三年額度，獨立顯示) ==========
  let assistiveDeviceQuota = 0;
  if (rule.assistiveDeviceQuota !== null && cmsLevel >= 2) {
    assistiveDeviceQuota = rule.assistiveDeviceQuota;
  }

  return {
    totalSubsidyMonthly,
    outOfPocketMonthly,
    hasTransportation,
    assistiveDeviceQuota,
    respiteMonthly: respiteSubsidy + respiteCopay,
    breakdown,
  };
}

/**
 * 格式化金額為台幣字串
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
  }).format(amount);
}
