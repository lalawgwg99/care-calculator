/**
 * lib/hiddenSavingsCalculator.ts
 * 隱形省下的錢（減免與退稅）計算模組
 *
 * 四大類：
 * 1. 健保費減免（年齡減免 + 身心障礙減免）
 * 2. 勞保/國保費減免（身心障礙保費補助）
 * 3. 稅務扣除額（扶養免稅額 + 身障扣除 + 長照扣除）
 * 4. 日常生活減免（牌照稅、敬老卡、輔具等）
 */

import {
  ASSISTIVE_DEVICE_GROUPS,
  NATIONAL_PENSION_2026,
  TAX_POLICY_2025_INCOME,
} from "@/lib/policyData";

// ====== 型別定義 ======

export type DisabilityLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'profound';
export type TaxBracket = 0.05 | 0.12 | 0.20 | 0.30 | 0.40;

export interface ElderlyProfile {
  age: number;                        // 長輩年齡
  isIndigenous: boolean;              // 是否為原住民
  city: string;                       // 設籍縣市
  disabilityLevel: DisabilityLevel;   // 身心障礙等級
  hasLongTermCareQualification: boolean; // 是否符合長照資格（CMS 2+）
  isStillInsuredByLabor: boolean;     // 發生失能時是否仍在勞保加保期間
  hasVehicleUnder2400cc: boolean;     // 同戶是否有 2400cc 以下汽車
}

export interface TaxPayerProfile {
  taxBracket: TaxBracket;             // 子女適用稅率
  isClaiming: boolean;                // 是否列報扶養
}

export interface HiddenSavingsInput {
  elderly: ElderlyProfile;
  taxPayer: TaxPayerProfile;
}

export interface SavingsBreakdown {
  // 一、健保費減免
  nhiAgeSavingsMonthly: number;       // 年齡減免月額
  nhiDisabilitySavingsMonthly: number; // 身障減免月額
  nhiTotalYearly: number;

  // 二、勞保/國保減免
  laborInsuranceSavingsMonthly: number;
  laborInsuranceTotalYearly: number;
  laborDisabilityBenefitAlert: boolean; // 是否顯示失能給付提醒

  // 三、稅務扣除
  taxDependentExemption: number;      // 扶養親屬免稅額
  taxDisabilityDeduction: number;     // 身障特別扣除額
  taxLongTermCareDeduction: number;   // 長照特別扣除額
  taxTotalDeduction: number;          // 扣除總額
  taxActualSaving: number;            // 實際省下的稅金

  // 四、日常生活減免
  vehicleTaxSavingsYearly: number;    // 牌照稅減免
  seniorCardMonthly: number;          // 敬老卡/愛心卡每月點數
  parkingBenefit: boolean;            // 身障停車優惠
  assistiveDeviceQuota: number;       // 輔具補助額度（每3年）

  // 總計
  totalYearlySavings: number;         // 每年總計省下
  totalMonthlySavings: number;        // 每月均攤省下
}

// ====== 常數定義 ======

// 健保高齡與身障補助會依投保類別、眷口及地方資格而異。
// 未蒐集完整投保條件前不自動估金額，避免把地方方案誤當全國固定補助。
const NHI_AGE_SUBSIDY_MONTHLY = 0;
const NHI_BASE_PREMIUM_MONTHLY = 0;

/** 身障健保減免比例 */
const DISABILITY_NHI_DISCOUNT: Record<DisabilityLevel, number> = {
  none: 0,
  mild: 0.25,
  moderate: 0.50,
  severe: 1.00,
  profound: 1.00,
};

/** 身障勞保/國保減免比例（同健保） */
const DISABILITY_LABOR_DISCOUNT: Record<DisabilityLevel, number> = {
  none: 0,
  mild: 0.25,
  moderate: 0.50,
  severe: 1.00,
  profound: 1.00,
};

