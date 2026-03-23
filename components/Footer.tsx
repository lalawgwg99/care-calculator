import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-apple-gray-200/50 mt-16 no-print">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8">
          {/* 左欄：品牌說明 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo-mark.svg" alt="長照決策引擎 Logo" width={24} height={24} className="rounded-[7px]" />
              <span className="text-[16px] font-bold text-apple-gray-900">長照決策引擎</span>
            </div>
            <p className="text-[13px] text-apple-gray-500 leading-relaxed mb-3">
              免費、無廣告的長照財務試算工具，幫助台灣家庭做出最適合的照顧決策。
            </p>
            <p className="text-[12px] text-apple-gray-400 leading-relaxed">
              資料依據：衛生福利部 2026 年長照 3.0 最新法規
            </p>
          </div>

          {/* 中欄：快速連結 */}
          <div>
            <h4 className="text-[13px] font-semibold text-apple-gray-700 uppercase tracking-wide mb-4">
              快速連結
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "首頁試算" },
                { href: "/blog", label: "長照知識庫" },
                { href: "/tools", label: "實用工具" },
                { href: "/search", label: "資源搜尋" },
                { href: "/insurance", label: "保險缺口試算" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-apple-gray-500 hover:text-apple-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 右欄：緊急聯絡 */}
          <div>
            <h4 className="text-[13px] font-semibold text-apple-gray-700 uppercase tracking-wide mb-4">
              需要幫助？
            </h4>
            <div className="space-y-3">
              <a
                href="tel:1966"
                className="flex items-start gap-3 bg-orange-50 rounded-[14px] px-4 py-3 border border-orange-100/60 hover:bg-orange-100/60 transition-colors group"
              >
                <span className="text-[20px] mt-0.5">📞</span>
                <div>
                  <div className="text-[15px] font-bold text-apple-orange group-hover:underline">
                    長照專線 1966
                  </div>
                  <div className="text-[12px] text-amber-700/70 mt-0.5">
                    免費 · 週一至五 8:30–17:30
                  </div>
                </div>
              </a>
              <a
                href="tel:1925"
                className="flex items-start gap-3 bg-blue-50 rounded-[14px] px-4 py-3 border border-blue-100/60 hover:bg-blue-100/60 transition-colors group"
              >
                <span className="text-[20px] mt-0.5">💙</span>
                <div>
                  <div className="text-[15px] font-bold text-blue-600 group-hover:underline">
                    安心專線 1925
                  </div>
                  <div className="text-[12px] text-blue-700/70 mt-0.5">
                    24 小時 · 照顧者心理支援
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 底部版權 */}
        <div className="pt-6 border-t border-apple-gray-200/40 text-center">
          <p className="text-[12px] text-apple-gray-400 leading-relaxed">
            © 2026 長照決策引擎 · 本工具依 2026 衛福部長照 3.0 法規設計，實際補助金額以各縣市照顧管理中心核定為準。
          </p>
        </div>
      </div>
    </footer>
  );
}
