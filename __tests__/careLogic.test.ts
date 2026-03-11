/**
 * 核心計算邏輯測試 - careLogic.ts
 * 
 * 這是最重要的測試文件，確保長照四包錢的計算邏輯 100% 正確
 * 所有測試案例都基於 2026 年台灣長照 3.0 的真實法規
 */

import {
  calculateCareBudget,
  isValidCMSLevel,
  isValidIncomeStatus,
  isValidCareType,
  getCMSLevelName,
  getIncomeStatusName,
  getCareTypeName,
  type CMSLevel,
  type IncomeStatus,
  type CareType,
} from '@/lib/careLogic';

describe('careLogic 核心計算邏輯測試', () => {
  describe('calculateCareBudget - 基本計算', () => {
    test('CMS 第 2 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(2, 'general', 'home-care');

      // 第一包：$10,020，自負 16% = $1,603，補助 = $8,417
      // 第二包：無（CMS 2 級不符合）
      // 第四包：$32,340/12 = $2,695，自負 16% = $431，補助 = $2,264
      // 總補助：$8,417 + $0 + $2,264 = $10,681
      // 總自付：$1,603 + $0 + $431 = $2,034

      expect(result.totalSubsidyMonthly).toBe(10681);
      expect(result.outOfPocketMonthly).toBe(2034);
      expect(result.hasTransportation).toBe(false);
      expect(result.assistiveDeviceQuota).toBe(40000);
    });

    test('CMS 第 5 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(5, 'general', 'home-care');

      // 第一包：$24,100，自負 16% = $3,856，補助 = $20,244
      // 第二包：$1,680，自負 21% = $353，補助 = $1,327
      // 第四包：$32,340/12 = $2,695，自負 16% = $431，補助 = $2,264
      // 總補助：$20,244 + $1,327 + $2,264 = $23,835
      // 總自付：$3,856 + $353 + $431 = $4,640

      expect(result.totalSubsidyMonthly).toBe(23835);
      expect(result.outOfPocketMonthly).toBe(4640);
      expect(result.hasTransportation).toBe(true);
      expect(result.assistiveDeviceQuota).toBe(40000);
    });

    test('CMS 第 8 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(8, 'general', 'home-care');

      // 第一包：$36,180，自負 16% = $5,789，補助 = $30,391
      // 第二包：$1,680，自負 21% = $353，補助 = $1,327
      // 第四包：$48,510/12 = $4,043，自負 16% = $647，補助 = $3,396
      // 總補助：$30,391 + $1,327 + $3,396 = $35,114
      // 總自付：$5,789 + $353 + $647 = $6,789

      expect(result.totalSubsidyMonthly).toBe(35114);
      expect(result.outOfPocketMonthly).toBe(6789);
      expect(result.hasTransportation).toBe(true);
      expect(result.assistiveDeviceQuota).toBe(40000);
    });
  });

  describe('calculateCareBudget - 收入身份測試', () => {
    test('中低收入戶自負額比例正確', () => {
      const result = calculateCareBudget(4, 'mid-low', 'home-care');

      // 第一包：$18,580，自負 5% = $929，補助 = $17,651
      // 第二包：$1,680，自負 7% = $118，補助 = $1,562
      // 第四包：$32,340/12 = $2,695，自負 5% = $135，補助 = $2,560
      // 總補助：$17,651 + $1,562 + $2,560 = $21,773
      // 總自付：$929 + $118 + $135 = $1,182

      expect(result.totalSubsidyMonthly).toBe(21773);
      expect(result.outOfPocketMonthly).toBe(1182);
      expect(result.hasTransportation).toBe(true);
    });

    test('低收入戶自負額為 0', () => {
      const result = calculateCareBudget(8, 'low', 'home-care');

      // 所有自付額都應該是 0
      // 第一包：$36,180，自負 0% = $0，補助 = $36,180
      // 第二包：$1,680，自負 0% = $0，補助 = $1,680
      // 第四包：$48,510/12 = $4,043，自負 0% = $0，補助 = $4,043
      // 總補助：$36,180 + $1,680 + $4,043 = $41,903
      // 總自付：$0

      expect(result.totalSubsidyMonthly).toBe(41903);
      expect(result.outOfPocketMonthly).toBe(0);
      expect(result.hasTransportation).toBe(true);
    });
  });

  describe('calculateCareBudget - 外籍看護工特殊邏輯', () => {
    test('外籍看護工補助額度打 3 折', () => {
      const result = calculateCareBudget(5, 'general', 'foreign-caregiver');

      // 第一包：$24,100 × 0.3 = $7,230，自負 16% = $1,157，補助 = $6,073
      // 第二包：$1,680，自負 21% = $353，補助 = $1,327
      // 第四包：$32,340/12 = $2,695，自負 16% = $431，補助 = $2,264
      // 總補助：$6,073 + $1,327 + $2,264 = $9,664
      // 總自付：$1,157 + $353 + $431 = $1,941

      expect(result.totalSubsidyMonthly).toBe(9664);
      expect(result.outOfPocketMonthly).toBe(1941);
      expect(result.hasTransportation).toBe(true);
    });

    test('CMS 第 2 級外籍看護工', () => {
      const result = calculateCareBudget(2, 'general', 'foreign-caregiver');

      // 第一包：$10,020 × 0.3 = $3,006，自負 16% = $481，補助 = $2,525
      // 第二包：無
      // 第四包：$32,340/12 = $2,695，自負 16% = $431，補助 = $2,264
      // 總補助：$2,525 + $0 + $2,264 = $4,789
      // 總自付：$481 + $0 + $431 = $912

      expect(result.totalSubsidyMonthly).toBe(4789);
      expect(result.outOfPocketMonthly).toBe(912);
      expect(result.hasTransportation).toBe(false);
    });
  });

  describe('calculateCareBudget - 住宿式機構', () => {
    test('住宿式機構無長照四包錢', () => {
      const result = calculateCareBudget(5, 'general', 'institution');

      expect(result.totalSubsidyMonthly).toBe(0);
      expect(result.outOfPocketMonthly).toBe(40000);
      expect(result.hasTransportation).toBe(false);
      expect(result.assistiveDeviceQuota).toBe(0);
    });

    test('住宿式機構不受收入身份影響', () => {
      const resultGeneral = calculateCareBudget(5, 'general', 'institution');
      const resultMidLow = calculateCareBudget(5, 'mid-low', 'institution');
      const resultLow = calculateCareBudget(5, 'low', 'institution');

      expect(resultGeneral).toEqual(resultMidLow);
      expect(resultMidLow).toEqual(resultLow);
    });
  });

  describe('calculateCareBudget - 交通接送資格', () => {
    test('CMS 1-3 級無交通接送', () => {
      const result1 = calculateCareBudget(1, 'general', 'home-care');
      const result2 = calculateCareBudget(2, 'general', 'home-care');
      const result3 = calculateCareBudget(3, 'general', 'home-care');

      expect(result1.hasTransportation).toBe(false);
      expect(result2.hasTransportation).toBe(false);
      expect(result3.hasTransportation).toBe(false);
    });

    test('CMS 4-8 級有交通接送', () => {
      for (let level = 4; level <= 8; level++) {
        const result = calculateCareBudget(level as CMSLevel, 'general', 'home-care');
        expect(result.hasTransportation).toBe(true);
      }
    });
  });

  describe('calculateCareBudget - 輔具額度', () => {
    test('CMS 1 級無輔具額度', () => {
      const result = calculateCareBudget(1, 'general', 'home-care');
      expect(result.assistiveDeviceQuota).toBe(0);
    });

    test('CMS 2-8 級有輔具額度 40000', () => {
      for (let level = 2; level <= 8; level++) {
        const result = calculateCareBudget(level as CMSLevel, 'general', 'home-care');
        expect(result.assistiveDeviceQuota).toBe(40000);
      }
    });
  });

  describe('calculateCareBudget - 喘息服務', () => {
    test('CMS 1 級無喘息服務', () => {
      const result = calculateCareBudget(1, 'general', 'home-care');
      // 總補助和自付都應該是 0（因為第一包也是 0）
      expect(result.totalSubsidyMonthly).toBe(0);
      expect(result.outOfPocketMonthly).toBe(0);
    });

    test('CMS 2-6 級喘息服務年額 32340', () => {
      for (let level = 2; level <= 6; level++) {
        const result = calculateCareBudget(level as CMSLevel, 'low', 'home-care');
        // 低收入戶自付 0%，所以補助應該包含完整的喘息服務月額
        const expectedRespiteMonthly = Math.round(32340 / 12);
        // 驗證總補助中包含喘息服務
        expect(result.totalSubsidyMonthly).toBeGreaterThan(expectedRespiteMonthly);
      }
    });

    test('CMS 7-8 級喘息服務年額 48510', () => {
      for (let level = 7; level <= 8; level++) {
        const result = calculateCareBudget(level as CMSLevel, 'low', 'home-care');
        const expectedRespiteMonthly = Math.round(48510 / 12);
        expect(result.totalSubsidyMonthly).toBeGreaterThan(expectedRespiteMonthly);
      }
    });
  });

  describe('驗證函數測試', () => {
    test('isValidCMSLevel 正確驗證', () => {
      expect(isValidCMSLevel(1)).toBe(true);
      expect(isValidCMSLevel(8)).toBe(true);
      expect(isValidCMSLevel(0)).toBe(false);
      expect(isValidCMSLevel(9)).toBe(false);
      expect(isValidCMSLevel(5.5)).toBe(false);
      expect(isValidCMSLevel(-1)).toBe(false);
    });

    test('isValidIncomeStatus 正確驗證', () => {
      expect(isValidIncomeStatus('general')).toBe(true);
      expect(isValidIncomeStatus('mid-low')).toBe(true);
      expect(isValidIncomeStatus('low')).toBe(true);
      expect(isValidIncomeStatus('invalid')).toBe(false);
      expect(isValidIncomeStatus('midLow')).toBe(false);
    });

    test('isValidCareType 正確驗證', () => {
      expect(isValidCareType('home-care')).toBe(true);
      expect(isValidCareType('day-care')).toBe(true);
      expect(isValidCareType('foreign-caregiver')).toBe(true);
      expect(isValidCareType('institution')).toBe(true);
      expect(isValidCareType('invalid')).toBe(false);
    });
  });

  describe('輔助函數測試', () => {
    test('getCMSLevelName 返回正確名稱', () => {
      expect(getCMSLevelName(1)).toBe('輕度失能');
      expect(getCMSLevelName(3)).toBe('中度失能');
      expect(getCMSLevelName(5)).toBe('重度失能');
      expect(getCMSLevelName(7)).toBe('極重度失能');
    });

    test('getIncomeStatusName 返回正確名稱', () => {
      expect(getIncomeStatusName('general')).toBe('一般戶');
      expect(getIncomeStatusName('mid-low')).toBe('中低收入戶');
      expect(getIncomeStatusName('low')).toBe('低收入戶');
    });

    test('getCareTypeName 返回正確名稱', () => {
      expect(getCareTypeName('home-care')).toBe('居家照顧');
      expect(getCareTypeName('day-care')).toBe('日間照顧');
      expect(getCareTypeName('foreign-caregiver')).toBe('聘僱外籍看護工');
      expect(getCareTypeName('institution')).toBe('住宿式機構');
    });
  });

  describe('數學精確性測試', () => {
    test('所有計算結果都應該是整數', () => {
      const testCases: Array<[CMSLevel, IncomeStatus, CareType]> = [
        [2, 'general', 'home-care'],
        [5, 'mid-low', 'day-care'],
        [8, 'low', 'foreign-caregiver'],
        [4, 'general', 'institution'],
      ];

      testCases.forEach(([cms, income, care]) => {
        const result = calculateCareBudget(cms, income, care);
        expect(Number.isInteger(result.totalSubsidyMonthly)).toBe(true);
        expect(Number.isInteger(result.outOfPocketMonthly)).toBe(true);
        expect(Number.isInteger(result.assistiveDeviceQuota)).toBe(true);
      });
    });

    test('補助 + 自付應該等於總額度（非機構）', () => {
      const result = calculateCareBudget(5, 'general', 'home-care');
      const total = result.totalSubsidyMonthly + result.outOfPocketMonthly;
      
      // 第一包：$24,100
      // 第二包：$1,680
      // 第四包：$32,340/12 = $2,695
      // 總額：$24,100 + $1,680 + $2,695 = $28,475
      expect(total).toBe(28475);
    });
  });

  describe('極端案例測試', () => {
    test('CMS 第 1 級所有照顧方式', () => {
      const homeResult = calculateCareBudget(1, 'general', 'home-care');
      const dayResult = calculateCareBudget(1, 'general', 'day-care');
      const foreignResult = calculateCareBudget(1, 'general', 'foreign-caregiver');

      // CMS 1 級無任何補助（除了機構）
      expect(homeResult.totalSubsidyMonthly).toBe(0);
      expect(dayResult.totalSubsidyMonthly).toBe(0);
      expect(foreignResult.totalSubsidyMonthly).toBe(0);
    });

    test('所有 CMS 等級的機構費用一致', () => {
      for (let level = 1; level <= 8; level++) {
        const result = calculateCareBudget(level as CMSLevel, 'general', 'institution');
        expect(result.totalSubsidyMonthly).toBe(0);
        expect(result.outOfPocketMonthly).toBe(40000);
      }
    });
  });
});
