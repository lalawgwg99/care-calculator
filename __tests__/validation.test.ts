/**
 * 輸入驗證測試
 * 測試 Zod Schema 驗證邏輯
 */

import {
  validateCareBudgetInput,
  validateCareBudgetInputOrThrow,
  ValidationError,
} from '@/lib/validation';

describe('輸入驗證測試', () => {
  describe('validateCareBudgetInput', () => {
    test('有效輸入應通過驗證', () => {
      const validInputs = [
        { cmsLevel: 1, incomeStatus: 'general', careType: 'home-care' },
        { cmsLevel: 5, incomeStatus: 'midLow', careType: 'day-care' },
        { cmsLevel: 8, incomeStatus: 'low', careType: 'foreign-caregiver' },
        { cmsLevel: 4, incomeStatus: 'general', careType: 'institution' },
      ];

      validInputs.forEach(input => {
        const result = validateCareBudgetInput(input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(input);
        }
      });
    });

    test('CMS 等級小於 1 應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 0,
        incomeStatus: 'general',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });

    test('CMS 等級大於 8 應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 9,
        incomeStatus: 'general',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });

    test('CMS 等級為小數應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 5.5,
        incomeStatus: 'general',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });

    test('無效的收入身份應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 5,
        incomeStatus: 'invalid',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });

    test('無效的照顧方式應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 5,
        incomeStatus: 'general',
        careType: 'invalid-care',
      });
      expect(result.success).toBe(false);
    });

    test('缺少必要欄位應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 5,
        incomeStatus: 'general',
      });
      expect(result.success).toBe(false);
    });

    test('額外欄位應被忽略', () => {
      const result = validateCareBudgetInput({
        cmsLevel: 5,
        incomeStatus: 'general',
        careType: 'home-care',
        extraField: 'should be ignored',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty('extraField');
      }
    });
  });

  describe('validateCareBudgetInputOrThrow', () => {
    test('有效輸入應返回數據', () => {
      const input = {
        cmsLevel: 5,
        incomeStatus: 'general' as const,
        careType: 'home-care' as const,
      };
      
      expect(() => {
        const result = validateCareBudgetInputOrThrow(input);
        expect(result).toEqual(input);
      }).not.toThrow();
    });

    test('無效輸入應拋出 ValidationError', () => {
      const invalidInput = {
        cmsLevel: 0,
        incomeStatus: 'general',
        careType: 'home-care',
      };

      expect(() => {
        validateCareBudgetInputOrThrow(invalidInput);
      }).toThrow(ValidationError);
    });

    test('拋出的錯誤應包含有意義的訊息', () => {
      const invalidInput = {
        cmsLevel: 9,
        incomeStatus: 'general',
        careType: 'home-care',
      };

      try {
        validateCareBudgetInputOrThrow(invalidInput);
        fail('應該拋出錯誤');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('CMS');
      }
    });
  });

  describe('邊緣案例測試', () => {
    test('null 輸入應失敗', () => {
      const result = validateCareBudgetInput(null);
      expect(result.success).toBe(false);
    });

    test('undefined 輸入應失敗', () => {
      const result = validateCareBudgetInput(undefined);
      expect(result.success).toBe(false);
    });

    test('空物件應失敗', () => {
      const result = validateCareBudgetInput({});
      expect(result.success).toBe(false);
    });

    test('字串型別的數字應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: '5',
        incomeStatus: 'general',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });

    test('負數 CMS 等級應失敗', () => {
      const result = validateCareBudgetInput({
        cmsLevel: -1,
        incomeStatus: 'general',
        careType: 'home-care',
      });
      expect(result.success).toBe(false);
    });
  });
});
