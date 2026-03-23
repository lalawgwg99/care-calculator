"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "首頁試算", icon: "🧮" },
  { href: "/blog", label: "知識庫", icon: "📚" },
  { href: "/tools", label: "實用工具", icon: "🛠️" },
  { href: "/search", label: "資源搜尋", icon: "🔍" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-orange-100/60 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[17px] text-apple-gray-900 hover:opacity-80 transition-opacity">
          <span className="text-[22px]">🧡</span>
          <span className="hidden sm:block">長照決策引擎</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                  isActive
                    ? "bg-amber-100 text-amber-800"
                    : "text-apple-gray-600 hover:bg-apple-gray-100 hover:text-apple-gray-900"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded-full hover:bg-apple-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <div className="w-5 h-0.5 bg-apple-gray-700 mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-apple-gray-700 mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-apple-gray-700 transition-all" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="sm:hidden border-t border-orange-100/60 bg-white/95 px-4 pb-4 pt-2" role="navigation" aria-label="行動版選單">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-[15px] font-medium transition-all mb-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-800"
                    : "text-apple-gray-700 hover:bg-apple-gray-100"
                }`}
              >
                <span className="text-[20px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
