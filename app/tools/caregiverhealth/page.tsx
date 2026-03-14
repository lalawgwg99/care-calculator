import type { Metadata } from "next";
import DementiaSimulator from "@/components/DementiaSimulator";
import BurnoutCheck from "@/components/BurnoutCheck";

export const metadata: Metadata = {
  title: "照顧者健康工具 | 長照決策引擎",
  description: "失智症體驗模擬培養同理心，照顧者倦怠檢測評估身心狀態並配對支持資源。",
};

export default function CaregiverHealthPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">💆</span>
          <span className="text-[13px] font-semibold text-rose-800">照顧者健康</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          照顧者身心健康
        </h1>
        <p className="text-[15px] text-apple-gray-500">
          照顧好自己，才能給長輩最好的照顧
        </p>
      </div>

      <DementiaSimulator />

      <div id="burnout">
        <BurnoutCheck />
      </div>
    </main>
  );
}
