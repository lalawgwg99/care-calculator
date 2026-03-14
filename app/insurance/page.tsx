import type { Metadata } from "next";
import InsuranceAddon from "@/components/InsuranceAddon";
import LegalNavigator from "@/components/LegalNavigator";

export const metadata: Metadata = {
  title: "保險補充 & 法律引導 | 長照決策引擎",
  description: "計算私人保險補足長照缺口，以及監護宣告、安養信託、遺囑規劃等法律事項逐步引導。",
};

export default function InsurancePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">🛡️</span>
          <span className="text-[13px] font-semibold text-blue-800">財務 & 法律規劃</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          保險補充與法律準備
        </h1>
        <p className="text-[15px] text-apple-gray-500">
          了解保險如何填補長照缺口，同時做好法律預先規劃
        </p>
      </div>

      <InsuranceAddon />

      <div id="legal">
        <LegalNavigator />
      </div>
    </main>
  );
}
