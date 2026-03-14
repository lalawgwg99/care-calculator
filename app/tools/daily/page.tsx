import type { Metadata } from "next";
import MedicalPrep from "@/components/MedicalPrep";
import CaregiverComm from "@/components/CaregiverComm";

export const metadata: Metadata = {
  title: "日常照顧工具 | 長照決策引擎",
  description: "就診準備清單（生命徵象、用藥、問診問題）與家庭溝通模板（交班、會議、緊急通知）。",
};

export default function DailyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">📋</span>
          <span className="text-[13px] font-semibold text-cyan-800">日常照顧</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          日常照顧輔助工具
        </h1>
        <p className="text-[15px] text-apple-gray-500">
          讓就診更有效率，讓家人溝通更順暢
        </p>
      </div>

      <MedicalPrep />

      <div id="comm">
        <CaregiverComm />
      </div>
    </main>
  );
}
