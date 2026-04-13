"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/70 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[17px] text-apple-gray-900 hover:opacity-80 transition-opacity">
          <Image src="/logo-mark.svg" alt="長照決策引擎 Logo" width={24} height={24} className="rounded-[7px]" priority />
          <span className="hidden sm:block">長照決策引擎</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-orange-200/60 shadow-sm"
                    : "text-apple-gray-600 hover:bg-white hover:text-apple-gray-900 hover:shadow-sm"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/#calculator"
            className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[13px] font-semibold shadow-md shadow-orange-200/50 hover:shadow-lg transition-shadow"
          >
            立即試算
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded-full hover:bg-white transition-colors border border-transparent hover:border-apple-gray-200"
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
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-orange-200/60"
                    : "text-apple-gray-700 hover:bg-apple-gray-100"
                }`}
              >
                <span className="text-[20px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/#calculator"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center rounded-[14px] px-4 py-3 text-[15px] font-semibold text-white bg-gradient-to-r from-apple-orange to-apple-pink"
          >
            立即試算
          </Link>
        </div>
      )}
    </nav>
  );
}
