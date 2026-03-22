import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS, getBlogPost, type ContentBlock } from "@/constants/blogPosts";

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: "長照決策引擎" }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: "zh_TW",
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="text-[20px] sm:text-[22px] font-bold text-apple-gray-900 mt-10 mb-3 tracking-tight">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="text-[17px] font-bold text-apple-gray-800 mt-7 mb-2">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-[15px] sm:text-[16px] text-apple-gray-700 leading-[1.8] mb-4">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mb-4 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[15px] text-apple-gray-700 leading-relaxed">
              <span className="text-apple-orange mt-1 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="mb-4 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[15px] text-apple-gray-700 leading-relaxed">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-orange/10 text-apple-orange text-[12px] font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div key={i} className="overflow-x-auto mb-6 -mx-4 sm:mx-0">
          <table className="w-full min-w-[520px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-amber-50 border-b-2 border-orange-200/60">
                {block.headers.map((h, j) => (
                  <th key={j} className="text-left px-4 py-3 font-semibold text-apple-gray-700 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-apple-gray-50/50"}>
                  {row.map((cell, k) => (
                    <td key={k} className={`px-4 py-3 border-b border-apple-gray-200/40 text-apple-gray-700 leading-snug ${k === 0 ? "font-medium" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <div key={i} className="my-5 bg-green-50 border-l-4 border-apple-green rounded-r-[16px] p-5">
          <p className="text-[14px] text-green-800 leading-relaxed">
            <span className="font-bold">💡 小技巧：</span>{block.text}
          </p>
        </div>
      );
    case "warning":
      return (
        <div key={i} className="my-5 bg-amber-50 border-l-4 border-apple-orange rounded-r-[16px] p-5">
          <p className="text-[14px] text-amber-800 leading-relaxed">
            <span className="font-bold">⚠️ 注意：</span>{block.text}
          </p>
        </div>
      );
    case "info":
      return (
        <div key={i} className="my-5 bg-blue-50 border-l-4 border-apple-blue rounded-r-[16px] p-5">
          <p className="text-[14px] text-blue-800 leading-relaxed">
            <span className="font-bold">📌 補充：</span>{block.text}
          </p>
        </div>
      );
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  // JSON-LD schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "長照決策引擎" },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "zh-TW",
    keywords: post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: "https://care-calculator.vercel.app" },
      { "@type": "ListItem", position: 2, name: "知識庫", item: "https://care-calculator.vercel.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://care-calculator.vercel.app/blog/${post.slug}` },
    ],
  };

  const faqSchema = post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="min-h-screen bg-apple-gray-50 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
          <nav className="flex items-center gap-2 text-[13px] text-apple-gray-400">
            <Link href="/" className="hover:text-apple-gray-700 transition-colors">首頁</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-apple-gray-700 transition-colors">知識庫</Link>
            <span>/</span>
            <span className="text-apple-gray-600 line-clamp-1">{post.category}</span>
          </nav>
        </div>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto px-4 pt-4 pb-8 border-b border-apple-gray-200/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[12px] font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-[12px] text-apple-gray-400">約 {post.readingMinutes} 分鐘</span>
            <span className="text-[12px] text-apple-gray-400">·</span>
            <span className="text-[12px] text-apple-gray-400">更新 {post.updatedAt}</span>
          </div>
          <h1 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-apple-gray-900 leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-[15px] text-apple-gray-500 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-4 py-8">
          {post.content.map((block, i) => renderBlock(block, i))}
        </article>

        {/* FAQ Section */}
        {post.faq.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 mb-8">
            <h2 className="text-[20px] font-bold text-apple-gray-900 mb-5">
              常見問題 FAQ
            </h2>
            <div className="space-y-4">
              {post.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-apple-gray-200/60 p-6 shadow-sm">
                  <h3 className="text-[15px] font-bold text-apple-gray-900 mb-2">
                    Q: {item.q}
                  </h3>
                  <p className="text-[14px] text-apple-gray-600 leading-relaxed">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tool CTA */}
        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-[28px] p-8 border border-orange-100/60 text-center">
            <div className="text-[28px] mb-3">🧡</div>
            <h2 className="text-[20px] font-bold text-apple-gray-900 mb-2">
              了解概念之後，算出你的確切數字
            </h2>
            <p className="text-[14px] text-amber-800/70 mb-5 leading-relaxed">
              每個家庭的情況不同。輸入長輩的 CMS 等級和收入身分，30 秒算出精確的補助金額和自付額。
            </p>
            <Link
              href={post.relatedToolHref}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
            >
              🧮 {post.relatedToolLabel}
            </Link>
            <p className="text-[12px] text-amber-800/40 mt-3">免費使用，不需要註冊</p>
          </div>
        </section>

        {/* Related articles */}
        <section className="max-w-3xl mx-auto px-4 mt-12">
          <h2 className="text-[17px] font-bold text-apple-gray-900 mb-4">相關文章</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2).map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="bg-white rounded-[18px] p-5 border border-apple-gray-200/60 shadow-sm hover:shadow-apple-warm hover:border-orange-200/60 transition-all group"
              >
                <span className="text-[11px] font-semibold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                  {related.category}
                </span>
                <p className="text-[14px] font-semibold text-apple-gray-800 mt-2 mb-1 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
                  {related.title}
                </p>
                <span className="text-[13px] text-apple-orange font-medium">閱讀 →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
