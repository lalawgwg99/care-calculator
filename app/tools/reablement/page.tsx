import type { Metadata } from "next";
import ReablementCards from "@/components/ReablementCards";

export const metadata: Metadata = {
  title: "微光復能任務卡 | 長照決策引擎",
  description: "每週復能活動卡片，身體活動、認知訓練、社交互動、日常生活四大面向，幫助長輩維持功能。",
};

export default function ReablementPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">🌟</span>
          <span className="text-[13px] font-semibold text-amber-800">復能活動</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          微光復能任務卡
        </h1>
        <p className="text-[15px] text-apple-gray-500 max-w-md mx-auto">
          每週挑選幾項活動，幫助長輩維持身心功能、找回生活樂趣
        </p>
      </div>

      <ReablementCards />
    </main>
  );
}
