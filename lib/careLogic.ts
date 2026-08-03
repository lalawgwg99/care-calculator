import {
  ASSISTIVE_DEVICE_GROUPS,
  CMS_CARE_QUOTAS,
  CO_PAY_RATES,
  POLICY_VERSION,
  TRANSPORT_REGIONS,
  getRespiteYearlyQuota,
  type AssistiveDeviceGroup,
  type TransportRegion,
} from "@/lib/policyData";

/**
 * lib/careLogic.ts
 * 長照 3.0 核心計算邏輯
 * 
 * 這是最核心、最容易出錯的「長照四包錢法規與計算邏輯」
 * 中央政策金額集中於 policyData，實際資格與服務仍以照管中心核定為準。
 */

export type CMSLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type IncomeStatus = 'general' | 'mid-low' | 'low';
export type CareType = 'home-care' | 'day-care' | 'foreign-caregiver' | 'institution';

export interface CareResult {
  totalSubsidyMonthly: number;  // 政府每月出多少
  outOfPocketMonthly: number;   // 民眾每月自付額
  hasTransportation: boolean;   // 是否有交通接送資格
  assistiveDeviceQuota: number; // 輔具額度 (3年一次)
  transportQuotaMonthly: number;
  transportRegion: TransportRegion;
  assistiveDeviceGroup: AssistiveDeviceGroup;
  policyVersion: string;
}

export interface CareCalculationOptions {
  transportRegion?: TransportRegion;
  assistiveDeviceGroup?: AssistiveDeviceGroup;
}

/**
 * 2026 長照 3.0 第一包錢：照顧及專業服務 (每月額度)
 * 
 * 資料來源：衛生福利部長期照顧司
 * 最後核對：2026-07-22
 */
const CMS_QUOTAS: Record<CMSLevel, number> = CMS_CARE_QUOTAS;

/**
 * 身份自負額比例
 * 
 * base: 第一包（照顧服務）與第四包（喘息服務）的自負比例
 * transport: 第二包（交通接送）的自負比例
 * device: 第三包（輔具及無障礙改造）的自負比例
 */
const CARE_CO_PAY_RATES: Record<IncomeStatus, { base: number; transport: number; device: number }> = {
  'general': { base: CO_PAY_RATES.general.care, transport: CO_PAY_RATES.general.transport, device: CO_PAY_RATES.general.device },
  'mid-low': { base: CO_PAY_RATES.midLow.care, transport: CO_PAY_RATES.midLow.transport, device: CO_PAY_RATES.midLow.device },
  'low': { base: CO_PAY_RATES.low.care, transport: CO_PAY_RATES.low.transport, device: CO_PAY_RATES.low.device },
};

/**
 * 核心計算函數：長照 3.0 財務試算
 * 
 * @param cmsLevel - 失能等級 (1-8)
 * @param incomeStatus - 收入身份 ('general' | 'mid-low' | 'low')
 * @param careType - 照顧方式 ('home-care' | 'day-care' | 'foreign-caregiver' | 'institution')
 * @returns CareResult - 包含政府補助、自付額、交通接送資格、輔具額度
 * 
 * @example
 * ```typescript
 * const result = calculateCareBudget(5, 'general', 'home-care');
 * console.log(result.totalSubsidyMonthly); // 政府每月補助
 * console.log(result.outOfPocketMonthly);  // 民眾每月自付額
 * ```
 */
