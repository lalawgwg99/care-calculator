/**
 * 隱形省下的錢（減免與退稅）計算邏輯測試
 */

import {
  calculateHiddenSavings,
  getDisabilityLevelName,
  SUPPORTED_CITIES,
  TAX_BRACKET_OPTIONS,
  DISABILITY_LEVEL_OPTIONS,
  type HiddenSavingsInput,
  type DisabilityLevel,
  type TaxBracket,
} from '@/lib/hiddenSavingsCalculator';

// 預設測試用 input
function makeInput(overrides?: Partial<HiddenSavingsInput['elderly']> & { taxBracket?: TaxBracket; isClaiming?: boolean }): HiddenSavingsInput {
  const { taxBracket, isClaiming, ...elderlyOverrides } = overrides || {};
  return {
    elderly: {
      age: 75,
      isIndigenous: false,
      city: '台北市',
      disabilityLevel: 'none',
      hasLongTermCareQualification: true,
      isStillInsuredByLabor: false,
      hasVehicleUnder2400cc: false,
      ...elderlyOverrides,
    },
    taxPayer: {
      taxBracket: taxBracket ?? 0.12,
      isClaiming: isClaiming ?? true,
    },
  };
}

describe('calculateHiddenSavings', () => {
  describe('一、健保費減免', () => {
    test('地方高齡健保補助未取得完整資格時不自動估值', () => {
      const result = calculateHiddenSavings(makeInput({ age: 65, city: '台北市' }));
      expect(result.nhiAgeSavingsMonthly).toBe(0);
      expect(result.nhiTotalYearly).toBe(0);
    });

    test('64 歲不符合年齡減免', () => {
      const result = calculateHiddenSavings(makeInput({ age: 64 }));
      expect(result.nhiAgeSavingsMonthly).toBe(0);
    });

    test('原住民仍須地方資格，不自動估值', () => {
      const result = calculateHiddenSavings(makeInput({ age: 55, isIndigenous: true }));
      expect(result.nhiAgeSavingsMonthly).toBe(0);
    });

    test('原住民 54 歲不符合', () => {
      const result = calculateHiddenSavings(makeInput({ age: 54, isIndigenous: true }));
      expect(result.nhiAgeSavingsMonthly).toBe(0);
    });

    test('身障健保補助缺少投保類別時不自動估值', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'mild' }));
      expect(result.nhiDisabilitySavingsMonthly).toBe(0);
    });

    test('身障中度減免 50%', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'moderate' }));
      expect(result.nhiDisabilitySavingsMonthly).toBe(0);
    });

    test('身障重度/極重度減免 100%', () => {
      const severe = calculateHiddenSavings(makeInput({ disabilityLevel: 'severe' }));
      const profound = calculateHiddenSavings(makeInput({ disabilityLevel: 'profound' }));
      expect(severe.nhiDisabilitySavingsMonthly).toBe(0);
      expect(profound.nhiDisabilitySavingsMonthly).toBe(0);
    });

    test('地方與投保條件未確認時健保合計為零', () => {
      const result = calculateHiddenSavings(makeInput({ age: 65, disabilityLevel: 'mild' }));
      expect(result.nhiTotalYearly).toBe(0);
    });
  });

  describe('二、勞保/國保減免', () => {
    test('無身障無保費減免', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'none' }));
      expect(result.laborInsuranceSavingsMonthly).toBe(0);
      expect(result.laborInsuranceTotalYearly).toBe(0);
    });

    test('輕度身障保費減免 25%', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'mild' }));
      expect(result.laborInsuranceSavingsMonthly).toBe(Math.round(1329 * 0.25));
    });

    test('重度身障保費減免 100%', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'severe' }));
      expect(result.laborInsuranceSavingsMonthly).toBe(1329);
    });

    test('仍在勞保加保期間時顯示失能給付提醒', () => {
      const result = calculateHiddenSavings(makeInput({ isStillInsuredByLabor: true }));
      expect(result.laborDisabilityBenefitAlert).toBe(true);
    });

    test('已退保不顯示失能給付提醒', () => {
      const result = calculateHiddenSavings(makeInput({ isStillInsuredByLabor: false }));
      expect(result.laborDisabilityBenefitAlert).toBe(false);
    });
  });

  describe('三、稅務扣除額', () => {
    test('70 歲以上扶養免稅額 $145,500', () => {
      const result = calculateHiddenSavings(makeInput({ age: 70, isClaiming: true }));
      expect(result.taxDependentExemption).toBe(145500);
    });

    test('70 歲以下扶養免稅額 $97,000', () => {
      const result = calculateHiddenSavings(makeInput({ age: 69, isClaiming: true }));
      expect(result.taxDependentExemption).toBe(97000);
    });

    test('不列報扶養則免稅額為 0', () => {
      const result = calculateHiddenSavings(makeInput({ age: 75, isClaiming: false }));
      expect(result.taxDependentExemption).toBe(0);
    });

    test('有身障證明 + 列報扶養 → 身障特別扣除 $218,000', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'mild', isClaiming: true }));
      expect(result.taxDisabilityDeduction).toBe(218000);
    });

    test('無身障證明 → 身障扣除為 0', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'none', isClaiming: true }));
      expect(result.taxDisabilityDeduction).toBe(0);
    });

    test('符合長照資格且未觸及稅率排富 → 長照特別扣除 $180,000', () => {
      const result = calculateHiddenSavings(makeInput({ hasLongTermCareQualification: true }));
      expect(result.taxLongTermCareDeduction).toBe(180000);
    });

    test('不符合長照資格 → 長照扣除為 0', () => {
      const result = calculateHiddenSavings(makeInput({ hasLongTermCareQualification: false }));
      expect(result.taxLongTermCareDeduction).toBe(0);
    });

    test('未列報同一申報戶時不計入長照扣除額', () => {
      const result = calculateHiddenSavings(makeInput({
        hasLongTermCareQualification: true,
        isClaiming: false,
      }));
      expect(result.taxLongTermCareDeduction).toBe(0);
    });

    test('完整扣除總額計算：70+ 歲 + 身障 + 長照 = $543,500', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        isClaiming: true,
      }));
      expect(result.taxTotalDeduction).toBe(145500 + 218000 + 180000);
      expect(result.taxTotalDeduction).toBe(543500);
    });

    test('稅率 12% 實際省稅 = $543,500 × 12% = $65,220', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        isClaiming: true,
        taxBracket: 0.12,
      }));
      expect(result.taxActualSaving).toBe(Math.round(543500 * 0.12));
      expect(result.taxActualSaving).toBe(65220);
    });

    test('稅率 20% 觸及長照扣除額排富條件', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        isClaiming: true,
        taxBracket: 0.20,
      }));
      expect(result.taxLongTermCareDeduction).toBe(0);
      expect(result.taxActualSaving).toBe(Math.round((145500 + 218000) * 0.20));
    });
  });

  describe('四、日常生活減免', () => {
    test('僅有身障與車輛排氣量不足以判定牌照稅免徵', () => {
      const result = calculateHiddenSavings(makeInput({
        disabilityLevel: 'mild',
        hasVehicleUnder2400cc: true,
      }));
      expect(result.vehicleTaxSavingsYearly).toBe(0);
    });

    test('無身障 → 無牌照稅免徵', () => {
      const result = calculateHiddenSavings(makeInput({
        disabilityLevel: 'none',
        hasVehicleUnder2400cc: true,
      }));
      expect(result.vehicleTaxSavingsYearly).toBe(0);
    });

    test('有身障但無車 → 無牌照稅免徵', () => {
      const result = calculateHiddenSavings(makeInput({
        disabilityLevel: 'mild',
        hasVehicleUnder2400cc: false,
      }));
      expect(result.vehicleTaxSavingsYearly).toBe(0);
    });

    test('敬老卡地方資格未確認時不自動估值', () => {
      const result = calculateHiddenSavings(makeInput({ age: 65, city: '台北市' }));
      expect(result.seniorCardMonthly).toBe(0);
    });

    test('不同縣市同樣不預設敬老卡金額', () => {
      const result = calculateHiddenSavings(makeInput({ age: 65, city: '台中市' }));
      expect(result.seniorCardMonthly).toBe(0);
    });

    test('64 歲 → 無敬老卡', () => {
      const result = calculateHiddenSavings(makeInput({ age: 64 }));
      expect(result.seniorCardMonthly).toBe(0);
    });

    test('僅有身障等級不足以判定停車優惠', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'mild' }));
      expect(result.parkingBenefit).toBe(false);
    });

    test('無身障 → 停車優惠為 false', () => {
      const result = calculateHiddenSavings(makeInput({ disabilityLevel: 'none' }));
      expect(result.parkingBenefit).toBe(false);
    });

    test('符合長照資格 → 輔具補助 $40,000', () => {
      const result = calculateHiddenSavings(makeInput({ hasLongTermCareQualification: true }));
      expect(result.assistiveDeviceQuota).toBe(40000);
    });
  });

  describe('總計計算', () => {
    test('totalYearlySavings 應為各項之和', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        city: '台北市',
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        hasVehicleUnder2400cc: true,
        isClaiming: true,
        taxBracket: 0.12,
      }));

      const expected =
        result.nhiTotalYearly +
        result.laborInsuranceTotalYearly +
        result.taxActualSaving +
        result.vehicleTaxSavingsYearly +
        result.seniorCardMonthly * 12 +
        Math.round(result.assistiveDeviceQuota / 3);

      expect(result.totalYearlySavings).toBe(expected);
    });

    test('totalMonthlySavings = totalYearlySavings / 12', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        isClaiming: true,
      }));
      expect(result.totalMonthlySavings).toBe(Math.round(result.totalYearlySavings / 12));
    });

    test('所有省下金額為非負數', () => {
      const result = calculateHiddenSavings(makeInput());
      expect(result.nhiTotalYearly).toBeGreaterThanOrEqual(0);
      expect(result.laborInsuranceTotalYearly).toBeGreaterThanOrEqual(0);
      expect(result.taxActualSaving).toBeGreaterThanOrEqual(0);
      expect(result.vehicleTaxSavingsYearly).toBeGreaterThanOrEqual(0);
      expect(result.totalYearlySavings).toBeGreaterThanOrEqual(0);
      expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('保守估值案例', () => {
    test('不把未確認地方福利與牌照稅計入總額', () => {
      const result = calculateHiddenSavings(makeInput({
        age: 75,
        city: '台中市',
        disabilityLevel: 'moderate',
        hasLongTermCareQualification: true,
        hasVehicleUnder2400cc: true,
        isStillInsuredByLabor: false,
        isClaiming: true,
        taxBracket: 0.20,
      }));

      expect(result.nhiTotalYearly).toBe(0);
      expect(result.vehicleTaxSavingsYearly).toBe(0);
      expect(result.seniorCardMonthly).toBe(0);
      expect(result.totalYearlySavings).toBe(94013);
    });
  });
});

