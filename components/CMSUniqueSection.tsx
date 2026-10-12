import Icon from "@/components/Icon";
import type { CMSUniqueContent } from "@/constants/cmsUniqueContent";

/**
 * CMS 模板頁差異化區塊：為被 Google 標為重複的頁面渲染「該頁獨有」內容。
 * 包含常見問題（＋FAQ JSON-LD）、實際費用案例、申請情境差異三段。
 */
export default function CMSUniqueSection({ content }: { content: CMSUniqueContent }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 常見問題 */}
      <div className="bg-white rounded-[14px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-orange-100/50">
          <h2 className="text-[22px] font-bold text-apple-gray-900">常見問題</h2>
          <p className="text-[15px] text-amber-800/60 mt-1">
            這個級別／這種照顧方式最常被問的 3 件事
          </p>
        </div>
        <div className="p-8 space-y-6">
          {content.faq.map((item, i) => (
            <div key={i} className={i < content.faq.length - 1 ? "pb-6 border-b border-gray-100" : ""}>
              <h3 className="text-[16px] font-bold text-apple-gray-900 mb-2 flex gap-2">
                <span className="text-apple-orange shrink-0">Q{i + 1}</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-[14px] text-apple-gray-600 leading-relaxed pl-8">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 實際費用案例 */}
      <div className="bg-white rounded-[14px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-green-100/50">
          <h2 className="text-[22px] font-bold text-apple-gray-900">實際費用案例</h2>
          <p className="text-[15px] text-green-800/60 mt-1">{content.caseStudy.title}</p>
        </div>
        <div className="p-8">
          <ul className="space-y-3">
            {content.caseStudy.lines.map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-apple-gray-600 leading-relaxed">
                <Icon name="check" size={16} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          {content.caseStudy.note && (
            <p className="text-[12px] text-apple-gray-400 mt-5">{content.caseStudy.note}</p>
          )}
        </div>
      </div>

      {/* 申請情境差異 */}
      <div className="mb-8">
        <h2 className="text-[22px] font-bold text-apple-gray-900 mb-2 text-center">
          申請情境：跟其他級別哪裡不一樣
        </h2>
        <p className="text-[14px] text-apple-gray-500 text-center mb-6">
          同樣的長照制度，這個級別／這種組合的決策點不太一樣
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.contextPoints.map((point, i) => (
            <div
              key={i}
              className="bg-white rounded-[14px] p-6 border border-apple-gray-200/50"
            >
              <h3 className="text-[16px] font-bold text-apple-gray-900 mb-2">
                {point.title}
              </h3>
              <p className="text-[13px] text-apple-gray-600 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