/** 國民年金月保費（2026 年標準） */
const NATIONAL_PENSION_MONTHLY = NATIONAL_PENSION_2026.generalMonthlyCopay;

/** 稅務扣除額（2025 年度報稅，2026 年 5 月申報適用） */
const TAX_DEPENDENT_EXEMPTION_UNDER70 = TAX_POLICY_2025_INCOME.dependentExemptionUnder70;
const TAX_DEPENDENT_EXEMPTION_OVER70 = TAX_POLICY_2025_INCOME.dependentExemptionOver70;
const TAX_DISABILITY_DEDUCTION = TAX_POLICY_2025_INCOME.disabilityDeduction;
const TAX_LONG_TERM_CARE_DEDUCTION = TAX_POLICY_2025_INCOME.longTermCareDeduction;

// 牌照稅免徵另涉及車主、駕照、同戶與每戶一車等條件，不以排氣量單獨判定。
const VEHICLE_LICENSE_TAX_YEARLY = 0;

/**
 * 各縣市健保年齡減免資格與敬老卡額度
 * eligible: 是否有地方政府健保補助
 * seniorCardMonthly: 敬老卡每月點數（元）
 */
const SUPPORTED_CITY_NAMES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市',
  '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義市',
  '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣',
] as const;
const CITY_BENEFITS: Record<string, { nhiEligible: boolean; seniorCardMonthly: number }> =
  Object.fromEntries(SUPPORTED_CITY_NAMES.map((city) => [city, { nhiEligible: false, seniorCardMonthly: 0 }]));

/** 所有支援的縣市列表（供前端下拉選單使用） */
export const SUPPORTED_CITIES = Object.keys(CITY_BENEFITS);

/** 稅率選項（供前端下拉選單使用） */
export const TAX_BRACKET_OPTIONS: { value: TaxBracket; label: string; description: string }[] = [
  { value: 0.05, label: '5%', description: '所得淨額 59 萬以下' },
  { value: 0.12, label: '12%', description: '所得淨額 59～133 萬' },
  { value: 0.20, label: '20%', description: '所得淨額 133～266 萬' },
  { value: 0.30, label: '30%', description: '所得淨額 266～498 萬' },
  { value: 0.40, label: '40%', description: '所得淨額 498 萬以上' },
];

/** 身障等級選項（供前端下拉選單使用） */
export const DISABILITY_LEVEL_OPTIONS: { value: DisabilityLevel; label: string }[] = [
  { value: 'none', label: '無身障證明' },
  { value: 'mild', label: '輕度' },
  { value: 'moderate', label: '中度' },
  { value: 'severe', label: '重度' },
  { value: 'profound', label: '極重度' },
];

// ====== 核心計算函數 ======

/**
 * 計算隱形省下的錢
 */
