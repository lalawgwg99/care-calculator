"use client";

import { Component, ReactNode } from "react";
import { logError, getUserErrorMessage } from "@/lib/errors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary 組件
 * 捕獲子組件中的錯誤，防止整個應用崩潰
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // 記錄錯誤
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary',
    });

    // 調用自定義錯誤處理
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定義 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默認錯誤 UI
      const userMessage = getUserErrorMessage(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            {/* 錯誤圖示 */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 錯誤標題 */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              發生錯誤
            </h2>

            {/* 錯誤訊息 */}
            <p className="text-gray-600 text-center mb-6">
              {userMessage}
            </p>

            {/* 技術細節（開發環境顯示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  技術細節
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* 操作按鈕 */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                重新嘗試
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                重新載入頁面
              </button>
            </div>

            {/* 客服資訊 */}
            <p className="text-xs text-gray-500 text-center mt-6">
              如果問題持續發生，請聯絡客服
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 簡化版 Error Boundary Hook（用於函數組件）
 */
export function useErrorHandler() {
  const handleError = (error: Error) => {
    logError(error);
    throw error; // 拋出錯誤讓 Error Boundary 捕獲
  };

  return { handleError };
}