describe('getDisabilityLevelName', () => {
  test('返回正確的中文名稱', () => {
    expect(getDisabilityLevelName('none')).toBe('無');
    expect(getDisabilityLevelName('mild')).toBe('輕度');
    expect(getDisabilityLevelName('moderate')).toBe('中度');
    expect(getDisabilityLevelName('severe')).toBe('重度');
    expect(getDisabilityLevelName('profound')).toBe('極重度');
  });
});

describe('常數匯出驗證', () => {
  test('SUPPORTED_CITIES 包含六都', () => {
    expect(SUPPORTED_CITIES).toContain('台北市');
    expect(SUPPORTED_CITIES).toContain('新北市');
    expect(SUPPORTED_CITIES).toContain('桃園市');
    expect(SUPPORTED_CITIES).toContain('台中市');
    expect(SUPPORTED_CITIES).toContain('台南市');
    expect(SUPPORTED_CITIES).toContain('高雄市');
  });

  test('TAX_BRACKET_OPTIONS 包含 5 個稅率級距', () => {
    expect(TAX_BRACKET_OPTIONS).toHaveLength(5);
    expect(TAX_BRACKET_OPTIONS[0].value).toBe(0.05);
    expect(TAX_BRACKET_OPTIONS[4].value).toBe(0.40);
  });

  test('DISABILITY_LEVEL_OPTIONS 包含 5 個等級', () => {
    expect(DISABILITY_LEVEL_OPTIONS).toHaveLength(5);
  });
});
