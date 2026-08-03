// constants/careData.ts
// 2026 年台灣長照 3.0 補助規則（未指定分區／組別時採第一區、第一組）

import {
  ASSISTIVE_DEVICE_GROUPS,
  CMS_CARE_QUOTAS,
  CO_PAY_RATES,
  TRANSPORT_REGIONS,
  getRespiteYearlyQuota,
} from "@/lib/policyData";

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

const careCopay = {
  general: CO_PAY_RATES.general.care,
  midLow: CO_PAY_RATES.midLow.care,
  low: CO_PAY_RATES.low.care,
};
const transportCopay = {
  general: CO_PAY_RATES.general.transport,
  midLow: CO_PAY_RATES.midLow.transport,
  low: CO_PAY_RATES.low.transport,
};
const deviceCopay = {
  general: CO_PAY_RATES.general.device,
  midLow: CO_PAY_RATES.midLow.device,
  low: CO_PAY_RATES.low.device,
};

export const SUBSIDY_RULES: SubsidyRuleData[] = CMS_LEVELS.map(({ level }) => {
  const eligible = level >= 2;
  const hasTransport = level >= 4;
  return {
    cmsLevel: level,
    careServiceMonthly: CMS_CARE_QUOTAS[level as keyof typeof CMS_CARE_QUOTAS],
    careServiceCopay: careCopay,
    transportMonthly: hasTransport ? TRANSPORT_REGIONS.region1.monthlyQuota : null,
    transportCopay: hasTransport ? transportCopay : null,
    assistiveDeviceQuota: eligible ? ASSISTIVE_DEVICE_GROUPS.group1.threeYearQuota : null,
    assistiveDeviceCopay: eligible ? deviceCopay : null,
    respiteYearly: eligible ? getRespiteYearlyQuota(level) : null,
    respiteCopay: eligible ? careCopay : null,
  };
});

// 機構住宿式服務補助方案 (全日型住宿機構)
// 衛福部自 112 年（2023）起取消排富條款
// 適用條件：CMS 4 級以上（或中度以上身障），入住滿 180 天
// 資料來源：https://1966.gov.tw/LTC/cp-6457-69925-207.html
export const INSTITUTION_SUBSIDY = {
  yearlySubsidy: 120000,      // CMS 4+ 每人每年最高 12 萬
  monthlySubsidy: 10000,      // 月均 1 萬
  // 既有住民過渡條款（111年底前已入住、CMS 未達 4 級）
  legacyYearlySubsidy: 60000, // 每人每年最高 6 萬
  legacyMonthlySubsidy: 5000, // 月均 5,000
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
