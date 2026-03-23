import type { Metadata } from "next";
import ConditionProfiles from "@/components/ConditionProfiles";
import CareTimeline from "@/components/CareTimeline";
import FacilityChecklist from "@/components/FacilityChecklist";

export const metadata: Metadata = {
  title: "疾病照顧指引 | 長照決策引擎",
  description: "失智症、中風、帕金森氏症、骨折等常見疾病的照顧檔案、照顧歷程時間軸與機構評估清單。",
};

export default function ConditionsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">🫀</span>
          <span className="text-[13px] font-semibold text-purple-800">疾病照顧</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          疾病照顧指引
        </h1>
        <p className="text-[15px] text-apple-gray-500">
          了解常見疾病的照顧要點、病程進展與機構選擇
        </p>
      </div>

      <ConditionProfiles />

      <div id="timeline">
        <CareTimeline />
      </div>

      <div id="checklist">
        <FacilityChecklist />
      </div>
    </main>
  );
}
