import type { Metadata } from "next";
import Link from 'next/link';
import { CMS_LEVEL_INFO, CARE_TYPE_INFO, INCOME_TYPE_INFO, CMS_LEVELS_STR, CARE_TYPES, type CareType, type CMSLevel, type IncomeType } from '@/constants/pseoData';

interface PageProps {
  params: { level: string; 'care-type': string };
}

export async function generateStaticParams() {
  const params: { level: string; 'care-type': string }[] = [];
  CMS_LEVELS_STR.forEach((level) => {
    CARE_TYPES.forEach((type) => {
      params.push({ level, 'care-type': type });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const level = parseInt(params.level) as CMSLevel;
  const careType = params['care-type'];
  const levelInfo = CMS_LEVEL_INFO[level];
  const careInfo = CARE_TYPE_INFO[careType as CareType];

  if (!levelInfo || !careInfo) {
    return { title: '無效頁面' };
  }

  const title = `CMS第${level}級${careInfo.name}補助多少錢？長照3.0每月補助與自付額試算`;
  const description = `了解CMS第${level}級（${levelInfo.name}）選擇${careInfo.name}的長照3.0補助金額。一般戶、中低收入戶、低收入戶的補助與自付額計算，含喘息服務、輔具補助詳細說明。`;

  return {
    title,
    description,
    keywords: [
      `CMS第${level}級${careInfo.name}`,
      `長照${careInfo.name}補助`,
      `CMS${level}級補助`,
      `${levelInfo.name}補助試算`,
      `長照3.0${careInfo.name}`,
    ],
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

// 计算补助金额
function calculateSubsidy(level: CMSLevel, careType: CareType, incomeType: IncomeType) {
  const levelInfo = CMS_LEVEL_INFO[level];
  const careInfo = CARE_TYPE_INFO[careType];
  const incomeInfo = INCOME_TYPE_INFO[incomeType];

  if (!levelInfo || !careInfo || !incomeInfo) return null;

  const baseSubsidy = levelInfo.subsidy * careInfo.subsidyRate;
  const copayRate = incomeInfo.copayRate;
  const copay = Math.floor(baseSubsidy * copayRate);
  const actualSubsidy = baseSubsidy - copay;

  const transportSubsidy = levelInfo.hasTransport ? Math.floor(1680 * (1 - (incomeType === 'general' ? 0.21 : incomeType === 'mid-low' ? 0.07 : 0))) : 0;
  const assistiveDeviceQuota = level >= 2 ? 40000 : 0;
  const respiteYearly = levelInfo.respite;
  const respiteMonthly = Math.floor(respiteYearly / 12);
  const respiteCopay = Math.floor(respiteMonthly * copayRate);

  return {
    baseSubsidy,
    copay,
    actualSubsidy,
    transportSubsidy,
    assistiveDeviceQuota,
    respiteMonthly,
    respiteCopay,
    totalSubsidy: actualSubsidy + transportSubsidy + (respiteMonthly - respiteCopay),
    totalCopay: copay + (levelInfo.hasTransport ? Math.floor(1680 * (incomeType === 'general' ? 0.21 : incomeType === 'mid-low' ? 0.07 : 0)) : 0) + respiteCopay,
  };
}

export default function CMSCareTypePage({ params }: PageProps) {
  const level = parseInt(params.level) as CMSLevel;
  const careType = params['care-type'] as CareType;
  const levelInfo = CMS_LEVEL_INFO[level];
  const careInfo = CARE_TYPE_INFO[careType];

  if (!levelInfo || !careInfo) {
    return <div className="p-8 text-center">無效的頁面參數</div>;
  }

  return (
    <main className="min-h-screen bg-apple-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pt-14 pb-16 text-center border-b border-orange-100/50">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-amber-700 mb-4">
            <Link href="/" className="hover:underline">首頁</Link>
            <span className="mx-2">/</span>
            <Link href={`/cms${level}`} className="hover:underline">CMS 第{level}級</Link>
            <span className="mx-2">/</span>
            <span>{careInfo.name}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6 border border-orange-100 text-[13px] font-semibold text-amber-800">
            📊 長照3.0補助試算
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-apple-gray-900 mb-4 leading-tight">
            CMS 第{level}級<br />
            <span className="text-apple-orange">{careInfo.name}</span>補助多少？
          </h1>
          <p className="text-[15px] text-amber-900/70 leading-relaxed">
            {careInfo.description}
          </p>
        </div>
      </section>

      {/* Subsidy Calculation */}
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold text-apple-gray-900">
              {careInfo.name}補助計算（一般戶）
            </h2>
            <p className="text-[15px] text-amber-800/60 mt-1">
              {levelInfo.name} | 自負額比例 {level === 1 ? '無補助' : '16%'}
            </p>
          </div>
          <div className="p-8">
            {level === 1 && careType !== 'institution' ? (
              <div className="text-center py-8">
                <div className="text-[48px] mb-4">ℹ️</div>
                <h3 className="text-[20px] font-bold text-apple-gray-900 mb-2">
                  CMS 第1級尚無照顧及專業服務補助
                </h3>
                <p className="text-[15px] text-apple-gray-500">
                  第1級屬於輕度失能，目前長照3.0尚未補助照顧服務。<br />
                  但仍可申請輔具補助及喘息服務（需達第2級）。
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 rounded-[20px] p-5 border border-green-200 text-center">
                    <div className="text-[13px] text-green-700 font-medium mb-2">政府每月補助</div>
                    <div className="text-[32px] font-bold text-green-900">
                      ${calculateSubsidy(level, careType, 'general')?.actualSubsidy.toLocaleString() || '0'}
                    </div>
                    <div className="text-[12px] text-green-600 mt-1">照顧服務</div>
                  </div>
                  <div className="bg-red-50 rounded-[20px] p-5 border border-red-200 text-center">
                    <div className="text-[13px] text-red-700 font-medium mb-2">您每月自付</div>
                    <div className="text-[32px] font-bold text-red-900">
                      ${calculateSubsidy(level, careType, 'general')?.copay.toLocaleString() || '0'}
                    </div>
                    <div className="text-[12px] text-red-600 mt-1">自負額16%</div>
                  </div>
                </div>

                {careType === 'foreign-caregiver' && (
                  <div className="bg-amber-50 rounded-[20px] p-5 border border-amber-200 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-[24px]">⚠️</span>
                      <div>
                        <h4 className="text-[15px] font-bold text-amber-900 mb-1">外籍看護補助說明</h4>
                        <p className="text-[13px] text-amber-800 leading-relaxed">
                          聘僱外籍看護工時，長照補助額度為原本的30%。以本案例而言，補助額度從 ${CMS_LEVEL_INFO[level].subsidy.toLocaleString()} 降至 ${Math.floor(CMS_LEVEL_INFO[level].subsidy * 0.3).toLocaleString()} 元。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Breakdown */}
                <h3 className="text-[18px] font-bold text-apple-gray-900 mb-4">補助明細</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-[15px] text-apple-gray-600">照顧及專業服務</span>
                    <span className="text-[15px] font-semibold text-green-700">
                      補助 ${calculateSubsidy(level, careType, 'general')?.actualSubsidy.toLocaleString()} / 自付 ${calculateSubsidy(level, careType, 'general')?.copay.toLocaleString()}
                    </span>
                  </div>
                  {levelInfo.hasTransport && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-[15px] text-apple-gray-600">交通接送服務</span>
                      <span className="text-[15px] font-semibold text-green-700">
                        補助 $1,344 / 自付 $336
                      </span>
                    </div>
                  )}
                  {levelInfo.respite > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-[15px] text-apple-gray-600">喘息服務（月攤）</span>
                      <span className="text-[15px] font-semibold text-green-700">
                        補助 ${Math.floor(levelInfo.respite / 12 * 0.84).toLocaleString()} / 自付 ${Math.floor(levelInfo.respite / 12 * 0.16).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {level >= 2 && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[15px] text-apple-gray-600">輔具及無障礙改造</span>
                      <span className="text-[15px] font-semibold text-blue-700">
                        每3年最高 $40,000
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Income Type Comparison */}
        <h3 className="text-[20px] font-bold text-apple-gray-900 mb-6 text-center">
          不同身份補助比較
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['general', 'mid-low', 'low'] as const).map((income) => {
            const calc = calculateSubsidy(level, careType, income);
            return (
              <div key={income} className="bg-white rounded-[24px] p-6 border border-apple-gray-200/50">
                <h4 className="text-[16px] font-bold text-apple-gray-900 mb-2">
                  {INCOME_TYPE_INFO[income].name}
                </h4>
                <p className="text-[12px] text-apple-gray-500 mb-4">
                  自負額 {income === 'general' ? '16%' : income === 'mid-low' ? '5%' : '0%'}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-apple-gray-600">月補助</span>
                    <span className="text-[14px] font-bold text-green-700">
                      ${calc?.actualSubsidy.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-apple-gray-600">月自付</span>
                    <span className="text-[14px] font-bold text-red-700">
                      ${calc?.copay.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[28px] p-8 border border-orange-100/60 text-center">
          <h3 className="text-[20px] font-bold text-apple-gray-900 mb-3">
            開始完整試算
          </h3>
          <p className="text-[15px] text-amber-900/70 mb-5">
            選擇您的實際情況，產生詳細的5年財務預測
          </p>
          <Link
            href={`/?cms=${level}&income=${careType === 'foreign-caregiver' ? 'general' : 'general'}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          >
            🧮 立即試算長照補助
          </Link>
        </div>

        {/* Related Links */}
        <div className="mt-8">
          <h3 className="text-[18px] font-bold text-apple-gray-900 mb-4">相關頁面</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CARE_TYPES.filter(t => t !== careType).map((type) => (
              <Link
                key={type}
                href={`/cms${level}/${type}`}
                className="bg-white rounded-[16px] p-4 border border-apple-gray-200/50 hover:border-orange-200/60 transition-all text-center group"
              >
                <div className="text-[14px] font-semibold text-apple-gray-700 group-hover:text-amber-800 transition-colors">
                  {CARE_TYPE_INFO[type].name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
