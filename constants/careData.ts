// constants/careData.ts
// 2026 年台灣長照 3.0 補助規則 (高雄市都會區標準)

export type IncomeStatus = "general" | "midLow" | "low";
export type CareType = "home-care" | "day-care" | "foreign-caregiver" | "institution";

export interface CMSLevelData {
  level: number;
  name: string;
  description: string;
}

export interface SubsidyRuleData {
  cmsLevel: number;
  // 第一包：照顧及專業服務 (月額)
  careServiceMonthly: number;
  careServiceCopay: {
    general: number;    // 一般戶 16%
    midLow: number;     // 中低收入戶 5%
    low: number;        // 低收入戶 0%
  };
  // 第二包：交通接送 (月額，CMS 4級以上)
  transportMonthly: number | null;
  transportCopay: {
    general: number;    // 一般戶 21%
    midLow: number;     // 中低收入戶 7%
    low: number;        // 低收入戶 0%
  } | null;
  // 第三包：輔具及無障礙改造 (三年額度)
  assistiveDeviceQuota: number | null;
  assistiveDeviceCopay: {
    general: number;    // 一般戶 30%
    midLow: number;     // 中低收入戶 10%
    low: number;        // 低收入戶 0%
  } | null;
  // 第四包：喘息服務 (年額)
  respiteYearly: number | null;
  respiteCopay: {
    general: number;    // 一般戶 16%
    midLow: number;     // 中低收入戶 5%
    low: number;        // 低收入戶 0%
  } | null;
}

// CMS 失能等級定義
export const CMS_LEVELS: CMSLevelData[] = [
  {
    level: 1,
    name: "輕度失能",
    description: "日常生活活動能力輕微受限",
  },
  {
    level: 2,
    name: "輕度失能",
    description: "日常生活活動能力輕微受限",
  },
  {
    level: 3,
    name: "中度失能",
    description: "日常生活活動能力中度受限",
  },
  {
    level: 4,
    name: "中度失能",
    description: "日常生活活動能力中度受限",
  },
  {
    level: 5,
    name: "重度失能",
    description: "日常生活活動能力重度受限",
  },
  {
    level: 6,
    name: "重度失能",
    description: "日常生活活動能力重度受限",
  },
  {
    level: 7,
    name: "極重度失能",
    description: "日常生活活動能力極度受限",
  },
  {
    level: 8,
    name: "極重度失能",
    description: "日常生活活動能力極度受限",
  },
];

// 長照 3.0 補助規則 (高雄市都會區)
export const SUBSIDY_RULES: SubsidyRuleData[] = [
  {
    cmsLevel: 1,
    careServiceMonthly: 0,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: null,
    transportCopay: null,
    assistiveDeviceQuota: null,
    assistiveDeviceCopay: null,
    respiteYearly: null,
    respiteCopay: null,
  },
  {
    cmsLevel: 2,
    careServiceMonthly: 10020,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: null,
    transportCopay: null,
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 32340,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 3,
    careServiceMonthly: 15460,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: null,
    transportCopay: null,
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 32340,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 4,
    careServiceMonthly: 18580,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: 1680,
    transportCopay: { general: 0.21, midLow: 0.07, low: 0 },
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 32340,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 5,
    careServiceMonthly: 24100,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: 1680,
    transportCopay: { general: 0.21, midLow: 0.07, low: 0 },
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 32340,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 6,
    careServiceMonthly: 28070,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: 1680,
    transportCopay: { general: 0.21, midLow: 0.07, low: 0 },
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 32340,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 7,
    careServiceMonthly: 32090,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: 1680,
    transportCopay: { general: 0.21, midLow: 0.07, low: 0 },
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 48510,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
  {
    cmsLevel: 8,
    careServiceMonthly: 36180,
    careServiceCopay: { general: 0.16, midLow: 0.05, low: 0 },
    transportMonthly: 1680,
    transportCopay: { general: 0.21, midLow: 0.07, low: 0 },
    assistiveDeviceQuota: 40000,
    assistiveDeviceCopay: { general: 0.3, midLow: 0.1, low: 0 },
    respiteYearly: 48510,
    respiteCopay: { general: 0.16, midLow: 0.05, low: 0 },
  },
];

// 機構住宿式服務補助方案 (全日型住宿機構)
export const INSTITUTION_SUBSIDY = {
  yearlySubsidy: 120000,
  monthlySubsidy: 10000,
  estimatedMonthlyFee: { min: 35000, max: 45000 },
};

// 輔助函數：根據 CMS 等級取得補助規則
export function getSubsidyRule(cmsLevel: number): SubsidyRuleData | null {
  return SUBSIDY_RULES.find((rule) => rule.cmsLevel === cmsLevel) || null;
}

// 輔助函數：根據 CMS 等級取得等級資訊
export function getCMSLevelInfo(cmsLevel: number): CMSLevelData | null {
  return CMS_LEVELS.find((level) => level.level === cmsLevel) || null;
}
