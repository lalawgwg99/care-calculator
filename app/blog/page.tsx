import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: "長照知識庫｜費用試算、補助申請、照顧攻略 | 長照決策引擎",
  description:
    "Taiwan elder care articles: 外籍看護費用試算、長照四包錢說明、機構 vs 居家比較、失智症補助攻略、喘息服務申請、CMS 評估全解析。",
  keywords: ["長照知識", "長照補助說明", "照顧資源", "長照文章", "台灣長照3.0"],
  openGraph: {
    title: "長照知識庫 | 長照決策引擎",
    description: "外籍看護費用、四包錢補助、機構選擇、失智症照顧——全系列深度文章",
    locale: "zh_TW",
    type: "website",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  費用試算: "bg-orange-100 text-orange-700",
  補助制度: "bg-blue-100 text-blue-700",
  疾病照顧: "bg-rose-100 text-rose-700",
};

export default function BlogListPage() {
  return (
    <main className="min-h-screen bg-apple-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pt-14 pb-16 text-center border-b border-orange-100/50">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6 border border-orange-100 text-[13px] font-semibold text-amber-800">
            📚 長照知識庫
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-apple-gray-900 mb-4 leading-tight">
            把複雜的長照制度<br />說清楚、算明白
          </h1>
          <p className="text-[16px] text-amber-900/70 leading-relaxed">
            依據衛生福利部 2026 年最新法規，逐一拆解每個照顧家庭都需要知道的事。
          </p>
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[24px] shadow-sm hover:shadow-apple-warm border border-apple-gray-200/50 hover:border-orange-200/60 transition-all overflow-hidden"
            >
              {/* Category accent bar */}
              <div className={`h-1.5 w-full ${
                post.category === "費用試算" ? "bg-gradient-to-r from-apple-orange to-amber-400" :
                post.category === "補助制度" ? "bg-gradient-to-r from-apple-blue to-blue-400" :
                "bg-gradient-to-r from-apple-pink to-rose-400"
              }`} />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                  <span className="text-[12px] text-apple-gray-400">
                    約 {post.readingMinutes} 分鐘
                  </span>
                </div>

                <h2 className="text-[16px] font-bold text-apple-gray-900 mb-2 leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-[13px] text-apple-gray-500 leading-relaxed line-clamp-3 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[11px] text-apple-gray-400 border border-apple-gray-200 rounded-full px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[13px] font-semibold text-apple-orange group-hover:text-amber-600 transition-colors whitespace-nowrap">
                    閱讀 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-amber-50 to-orange-50 rounded-[28px] p-8 border border-orange-100/60 text-center">
          <p className="text-[15px] text-amber-900/70 mb-4">看完文章，直接試算您的情況</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          >
            🧮 立即免費試算補助金額
          </Link>
          <p className="text-[12px] text-amber-800/50 mt-3">30 秒完成，不需要註冊</p>
        </div>
      </section>
    </main>
  );
}
