/**
 * 數據驗證測試
 * 確保 careData.ts 中的數據完整性與一致性
 */

import {
  CMS_LEVELS,
  SUBSIDY_RULES,
  INSTITUTION_SUBSIDY,
  getSubsidyRule,
  getCMSLevelInfo,
} from '@/constants/careData';

describe('careData 數據完整性測試', () => {
  describe('CMS_LEVELS', () => {
    test('應包含 8 個等級', () => {
      expect(CMS_LEVELS).toHaveLength(8);
    });

    test('等級應從 1 到 8 連續', () => {
      const levels = CMS_LEVELS.map(l => l.level);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test('每個等級都應有名稱和描述', () => {
      CMS_LEVELS.forEach(level => {
        expect(level.name).toBeTruthy();
        expect(level.description).toBeTruthy();
        expect(typeof level.name).toBe('string');
        expect(typeof level.description).toBe('string');
      });
    });
  });

  describe('SUBSIDY_RULES', () => {
    test('應包含 8 個等級的補助規則', () => {
      expect(SUBSIDY_RULES).toHaveLength(8);
    });

    test('每個規則都應有完整的欄位', () => {
      SUBSIDY_RULES.forEach(rule => {
        expect(rule).toHaveProperty('cmsLevel');
        expect(rule).toHaveProperty('careServiceMonthly');
        expect(rule).toHaveProperty('careServiceCopay');
        expect(rule).toHaveProperty('transportMonthly');
        expect(rule).toHaveProperty('assistiveDeviceQuota');
        expect(rule).toHaveProperty('respiteYearly');
      });
    });

    test('照顧服務月額應遞增', () => {
      for (let i = 1; i < SUBSIDY_RULES.length; i++) {
        const prev = SUBSIDY_RULES[i - 1].careServiceMonthly;
        const curr = SUBSIDY_RULES[i].careServiceMonthly;
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });

    test('CMS 1-3 級不應有交通接送', () => {
      for (let i = 0; i < 3; i++) {
        expect(SUBSIDY_RULES[i].transportMonthly).toBeNull();
      }
    });

    test('CMS 4-8 級應有交通接送', () => {
      for (let i = 3; i < 8; i++) {
        expect(SUBSIDY_RULES[i].transportMonthly).toBe(1680);
      }
    });

    test('CMS 1 級不應有輔具額度', () => {
      expect(SUBSIDY_RULES[0].assistiveDeviceQuota).toBeNull();
    });

    test('CMS 2-8 級應有輔具額度 40000', () => {
      for (let i = 1; i < 8; i++) {
        expect(SUBSIDY_RULES[i].assistiveDeviceQuota).toBe(40000);
      }
    });

    test('CMS 2-6 級喘息服務年額應為 32340', () => {
      for (let i = 1; i < 6; i++) {
        expect(SUBSIDY_RULES[i].respiteYearly).toBe(32340);
      }
    });

    test('CMS 7-8 級喘息服務年額應為 48510', () => {
      expect(SUBSIDY_RULES[6].respiteYearly).toBe(48510);
      expect(SUBSIDY_RULES[7].respiteYearly).toBe(48510);
    });

    test('自負額比例應在合理範圍內', () => {
      SUBSIDY_RULES.forEach(rule => {
        expect(rule.careServiceCopay.general).toBe(0.16);
        expect(rule.careServiceCopay.midLow).toBe(0.05);
        expect(rule.careServiceCopay.low).toBe(0);
      });
    });
  });

  describe('INSTITUTION_SUBSIDY', () => {
    test('應有正確的補助金額', () => {
      expect(INSTITUTION_SUBSIDY.yearlySubsidy).toBe(120000);
      expect(INSTITUTION_SUBSIDY.monthlySubsidy).toBe(10000);
    });

    test('月度補助應為年度補助的 1/12', () => {
      expect(INSTITUTION_SUBSIDY.monthlySubsidy).toBe(
        INSTITUTION_SUBSIDY.yearlySubsidy / 12
      );
    });

    test('應有合理的機構費用估計', () => {
      expect(INSTITUTION_SUBSIDY.estimatedMonthlyFee.min).toBe(35000);
      expect(INSTITUTION_SUBSIDY.estimatedMonthlyFee.max).toBe(45000);
      expect(INSTITUTION_SUBSIDY.estimatedMonthlyFee.max).toBeGreaterThan(
        INSTITUTION_SUBSIDY.estimatedMonthlyFee.min
      );
    });
  });

  describe('輔助函數測試', () => {
    test('getSubsidyRule 應正確返回規則', () => {
      for (let level = 1; level <= 8; level++) {
        const rule = getSubsidyRule(level);
        expect(rule).toBeDefined();
        expect(rule?.cmsLevel).toBe(level);
      }
    });

    test('getSubsidyRule 對無效等級應返回 null', () => {
      expect(getSubsidyRule(0)).toBeNull();
      expect(getSubsidyRule(9)).toBeNull();
      expect(getSubsidyRule(-1)).toBeNull();
    });

    test('getCMSLevelInfo 應正確返回等級資訊', () => {
      for (let level = 1; level <= 8; level++) {
        const info = getCMSLevelInfo(level);
        expect(info).toBeDefined();
        expect(info?.level).toBe(level);
        expect(info?.name).toBeTruthy();
      }
    });

    test('getCMSLevelInfo 對無效等級應返回 null', () => {
      expect(getCMSLevelInfo(0)).toBeNull();
      expect(getCMSLevelInfo(9)).toBeNull();
    });
  });
});
