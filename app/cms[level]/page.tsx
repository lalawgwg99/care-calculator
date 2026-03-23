import type { Metadata } from "next";
import Link from 'next/link';
import { CMS_LEVELS, CMS_LEVELS_STR, CARE_TYPES, CMS_LEVEL_INFO, type CMSLevel } from '@/constants/pseoData';

const CARE_TYPE_NAMES: Record<string, { name: string; desc: string }> = {
  'home-care': { name: '居家照顧', desc: '專業照服員到宅服務' },
  'day-care': { name: '日間照顧', desc: '白天日照中心、晚上回家' },
  'foreign-caregiver': { name: '外籍看護', desc: '聘僱外籍監護工' },
  'institution': { name: '住宿機構', desc: '全日型長照機構' },
};

interface PageProps {
  params: { level: string };
}

export async function generateStaticParams() {
  return CMS_LEVELS_STR.map((level) => ({
    level,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const level = parseInt(params.level) as CMSLevel;
  const levelInfo = CMS_LEVEL_INFO[level];

  return {
    title: `CMS 第${level}級補助多少錢？長照 ${levelInfo?.name || ''} 補助試算 | 長照3.0`,
    description: `了解 CMS 第${level}級（${levelInfo?.name}）的長照3.0補助金額。每月最高 $${levelInfo?.subsidy?.toLocaleString() || '0'}。支援一般戶、中低收入戶、低收入戶不同身份的自負額計算。`,
    keywords: [
      `CMS第${level}級補助`,
      `長照第${level}級`,
      `${levelInfo?.name}`,
      `長照補助試算`,
      `CMS${level}級`,
    ],
    openGraph: {
      title: `CMS 第${level}級 長照補助試算`,
      description: `計算您的長照補助。每月最高 $${levelInfo?.subsidy?.toLocaleString() || '0'}`,
    },
  };
}

export default function CMSLevelPage({ params }: PageProps) {
  const level = parseInt(params.level) as CMSLevel;
  const levelInfo = CMS_LEVEL_INFO[level];

  if (!levelInfo) {
    return <div>無效的CMS等級</div>;
  }

  const info = {
    monthly: levelInfo.subsidy,
    transport: levelInfo.hasTransport,
    respite: levelInfo.respite > 0 ? `$${levelInfo.respite.toLocaleString()}/年` : '無',
  };

  return (
    <main className="min-h-screen bg-apple-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pt-14 pb-16 text-center border-b border-orange-100/50">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-amber-700 mb-4">
            <Link href="/" className="hover:underline">首頁</Link>
            <span className="mx-2">/</span>
            <span>CMS 第{level}級</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6 border border-orange-100 text-[13px] font-semibold text-amber-800">
            📊 長照3.0補助試算
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-apple-gray-900 mb-4 leading-tight">
            CMS 第{level}級<br />
            <span className="text-apple-orange">{levelInfo.name}</span>補助多少？
          </h1>
          <p className="text-[16px] text-amber-900/70 leading-relaxed">
            依據衛福部2026年長照3.0最新法規，計算第{level}級的完整補助金額
          </p>
        </div>
      </section>

      {/* Subsidy Overview */}
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold text-apple-gray-900">
              第{level}級補助總覽
            </h2>
            <p className="text-[15px] text-amber-800/60 mt-1">
              {levelInfo.name} | 一般戶自負額16%
            </p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-[20px] p-5 border border-green-200 text-center">
                <div className="text-[13px] text-green-700 font-medium mb-2">照顧服務</div>
                <div className="text-[24px] font-bold text-green-900">
                  {info.monthly > 0 ? `$${info.monthly.toLocaleString()}` : '$0'}
                </div>
                <div className="text-[11px] text-green-600 mt-1">/月</div>
              </div>
              <div className={`${info.transport ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} rounded-[20px] p-5 border text-center`}>
                <div className={`text-[13px] ${info.transport ? 'text-blue-700' : 'text-gray-500'} font-medium mb-2`}>交通接送</div>
                <div className={`text-[24px] font-bold ${info.transport ? 'text-blue-900' : 'text-gray-400'}`}>
                  {info.transport ? '$1,680' : '無'}
                </div>
                <div className={`text-[11px] ${info.transport ? 'text-blue-600' : 'text-gray-400'} mt-1`}>{info.transport ? '/月' : '需4級以上'}</div>
              </div>
              <div className="bg-purple-50 rounded-[20px] p-5 border border-purple-200 text-center">
                <div className="text-[13px] text-purple-700 font-medium mb-2">輔具額度</div>
                <div className="text-[24px] font-bold text-purple-900">
                  {level >= 2 ? '$40,000' : '$0'}
                </div>
                <div className="text-[11px] text-purple-600 mt-1">每3年</div>
              </div>
              <div className="bg-amber-50 rounded-[20px] p-5 border border-amber-200 text-center">
                <div className="text-[13px] text-amber-700 font-medium mb-2">喘息服務</div>
                <div className="text-[24px] font-bold text-amber-900">
                  {info.respite}
                </div>
                <div className="text-[11px] text-amber-600 mt-1">/年</div>
              </div>
            </div>
          </div>
        </div>

        {/* Care Type Comparison */}
        <h3 className="text-[22px] font-bold text-apple-gray-900 mb-6 text-center">
          四種照顧方式補助比較
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {CARE_TYPES.map((type) => (
            <Link
              key={type}
              href={`/cms${level}/${type}`}
              className="bg-white rounded-[24px] p-6 border border-apple-gray-200/50 hover:shadow-apple-warm hover:border-orange-200/60 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[17px] font-bold text-apple-gray-900 group-hover:text-amber-800 transition-colors">
                    {CARE_TYPE_NAMES[type]?.name}
                  </h4>
                  <p className="text-[13px] text-apple-gray-500 mt-1">
                    {CARE_TYPE_NAMES[type]?.desc}
                  </p>
                </div>
                <span className="text-[18px] text-apple-orange group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
              <div className="text-[14px] text-apple-gray-600">
                {type === 'foreign-caregiver'
                  ? `補助額度 × 30%`
                  : '完整補助額度'}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[28px] p-8 border border-orange-100/60 text-center">
          <h3 className="text-[20px] font-bold text-apple-gray-900 mb-3">
            開始試算您的實際補助
          </h3>
          <p className="text-[15px] text-amber-900/70 mb-5">
            選擇您的收入身份，計算精確的自付額
          </p>
          <Link
            href={`/?cms=${level}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          >
            🧮 立即試算
          </Link>
        </div>
      </section>
    </main>
  );
}