export function calculateCareBudget(
  cmsLevel: CMSLevel,
  incomeStatus: IncomeStatus,
  careType: CareType,
  options: CareCalculationOptions = {}
): CareResult {
  const transportRegion = options.transportRegion ?? "region1";
  const assistiveDeviceGroup = options.assistiveDeviceGroup ?? "group1";
  const transportQuotaMonthly = TRANSPORT_REGIONS[transportRegion].monthlyQuota;
  // ========================================================================
  // 特殊情況 1：全日型住宿機構
  // ========================================================================
  // 住宿式機構不適用長照四包錢，改用「機構住宿式服務使用者補助方案」
  // 依衛福部 112 年（2023）公告，已取消排富條款：
  //   - CMS 4 級以上（或中度以上身障）且入住滿 180 天
  //   - 年度最高補助：$120,000（月均 $10,000）
  //   - 既有住民（111年底前已入住、CMS < 4）：年度最高 $60,000（月均 $5,000）
  //   - 方案適用期間：112～115 年度（2023～2026）
  //   - 資料來源：https://1966.gov.tw/LTC/cp-6457-69925-207.html
  if (careType === 'institution') {
    const institutionMonthlySubsidy = cmsLevel >= 4 ? 10000 : 0;
    const avgMonthlyFee = 45000; // 全國機構平均月費（含三餐、護理費）
    const outOfPocketInstitution = Math.max(0, avgMonthlyFee - institutionMonthlySubsidy);
    return {
      totalSubsidyMonthly: institutionMonthlySubsidy,
      outOfPocketMonthly: outOfPocketInstitution,
      hasTransportation: false,
      assistiveDeviceQuota: 0,
      transportQuotaMonthly: 0,
      transportRegion,
      assistiveDeviceGroup,
      policyVersion: POLICY_VERSION,
    };
  }

  // ========================================================================
  // 第一包：照顧及專業服務 (每月額度)
  // ========================================================================
  let baseQuota = CMS_QUOTAS[cmsLevel];
  const rates = CARE_CO_PAY_RATES[incomeStatus];

  // 特殊情況 2：外籍看護工
  // 聘僱外籍看護工時，第一包錢額度僅剩 30%，且只能用於專業服務
  if (careType === 'foreign-caregiver') {
    baseQuota = baseQuota * 0.3;
  }

  // 計算第一包錢的補助與自付額
  const subsidyCare = baseQuota * (1 - rates.base);
  const outOfPocketCare = baseQuota * rates.base;

  // ========================================================================
  // 第二包：交通接送服務 (每月額度)
  // ========================================================================
  // 給付條件：CMS 第 4 級 (含) 以上
  // 依居住地鄉鎮分為四區：每月 $1,680 / $1,840 / $2,000 / $2,400
  let subsidyTransport = 0;
  let outOfPocketTransport = 0;
  const hasTransport = cmsLevel >= 4;

  if (hasTransport) {
    const transportQuota = transportQuotaMonthly;
    subsidyTransport = transportQuota * (1 - rates.transport);
    outOfPocketTransport = transportQuota * rates.transport;
  }

  // ========================================================================
  // 第四包：喘息服務 (年額攤提到每月)
  // ========================================================================
  // CMS 第 2-6 級：每年 $32,340
  // CMS 第 7-8 級：每年 $48,510
  const respiteQuotaYearly = getRespiteYearlyQuota(cmsLevel);

  const respiteQuotaMonthly = respiteQuotaYearly / 12;
  const subsidyRespite = respiteQuotaMonthly * (1 - rates.base);
  const outOfPocketRespite = respiteQuotaMonthly * rates.base;

  // ========================================================================
  // 總結每月費用
  // ========================================================================
  const totalSubsidyMonthly = Math.round(
    subsidyCare + subsidyTransport + subsidyRespite
  );
  const outOfPocketMonthly = Math.round(
    outOfPocketCare + outOfPocketTransport + outOfPocketRespite
  );

  // ========================================================================
  // 第三包：輔具及居家無障礙環境改善 (三年額度)
  // ========================================================================
  // 給付條件：CMS 第 2 級 (含) 以上
  // 2026-07-01 起可依核定選擇第一組 4 萬或第二組 6 萬。
  const assistiveDeviceQuota = cmsLevel >= 2
    ? ASSISTIVE_DEVICE_GROUPS[assistiveDeviceGroup].threeYearQuota
    : 0;

  return {
    totalSubsidyMonthly,
    outOfPocketMonthly,
    hasTransportation: hasTransport,
    assistiveDeviceQuota,
    transportQuotaMonthly: hasTransport ? transportQuotaMonthly : 0,
    transportRegion,
    assistiveDeviceGroup,
    policyVersion: POLICY_VERSION,
  };
}

/**
 * 輔助函數：驗證 CMS 等級是否有效
 */
export function isValidCMSLevel(level: number): level is CMSLevel {
  return level >= 1 && level <= 8 && Number.isInteger(level);
}

/**
 * 輔助函數：驗證收入身份是否有效
 */
export function isValidIncomeStatus(status: string): status is IncomeStatus {
  return ['general', 'mid-low', 'low'].includes(status);
}

/**
 * 輔助函數：驗證照顧方式是否有效
 */
export function isValidCareType(type: string): type is CareType {
  return ['home-care', 'day-care', 'foreign-caregiver', 'institution'].includes(type);
}

/**
 * 輔助函數：取得 CMS 等級的中文名稱
 */
export function getCMSLevelName(level: CMSLevel): string {
  const names: Record<CMSLevel, string> = {
    1: '輕度失能',
    2: '輕度失能',
    3: '中度失能',
    4: '中度失能',
    5: '重度失能',
    6: '重度失能',
    7: '極重度失能',
    8: '極重度失能',
  };
  return names[level];
}

/**
 * 輔助函數：取得收入身份的中文名稱
 */
export function getIncomeStatusName(status: IncomeStatus): string {
  const names: Record<IncomeStatus, string> = {
    'general': '一般戶',
    'mid-low': '中低收入戶',
    'low': '低收入戶',
  };
  return names[status];
}

/**
 * 輔助函數：取得照顧方式的中文名稱
 */
export function getCareTypeName(type: CareType): string {
  const names: Record<CareType, string> = {
    'home-care': '居家照顧',
    'day-care': '日間照顧',
    'foreign-caregiver': '聘僱外籍看護工',
    'institution': '住宿式機構',
  };
  return names[type];
}
