import type { Metadata } from "next";
import StartupIdeas from "@/components/StartupIdeas";

export const metadata: Metadata = {
  title: "5萬元創業方案 | 長照決策引擎",
  description:
    "台幣5萬元以內可啟動的7個創業方案，適合照顧者補貼長照費用。線上教學、網拍、寵物保母、居家烘焙等低風險副業點子，含啟動成本與月收入估算。",
};

export default function StartupIdeasPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">💡</span>
          <span className="text-[13px] font-semibold text-violet-800">創業 & 收入</span>
        </div>
        <h1 className="text-[32px] font-bold text-apple-gray-900 mb-3">
          台幣 5 萬元創業方案
        </h1>
        <p className="text-[16px] text-apple-gray-500 max-w-xl mx-auto leading-relaxed">
          長照費用壓力大？以下 7 個方案，預算在 NT$5 萬以內即可啟動，
          幫照顧家庭創造額外收入來源。
        </p>
      </div>

      <StartupIdeas />
    </main>
  );
}
