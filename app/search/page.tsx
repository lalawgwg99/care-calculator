import type { Metadata } from "next";
import ResourceSearch from "@/components/ResourceSearch";

export const metadata: Metadata = {
  title: "資源搜尋 | 長照決策引擎",
  description: "搜尋台灣各縣市長照資源，包含政府服務、民間機構、支持團體、法律資源與教育資源。",
};

export default function SearchPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
          <span className="text-[18px]">🔍</span>
          <span className="text-[13px] font-semibold text-amber-800">資源搜尋</span>
        </div>
        <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">
          台灣長照資源搜尋
        </h1>
        <p className="text-[15px] text-apple-gray-500 max-w-md mx-auto">
          找到您需要的政府服務、民間機構、支持團體與法律資源
        </p>
      </div>

      <ResourceSearch />

      {/* Footer note */}
      <div className="mt-8 bg-amber-50 border border-amber-100 rounded-[20px] p-4 text-center">
        <p className="text-[13px] text-amber-800">
          📢 資源如有異動，以各單位官網最新公告為準。若需完整服務清單，請撥打 <strong>1966</strong> 長照專線。
        </p>
      </div>
    </main>
  );
}
