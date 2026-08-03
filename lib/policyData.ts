/**
 * 2026 台灣長照與家庭財務政策單一資料來源。
 *
 * 金額只在此檔維護；頁面、計算器與結構化資料應引用這裡的常數，
 * 避免法規更新後出現同站不同答案。
 */

export const POLICY_VERSION = "2026-07-22";
export const POLICY_EFFECTIVE_DATE = "2026-07-01";

export const POLICY_SOURCES = {
  longTermCare: "https://1966.gov.tw/LTC/cp-6533-70777-207.html",
  longTermCareAmendment: "https://www.mohw.gov.tw/cp-16-82811-1.html",
  assistiveDevices: "https://1966.gov.tw/LTC/cp-6453-69940-207.html",
  longTermCareTax:
    "https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=194e9b645df149a98445eed9c1ee8f43",
  nationalPension: "https://www.bli.gov.tw/0013597.html",
  foreignCaregiverWage:
    "https://fw.wda.gov.tw/wda-employer/home/faq/2c95efb39c3f10e4019c4000d5ab0213",
} as const;

export type TransportRegion = "region1" | "region2" | "region3" | "region4";
export type AssistiveDeviceGroup = "group1" | "group2";

export const TRANSPORT_REGIONS: Record<
  TransportRegion,
  { label: string; monthlyQuota: number; description: string }
> = {
  region1: { label: "第一區", monthlyQuota: 1680, description: "依居住地鄉鎮分區" },
  region2: { label: "第二區", monthlyQuota: 1840, description: "依居住地鄉鎮分區" },
  region3: { label: "第三區", monthlyQuota: 2000, description: "依居住地鄉鎮分區" },
  region4: { label: "第四區", monthlyQuota: 2400, description: "原鄉、離島等指定地區" },
};

export const ASSISTIVE_DEVICE_GROUPS: Record<
  AssistiveDeviceGroup,
  { label: string; threeYearQuota: number; description: string }
> = {
  group1: {
    label: "第一組（一般輔具／居家改善）",
    threeYearQuota: 40000,
    description: "傳統輔具購置與居家無障礙改善",
  },
  group2: {
    label: "第二組（智慧輔具租賃）",
    threeYearQuota: 60000,
    description: "指定輔具購置、智慧輔具租賃及居家改善；適用資格以核定為準",
  },
};

export const CMS_CARE_QUOTAS = {
  1: 0,
  2: 10020,
  3: 15460,
  4: 18580,
  5: 24100,
  6: 28070,
  7: 32090,
  8: 36180,
} as const;

export const RESPITE_YEARLY_QUOTAS = {
  standard: 32340,
  highNeed: 48510,
} as const;

export const CO_PAY_RATES = {
  general: { care: 0.16, transport: 0.21, device: 0.3 },
  midLow: { care: 0.05, transport: 0.07, device: 0.1 },
  low: { care: 0, transport: 0, device: 0 },
} as const;

export const TAX_POLICY_2025_INCOME = {
  dependentExemptionUnder70: 97000,
  dependentExemptionOver70: 145500,
  disabilityDeduction: 218000,
  longTermCareDeduction: 180000,
} as const;

export const NATIONAL_PENSION_2026 = {
  monthlyInsuredAmount: 21103,
  premiumRate: 0.105,
  generalMonthlyCopay: 1329,
} as const;

export const FOREIGN_CAREGIVER_2026 = {
  contractMonthlyWage: 20000,
  employmentStabilityFee: 2000,
  employerNhiEstimate: 1428,
} as const;

export function getRespiteYearlyQuota(cmsLevel: number): number {
  if (cmsLevel >= 7 && cmsLevel <= 8) return RESPITE_YEARLY_QUOTAS.highNeed;
  if (cmsLevel >= 2 && cmsLevel <= 6) return RESPITE_YEARLY_QUOTAS.standard;
  return 0;
}
