"use client";

import { useState } from "react";

export default function EmergencyAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-red-50 border border-red-200/60 rounded-[20px] px-5 py-4 text-left hover:bg-red-100/60 transition-colors"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="flex items-center gap-3">
          <span className="text-[22px]">🚨</span>
          <span className="text-[16px] font-semibold text-red-800">
            剛發生緊急狀況？不知道先做什麼？
          </span>
        </span>
        <span
          className={`text-[20px] text-red-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-red-50/60 border border-red-200/40 border-t-0 rounded-b-[20px] px-5 pb-6 pt-4">
          <p className="text-[14px] text-red-800/70 mb-5 leading-relaxed">
            骨折、中風、重病出院⋯⋯突發狀況讓家屬措手不及。以下 4 步驟，協助您在最短時間安排好照顧。
          </p>
          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "立刻撥打長照專線",
                desc: "告知「需要緊急評估」，將優先安排到府，勿等一般預約。",
                cta: "📞 撥打 1966（免費）",
                href: "tel:1966",
                color: "bg-red-600",
              },
              {
                num: "2",
                title: "請醫院社工協助出院銜接",
                desc: "住院中可直接請護理站協助聯繫醫務社工師，要求「出院準備銜接長照服務」。",
                cta: null,
                href: null,
                color: "bg-red-500",
              },
              {
                num: "3",
                title: "申請緊急喘息服務",
                desc: "若家中長輩已有長照資格，撥 1966 申請「緊急喘息」，最快 24 小時內可安排臨時替代照顧。",
                cta: null,
                href: null,
                color: "bg-red-500",
              },
              {
                num: "4",
                title: "您也需要支持",
                desc: "照顧者的情緒同樣重要。任何時間都可撥打安心專線，24 小時免費心理陪伴。",
                cta: "💙 撥打 1925",
                href: "tel:1925",
                color: "bg-blue-600",
              },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full ${item.color} text-white text-[12px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5`}
                >
                  {item.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-apple-gray-900 mb-0.5">{item.title}</div>
                  <div className="text-[13px] text-apple-gray-500 leading-relaxed">{item.desc}</div>
                </div>
                {item.href && item.cta && (
                  <a
                    href={item.href}
                    className={`flex-shrink-0 text-[13px] font-bold text-white ${item.color} hover:opacity-90 transition-opacity px-3 py-1.5 rounded-full`}
                  >
                    {item.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
