"use client";

import { useState } from "react";

interface NavBarProps {
  currentSection?: "calculator" | "tools" | "search";
}

const NAV_ITEMS = [
  { id: "calculator" as const, label: "試算引擎", icon: "💰", href: "/" },
  { id: "tools" as const, label: "工具箱", icon: "🧰", href: "/tools" },
  { id: "search" as const, label: "找資源", icon: "🔍", href: "/search" },
];

export default function NavBar({ currentSection = "calculator" }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden sm:flex items-center justify-between max-w-5xl mx-auto px-6 py-3 sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-apple-gray-200/60">
        <a href="/" className="flex items-center gap-2">
          <span className="text-[20px]">🧡</span>
          <span className="text-[16px] font-bold text-apple-gray-900 tracking-tight">長照 3.0</span>
        </a>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`
                px-4 py-2 rounded-full text-[14px] font-medium transition-colors
                ${currentSection === item.id
                  ? "bg-apple-orange/10 text-apple-orange"
                  : "text-apple-gray-600 hover:bg-apple-gray-100 hover:text-apple-gray-900"
                }
              `}
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="tel:1966"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-apple-green/10 text-apple-green text-[14px] font-semibold hover:bg-apple-green/20 transition-colors"
        >
          📞 1966
        </a>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-apple-gray-200/60 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`
                flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors min-w-[64px]
                ${currentSection === item.id
                  ? "text-apple-orange"
                  : "text-apple-gray-500"
                }
              `}
            >
              <span className="text-[20px]">{item.icon}</span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </a>
          ))}
          <a
            href="tel:1966"
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-apple-green min-w-[64px]"
          >
            <span className="text-[20px]">📞</span>
            <span className="text-[11px] font-medium">1966</span>
          </a>
        </div>
      </div>
    </>
  );
}
