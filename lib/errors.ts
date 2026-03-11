/**
 * 錯誤處理模組
 * 定義所有可能的錯誤類型與友善的錯誤訊息
 */

export class CareBudgetError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'CareBudgetError';
  }
}

export const ErrorMessages = {
  INVALID_CMS_LEVEL: {
    code: 'INVALID_CMS_LEVEL',
    message: 'CMS level must be between 1 and 8',
    userMessage: '請選擇有效的失能等級（第 1-8 級）',
  },
  INVALID_INCOME_STATUS: {
    code: 'INVALID_INCOME_STATUS',
    message: 'Invalid income status',
    userMessage: '請選擇有效的收入身份（一般戶、中低收入戶或低收入戶）',
  },
  INVALID_CARE_TYPE: {
    code: 'INVALID_CARE_TYPE',
    message: 'Invalid care type',
    userMessage: '請選擇有效的照顧方式',
  },
  CALCULATION_FAILED: {
    code: 'CALCULATION_FAILED',
    message: 'Calculation failed',
    userMessage: '計算過程發生錯誤，請稍後再試或聯絡客服',
  },
  SUBSIDY_RULE_NOT_FOUND: {
    code: 'SUBSIDY_RULE_NOT_FOUND',
    message: 'Subsidy rule not found for CMS level',
    userMessage: '找不到對應的補助規則，請確認失能等級是否正確',
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network request failed',
    userMessage: '網路連線發生問題，請檢查您的網路連線',
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    userMessage: '發生未知錯誤，請重新整理頁面或聯絡客服',
  },
} as const;

/**
 * 創建友善的錯誤訊息
 */
export function createUserFriendlyError(
  errorType: keyof typeof ErrorMessages,
  originalError?: Error
): CareBudgetError {
  const errorInfo = ErrorMessages[errorType];
  
  if (originalError) {
    console.error(`[${errorInfo.code}]`, originalError);
  }
  
  return new CareBudgetError(
    errorInfo.message,
    errorInfo.code,
    errorInfo.userMessage
  );
}

/**
 * 錯誤日誌記錄（未來可接入 Sentry 等服務）
 */
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // 未來可以在這裡接入 Sentry
  // Sentry.captureException(error, { extra: context });
}

/**
 * 判斷是否為已知錯誤
 */
export function isKnownError(error: unknown): error is CareBudgetError {
  return error instanceof CareBudgetError;
}

/**
 * 取得錯誤的用戶訊息
 */
export function getUserErrorMessage(error: unknown): string {
  if (isKnownError(error)) {
    return error.userMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ErrorMessages.UNKNOWN_ERROR.userMessage;
}
