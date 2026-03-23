"use client";

import { useState, useMemo } from "react";
import { RESOURCES, RESOURCE_TYPES, CITIES, type Resource } from "@/constants/resourceData";

const TYPE_COLORS: Record<string, string> = {
  "政府服務": "bg-blue-100 text-blue-700",
  "民間機構": "bg-green-100 text-green-700",
  "支持團體": "bg-purple-100 text-purple-700",
  "法律資源": "bg-indigo-100 text-indigo-700",
  "教育資源": "bg-amber-100 text-amber-700",
};

export default function ResourceSearch() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [selectedCity, setSelectedCity] = useState<string>("全部");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      const matchType = selectedType === "全部" || r.type === selectedType;
      const matchCity = selectedCity === "全部" || r.cities.includes("全國") || r.cities.includes(selectedCity);
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      return matchType && matchCity && matchQuery;
    });
  }, [query, selectedType, selectedCity]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="bg-white rounded-[24px] shadow-apple border border-apple-gray-200/60 p-4">
        <input
          type="text"
          placeholder="搜尋資源名稱、關鍵字（例：喘息、失智、輔具）..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-[14px] bg-apple-gray-50 border border-apple-gray-200 text-[14px] focus:outline-none focus:border-amber-300 placeholder:text-apple-gray-400"
        />

        {/* Filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          {/* Type filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedType("全部")}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                selectedType === "全部" ? "bg-amber-500 text-white" : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
              }`}
            >
              全部類型
            </button>
            {RESOURCE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? "全部" : type)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                  selectedType === type ? TYPE_COLORS[type] + " ring-1 ring-current" : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* City filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1 rounded-full bg-apple-gray-100 text-apple-gray-600 text-[12px] font-medium border-none focus:outline-none focus:ring-1 focus:ring-amber-300"
          >
            <option value="全部">全部縣市</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="text-[13px] text-apple-gray-500 px-1">
        找到 <strong className="text-apple-gray-800">{filtered.length}</strong> 項資源
        {query && <span>（搜尋：「{query}」）</span>}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-apple-gray-400">
          <div className="text-[40px] mb-3">🔍</div>
          <p className="text-[15px]">沒有找到符合條件的資源</p>
          <p className="text-[13px] mt-1">試試調整搜尋條件或換個關鍵字</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onCall={handleCall} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource, onCall }: { resource: Resource; onCall: (phone: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-[20px] shadow-apple border border-apple-gray-200/40 overflow-hidden hover:shadow-apple-hover transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-[15px] text-apple-gray-900">{resource.name}</h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[resource.type]}`}>
                {resource.type}
              </span>
            </div>

            {/* City tags */}
            <div className="flex gap-1 flex-wrap mb-2">
              {resource.cities.map((city) => (
                <span key={city} className="text-[11px] bg-apple-gray-100 text-apple-gray-500 px-2 py-0.5 rounded-full">
                  {city}
                </span>
              ))}
              {resource.cmsEligibility.length > 0 && (
                <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  CMS {resource.cmsEligibility[0]}~{resource.cmsEligibility[resource.cmsEligibility.length - 1]}
                </span>
              )}
            </div>

            <p className={`text-[13px] text-apple-gray-600 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
              {resource.description}
            </p>
            {resource.description.length > 80 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[12px] text-amber-600 mt-1 hover:text-amber-700"
              >
                {expanded ? "收起" : "展開更多"}
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {resource.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        {(resource.phone || resource.url) && (
          <div className="flex gap-2 mt-3">
            {resource.phone && (
              <button
                onClick={() => onCall(resource.phone!)}
                className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                📞 {resource.phone}
              </button>
            )}
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[13px] font-medium px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                🔗 官網
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
