/**
 * 輸入驗證模組
 * 使用 Zod 進行嚴格的類型驗證
 */

import { z } from 'zod';

// 定義驗證 Schema
export const CareBudgetInputSchema = z.object({
  cmsLevel: z
    .number()
    .int('CMS 等級必須是整數')
    .min(1, 'CMS 等級最小為 1')
    .max(8, 'CMS 等級最大為 8'),
  incomeStatus: z.enum(['general', 'mid-low', 'low'], {
    errorMap: () => ({ message: '收入身份必須是 general、mid-low 或 low' }),
  }),
  careType: z.enum(['home-care', 'day-care', 'foreign-caregiver', 'institution'], {
    errorMap: () => ({ message: '照顧方式必須是有效的選項' }),
  }),
});

export type CareBudgetInput = z.infer<typeof CareBudgetInputSchema>;

/**
 * 驗證計算輸入
 */
export function validateCareBudgetInput(input: unknown) {
  return CareBudgetInputSchema.safeParse(input);
}

/**
 * 驗證並拋出錯誤
 */
export function validateCareBudgetInputOrThrow(input: unknown): CareBudgetInput {
  const result = CareBudgetInputSchema.safeParse(input);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => err.message).join(', ');
    throw new ValidationError(errors);
  }
  
  return result.data;
}

/**
 * 自定義驗證錯誤
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
