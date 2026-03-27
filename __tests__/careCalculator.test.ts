/**
 * 核心計算邏輯測試
 * 目標：100% 覆蓋率
 */

import { calculateCareBudget, formatCurrency } from '@/lib/careCalculator';
import { INSTITUTION_SUBSIDY } from '@/constants/careData';

describe('calculateCareBudget', () => {
  describe('基本計算邏輯', () => {
    test('CMS 第 2 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(2, 'general', 'home-care');

      // 第一包：照顧及專業服務
      // 總額 $10,020，自負 16% = $1,603，補助 = $8,417
      expect(result.breakdown.careServiceSubsidy).toBe(8417);
      expect(result.breakdown.careServiceCopay).toBe(1603);

      // 第二包：交通接送 (CMS 2 級不符合)
      expect(result.hasTransportation).toBe(false);
      expect(result.breakdown.transportSubsidy).toBe(0);
      expect(result.breakdown.transportCopay).toBe(0);

      // 第四包：喘息服務
      // 年額 $32,340 / 12 = $2,695，自負 16% = $431，補助 = $2,264
      expect(result.breakdown.respiteSubsidy).toBe(2264);
      expect(result.breakdown.respiteCopay).toBe(431);

      // 總計
      expect(result.totalSubsidyMonthly).toBe(10681); // 8417 + 0 + 2264
      expect(result.outOfPocketMonthly).toBe(2034); // 1603 + 0 + 431

      // 第三包：輔具
      expect(result.assistiveDeviceQuota).toBe(40000);
    });

    test('CMS 第 5 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(5, 'general', 'home-care');

      // 第一包：$24,100，自負 16% = $3,856，補助 = $20,244
      expect(result.breakdown.careServiceSubsidy).toBe(20244);
      expect(result.breakdown.careServiceCopay).toBe(3856);

      // 第二包：交通接送 (CMS 5 級符合)
      // $1,680，自負 21% = $352，補助 = $1,328
      expect(result.hasTransportation).toBe(true);
      expect(result.breakdown.transportSubsidy).toBe(1328);
      expect(result.breakdown.transportCopay).toBe(352);

      // 第四包：喘息服務
      // 年額 $32,340 / 12 = $2,695，自負 16% = $431，補助 = $2,264
      expect(result.breakdown.respiteSubsidy).toBe(2264);
      expect(result.breakdown.respiteCopay).toBe(431);

      // 總計
      expect(result.totalSubsidyMonthly).toBe(23836); // 20244 + 1328 + 2264
      expect(result.outOfPocketMonthly).toBe(4639); // 3856 + 352 + 431
    });

    test('CMS 第 8 級，一般戶，居家照顧', () => {
      const result = calculateCareBudget(8, 'general', 'home-care');

      // 第一包：$36,180，自負 16% = $5,788，補助 = $30,392
      expect(result.breakdown.careServiceSubsidy).toBe(30392);
      expect(result.breakdown.careServiceCopay).toBe(5788);

      // 第二包：交通接送
      expect(result.hasTransportation).toBe(true);
      expect(result.breakdown.transportSubsidy).toBe(1328);
      expect(result.breakdown.transportCopay).toBe(352);

      // 第四包：喘息服務 (CMS 7-8 級年額較高)
      // 年額 $48,510 / 12 = $4,042，自負 16% = $646，補助 = $3,396
      expect(result.breakdown.respiteSubsidy).toBe(3396);
      expect(result.breakdown.respiteCopay).toBe(646);

      // 總計
      expect(result.totalSubsidyMonthly).toBe(35116); // 30392 + 1328 + 3396
      expect(result.outOfPocketMonthly).toBe(6786); // 5788 + 352 + 646
    });
  });

  describe('收入身份測試', () => {
    test('中低收入戶自負額比例正確', () => {
      const result = calculateCareBudget(4, 'mid-low', 'home-care');

      // 第一包：$18,580，自負 5% = $929，補助 = $17,651
      expect(result.breakdown.careServiceSubsidy).toBe(17651);
      expect(result.breakdown.careServiceCopay).toBe(929);

      // 第二包：$1,680，自負 7% = $117，補助 = $1,563
      expect(result.breakdown.transportSubsidy).toBe(1563);
      expect(result.breakdown.transportCopay).toBe(117);

      // 第四包：$2,695，自負 5% = $134，補助 = $2,561
      expect(result.breakdown.respiteSubsidy).toBe(2561);
      expect(result.breakdown.respiteCopay).toBe(134);

      // 總計
      expect(result.totalSubsidyMonthly).toBe(21775);
      expect(result.outOfPocketMonthly).toBe(1180);
    });

    test('低收入戶自負額為 0', () => {
      const result = calculateCareBudget(8, 'low', 'home-care');

      // 所有自付額都應該是 0
      expect(result.breakdown.careServiceCopay).toBe(0);
      expect(result.breakdown.transportCopay).toBe(0);
      expect(result.breakdown.respiteCopay).toBe(0);
      expect(result.outOfPocketMonthly).toBe(0);

      // 補助應該等於總額
      expect(result.breakdown.careServiceSubsidy).toBe(36180);
      expect(result.breakdown.transportSubsidy).toBe(1680);
      expect(result.breakdown.respiteSubsidy).toBe(4042);
      expect(result.totalSubsidyMonthly).toBe(41902);
    });
  });

  describe('邊緣案例：外籍看護工', () => {
    test('補助額度打 3 折', () => {
      const result = calculateCareBudget(5, 'general', 'foreign-caregiver');

      // 第一包：$24,100 × 0.3 = $7,230，自負 16% = $1,156，補助 = $6,074
      expect(result.breakdown.careServiceSubsidy).toBe(6074);
      expect(result.breakdown.careServiceCopay).toBe(1156);

      // 第二包：交通接送不受影響
      expect(result.breakdown.transportSubsidy).toBe(1328);
      expect(result.breakdown.transportCopay).toBe(352);

      // 第四包：喘息服務不受影響
      expect(result.breakdown.respiteSubsidy).toBe(2264);
      expect(result.breakdown.respiteCopay).toBe(431);

      // 總計
      expect(result.totalSubsidyMonthly).toBe(9666);
      expect(result.outOfPocketMonthly).toBe(1939);
    });

    test('不同 CMS 等級的外籍看護工計算', () => {
      const result2 = calculateCareBudget(2, 'general', 'foreign-caregiver');
      // $10,020 × 0.3 = $3,006，自負 16% = $480，補助 = $2,526
      expect(result2.breakdown.careServiceSubsidy).toBe(2526);
      expect(result2.breakdown.careServiceCopay).toBe(480);

      const result8 = calculateCareBudget(8, 'general', 'foreign-caregiver');
      // $36,180 × 0.3 = $10,854，自負 16% = $1,736，補助 = $9,118
      expect(result8.breakdown.careServiceSubsidy).toBe(9118);
      expect(result8.breakdown.careServiceCopay).toBe(1736);
    });
  });

  describe('邊緣案例：住宿式機構', () => {
    test('CMS 4+ 使用機構補助方案（每年 12 萬）', () => {
      const result = calculateCareBudget(5, 'general', 'institution');

      // 無長照四包錢
      expect(result.breakdown.careServiceSubsidy).toBe(0);
      expect(result.breakdown.careServiceCopay).toBe(0);
      expect(result.breakdown.transportSubsidy).toBe(0);
      expect(result.breakdown.transportCopay).toBe(0);
      expect(result.breakdown.respiteSubsidy).toBe(0);
      expect(result.breakdown.respiteCopay).toBe(0);

      expect(result.hasTransportation).toBe(false);
      expect(result.assistiveDeviceQuota).toBe(0);

      // CMS 5 >= 4：適用 12 萬/年補助
      expect(result.institutionInfo).toBeDefined();
      expect(result.institutionInfo?.yearlySubsidy).toBe(INSTITUTION_SUBSIDY.yearlySubsidy);
      expect(result.institutionInfo?.monthlySubsidy).toBe(INSTITUTION_SUBSIDY.monthlySubsidy);
      expect(result.totalSubsidyMonthly).toBe(10000);
      // 自付 = 機構中位月費 $40,000 - 補助 $10,000 = $30,000
      expect(result.outOfPocketMonthly).toBe(30000);
    });

    test('CMS 6 級一般戶使用機構補助方案', () => {
      const result = calculateCareBudget(6, 'general', 'institution');

      // CMS 6 >= 4：適用 12 萬/年補助
      expect(result.totalSubsidyMonthly).toBe(10000);
      expect(result.outOfPocketMonthly).toBe(30000);
      expect(result.institutionInfo).toBeDefined();
    });

    test('CMS 1-3 級不適用機構補助（新申請者）', () => {
      const result = calculateCareBudget(2, 'general', 'institution');

      // CMS 2 < 4：不適用 12 萬/年補助
      expect(result.totalSubsidyMonthly).toBe(0);
      expect(result.outOfPocketMonthly).toBe(40000);
      expect(result.institutionInfo).toBeUndefined();
    });

    test('機構補助不受收入身份影響（已取消排富）', () => {
      const resultGeneral = calculateCareBudget(5, 'general', 'institution');
      const resultMidLow = calculateCareBudget(5, 'mid-low', 'institution');
      const resultLow = calculateCareBudget(5, 'low', 'institution');

      // 所有收入身份的機構補助都相同（已取消排富條款）
      expect(resultGeneral.totalSubsidyMonthly).toBe(10000);
      expect(resultMidLow.totalSubsidyMonthly).toBe(10000);
      expect(resultLow.totalSubsidyMonthly).toBe(10000);
    });
  });

  describe('交通接送資格測試', () => {
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
        const result = calculateCareBudget(level, 'general', 'home-care');
        expect(result.hasTransportation).toBe(true);
        expect(result.breakdown.transportSubsidy).toBeGreaterThan(0);
      }
    });
  });

  describe('輔具額度測試', () => {
    test('CMS 1 級無輔具額度', () => {
      const result = calculateCareBudget(1, 'general', 'home-care');
      expect(result.assistiveDeviceQuota).toBe(0);
    });

    test('CMS 2-8 級有輔具額度', () => {
      for (let level = 2; level <= 8; level++) {
        const result = calculateCareBudget(level, 'general', 'home-care');
        expect(result.assistiveDeviceQuota).toBe(40000);
      }
    });
  });

  describe('喘息服務測試', () => {
    test('CMS 1 級無喘息服務', () => {
      const result = calculateCareBudget(1, 'general', 'home-care');
      expect(result.breakdown.respiteSubsidy).toBe(0);
      expect(result.breakdown.respiteCopay).toBe(0);
    });

    test('CMS 2-6 級喘息服務年額 $32,340', () => {
      for (let level = 2; level <= 6; level++) {
        const result = calculateCareBudget(level, 'general', 'home-care');
        const monthlyTotal = result.breakdown.respiteSubsidy + result.breakdown.respiteCopay;
        expect(monthlyTotal).toBe(2695); // $32,340 / 12
      }
    });

    test('CMS 7-8 級喘息服務年額 $48,510', () => {
      for (let level = 7; level <= 8; level++) {
        const result = calculateCareBudget(level, 'general', 'home-care');
        const monthlyTotal = result.breakdown.respiteSubsidy + result.breakdown.respiteCopay;
        expect(monthlyTotal).toBe(4042); // $48,510 / 12
      }
    });
  });

  describe('錯誤處理', () => {
    test('CMS 等級小於 1 應拋出錯誤', () => {
      expect(() => {
        calculateCareBudget(0, 'general', 'home-care');
      }).toThrow('CMS 等級必須介於 1-8');
    });

    test('CMS 等級大於 8 應拋出錯誤', () => {
      expect(() => {
        calculateCareBudget(9, 'general', 'home-care');
      }).toThrow('CMS 等級必須介於 1-8');
    });

    test('負數 CMS 等級應拋出錯誤', () => {
      expect(() => {
        calculateCareBudget(-1, 'general', 'home-care');
      }).toThrow('CMS 等級必須介於 1-8');
    });
  });

  describe('數學精確性測試', () => {
    test('補助 + 自付 = 總額度', () => {
      const testCases = [
        { cms: 2, income: 'general' as const, care: 'home-care' as const },
        { cms: 5, income: 'mid-low' as const, care: 'day-care' as const },
        { cms: 8, income: 'low' as const, care: 'home-care' as const },
      ];

      testCases.forEach(({ cms, income, care }) => {
        const result = calculateCareBudget(cms, income, care);
        
        // 第一包
        const careTotal = result.breakdown.careServiceSubsidy + result.breakdown.careServiceCopay;
        expect(careTotal).toBeGreaterThan(0);

        // 第二包 (如果有)
        if (result.hasTransportation) {
          const transportTotal = result.breakdown.transportSubsidy + result.breakdown.transportCopay;
          expect(transportTotal).toBe(1680);
        }

        // 第四包 (如果有)
        const respiteTotal = result.breakdown.respiteSubsidy + result.breakdown.respiteCopay;
        if (respiteTotal > 0) {
          expect([2695, 4042]).toContain(respiteTotal);
        }
      });
    });

    test('總補助 + 總自付 = 所有包錢總和', () => {
      const result = calculateCareBudget(5, 'general', 'home-care');
      
      const totalFromBreakdown = 
        result.breakdown.careServiceSubsidy + result.breakdown.careServiceCopay +
        result.breakdown.transportSubsidy + result.breakdown.transportCopay +
        result.breakdown.respiteSubsidy + result.breakdown.respiteCopay;

      const totalFromSummary = result.totalSubsidyMonthly + result.outOfPocketMonthly;

      expect(totalFromBreakdown).toBe(totalFromSummary);
    });
  });
});

describe('formatCurrency', () => {
  test('正確格式化台幣金額', () => {
    expect(formatCurrency(10000)).toBe('$10,000');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
    expect(formatCurrency(0)).toBe('$0');
  });

  test('處理小數點（應四捨五入，無小數位）', () => {
    expect(formatCurrency(10000.99)).toBe('$10,001');
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });

  test('處理負數', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000');
  });
});