export function calculateHiddenSavings(input: HiddenSavingsInput): SavingsBreakdown {
  const { elderly, taxPayer } = input;

  // ========== 一、健保費減免 ==========
  const ageThreshold = elderly.isIndigenous ? 55 : 65;
  const cityBenefits = CITY_BENEFITS[elderly.city];

  // 年齡減免：65 歲以上（原住民 55 歲），且該縣市有提供
  const nhiAgeSavingsMonthly =
    elderly.age >= ageThreshold && cityBenefits?.nhiEligible
      ? NHI_AGE_SUBSIDY_MONTHLY
      : 0;

  // 身障減免：依等級按比例減免
  const disabilityDiscount = DISABILITY_NHI_DISCOUNT[elderly.disabilityLevel];
  const nhiDisabilitySavingsMonthly = Math.round(NHI_BASE_PREMIUM_MONTHLY * disabilityDiscount);

  // 年齡減免和身障減免取較高者（不重複計算）
  const nhiEffectiveMonthly = Math.max(nhiAgeSavingsMonthly, nhiDisabilitySavingsMonthly);
  const nhiTotalYearly = nhiEffectiveMonthly * 12;

  // ========== 二、勞保/國保減免 ==========
  const laborDiscount = DISABILITY_LABOR_DISCOUNT[elderly.disabilityLevel];
  const laborInsuranceSavingsMonthly = Math.round(NATIONAL_PENSION_MONTHLY * laborDiscount);
  const laborInsuranceTotalYearly = laborInsuranceSavingsMonthly * 12;
  const laborDisabilityBenefitAlert = elderly.isStillInsuredByLabor;

  // ========== 三、稅務扣除額 ==========
  let taxTotalDeduction = 0;

  // 扶養親屬免稅額
  const taxDependentExemption = taxPayer.isClaiming
    ? (elderly.age >= 70 ? TAX_DEPENDENT_EXEMPTION_OVER70 : TAX_DEPENDENT_EXEMPTION_UNDER70)
    : 0;
  taxTotalDeduction += taxDependentExemption;

  // 身障特別扣除額
  const taxDisabilityDeduction =
    taxPayer.isClaiming && elderly.disabilityLevel !== 'none'
      ? TAX_DISABILITY_DEDUCTION
      : 0;
  taxTotalDeduction += taxDisabilityDeduction;

  // 長照特別扣除額
  const taxLongTermCareDeduction =
    taxPayer.isClaiming && elderly.hasLongTermCareQualification && taxPayer.taxBracket < 0.2
      ? TAX_LONG_TERM_CARE_DEDUCTION
      : 0;
  taxTotalDeduction += taxLongTermCareDeduction;

  // 實際省下的稅金 = 扣除總額 × 適用稅率
  const taxActualSaving = Math.round(taxTotalDeduction * taxPayer.taxBracket);

  // ========== 四、日常生活減免 ==========
  // 牌照稅免徵
  const vehicleTaxSavingsYearly =
    elderly.disabilityLevel !== 'none' && elderly.hasVehicleUnder2400cc
      ? VEHICLE_LICENSE_TAX_YEARLY
      : 0;

  // 敬老卡/愛心卡
  const seniorCardMonthly =
    elderly.age >= ageThreshold && cityBenefits
      ? cityBenefits.seniorCardMonthly
      : 0;

  // 身障停車優惠
  const parkingBenefit = false;

  // 未提供組別時採第一組 4 萬的保守估算；第二組最高 6 萬於主試算選擇。
  const assistiveDeviceQuota = elderly.hasLongTermCareQualification
    ? ASSISTIVE_DEVICE_GROUPS.group1.threeYearQuota
    : 0;

  // ========== 總計 ==========
  const totalYearlySavings =
    nhiTotalYearly +
    laborInsuranceTotalYearly +
    taxActualSaving +
    vehicleTaxSavingsYearly +
    seniorCardMonthly * 12 +
    Math.round(assistiveDeviceQuota / 3); // 輔具攤提到每年

  const totalMonthlySavings = Math.round(totalYearlySavings / 12);

  return {
    nhiAgeSavingsMonthly,
    nhiDisabilitySavingsMonthly,
    nhiTotalYearly,
    laborInsuranceSavingsMonthly,
    laborInsuranceTotalYearly,
    laborDisabilityBenefitAlert,
    taxDependentExemption,
    taxDisabilityDeduction,
    taxLongTermCareDeduction,
    taxTotalDeduction,
    taxActualSaving,
    vehicleTaxSavingsYearly,
    seniorCardMonthly,
    parkingBenefit,
    assistiveDeviceQuota,
    totalYearlySavings,
    totalMonthlySavings,
  };
}

/**
 * 取得身障等級中文名稱
 */
export function getDisabilityLevelName(level: DisabilityLevel): string {
  const names: Record<DisabilityLevel, string> = {
    none: '無',
    mild: '輕度',
    moderate: '中度',
    severe: '重度',
    profound: '極重度',
  };
  return names[level];
}
