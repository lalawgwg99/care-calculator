import type { Metadata } from "next";
import Link from 'next/link';
import { TAIWAN_CITIES, CMS_LEVELS, CMS_LEVEL_INFO, CARE_TYPE_INFO } from '@/constants/pseoData';

interface PageProps {
  params: { city: string };
}

// 台湾县市元数据
const CITY_INFO: Record<string, {
  name: string;
  description: string;
  ltcHotline: string;
  address: string;
  coords: { lat: number; lng: number };
}> = {
  'taipei': {
    name: '台北市',
    description: '台北市長期照顧服務申請與補助資訊',
    ltcHotline: '02-2522-1212',
    address: '台北市信義區市府路1號',
    coords: { lat: 25.0330, lng: 121.5654 }
  },
  'new-taipei': {
    name: '新北市',
    description: '新北市長期照顧服務申請與補助資訊',
    ltcHotline: '02-2960-3456',
    address: '新北市板橋區中山路161號',
    coords: { lat: 25.0160, lng: 121.4627 }
  },
  'taoyuan': {
    name: '桃園市',
    description: '桃園市長期照顧服務申請與補助資訊',
    ltcHotline: '03-332-1322',
    address: '桃園市桃園區縣府路1號',
    coords: { lat: 24.9936, lng: 121.3010 }
  },
  'taichung': {
    name: '台中市',
    description: '台中市長期照顧服務申請與補助資訊',
    ltcHotline: '04-2228-5668',
    address: '台中市西屯區台灣大道3段99號',
    coords: { lat: 24.1477, lng: 120.6736 }
  },
  'tainan': {
    name: '台南市',
    description: '台南市長期照顧服務申請與補助資訊',
    ltcHotline: '06-299-1111',
    address: '台南市安平區永華路2段6號',
    coords: { lat: 22.9999, lng: 120.2269 }
  },
  'kaohsiung': {
    name: '高雄市',
    description: '高雄市長期照顧服務申請與補助資訊',
    ltcHotline: '07-337-3370',
    address: '高雄市苓雅區四維3路2號',
    coords: { lat: 22.6273, lng: 120.3014 }
  },
  'keelung': {
    name: '基隆市',
    description: '基隆市長期照顧服務申請與補助資訊',
    ltcHotline: '02-2420-1122',
    address: '基隆市義一路1號',
    coords: { lat: 25.1288, lng: 121.7419 }
  },
  'hsinchu-city': {
    name: '新竹市',
    description: '新竹市長期照顧服務申請與補助資訊',
    ltcHotline: '03-535-2386',
    address: '新竹市北區中正路120號',
    coords: { lat: 24.8138, lng: 120.9675 }
  },
  'hsinchu-county': {
    name: '新竹縣',
    description: '新竹縣長期照顧服務申請與補助資訊',
    ltcHotline: '03-551-8101',
    address: '新竹縣竹北市光明六路10號',
    coords: { lat: 24.8387, lng: 121.0177 }
  },
  'miaoli': {
    name: '苗栗縣',
    description: '苗栗縣長期照顧服務申請與補助資訊',
    ltcHotline: '037-559-178',
    address: '苗栗縣苗栗市縣府路100號',
    coords: { lat: 24.5603, lng: 120.8214 }
  },
  'changhua': {
    name: '彰化縣',
    description: '彰化縣長期照顧服務申請與補助資訊',
    ltcHotline: '04-726-0100',
    address: '彰化縣彰化市中山路2段416號',
    coords: { lat: 24.0757, lng: 120.5160 }
  },
  'nantou': {
    name: '南投縣',
    description: '南投縣長期照顧服務申請與補助資訊',
    ltcHotline: '049-222-2104',
    address: '南投縣南投市光明路1號',
    coords: { lat: 23.9150, lng: 120.6637 }
  },
  'yunlin': {
    name: '雲林縣',
    description: '雲林縣長期照顧服務申請與補助資訊',
    ltcHotline: '05-537-3988',
    address: '雲林縣斗六市雲林路2段515號',
    coords: { lat: 23.7092, lng: 120.4313 }
  },
  'chiayi-city': {
    name: '嘉義市',
    description: '嘉義市長期照顧服務申請與補助資訊',
    ltcHotline: '05-225-4321',
    address: '嘉義市中山路199號',
    coords: { lat: 23.4801, lng: 120.4491 }
  },
  'chiayi-county': {
    name: '嘉義縣',
    description: '嘉義縣長期照顧服務申請與補助資訊',
    ltcHotline: '05-362-0600',
    address: '嘉義縣太保市祥和一路1號',
    coords: { lat: 23.4520, lng: 120.2555 }
  },
  'pingtung': {
    name: '屏東縣',
    description: '屏東縣長期照顧服務申請與補助資訊',
    ltcHotline: '08-735-1919',
    address: '屏東縣屏東市自由路527號',
    coords: { lat: 22.5519, lng: 120.5487 }
  },
  'yilan': {
    name: '宜蘭縣',
    description: '宜蘭縣長期照顧服務申請與補助資訊',
    ltcHotline: '03-935-9900',
    address: '宜蘭縣宜蘭市縣政北路1號',
    coords: { lat: 24.7021, lng: 121.7377 }
  },
  'hualien': {
    name: '花蓮縣',
    description: '花蓮縣長期照顧服務申請與補助資訊',
    ltcHotline: '03-822-5171',
    address: '花蓮縣花蓮市中美路67號',
    coords: { lat: 23.9872, lng: 121.6011 }
  },
  'taitung': {
    name: '台東縣',
    description: '台東縣長期照顧服務申請與補助資訊',
    ltcHotline: '089-322-036',
    address: '台東縣台東市中山路268號',
    coords: { lat: 22.7973, lng: 121.0714 }
  },
  'penghu': {
    name: '澎湖縣',
    description: '澎湖縣長期照顧服務申請與補助資訊',
    ltcHotline: '06-926-5280',
    address: '澎湖縣馬公市治平路28號',
    coords: { lat: 23.5655, lng: 119.5793 }
  },
  'kinmen': {
    name: '金門縣',
    description: '金門縣長期照顧服務申請與補助資訊',
    ltcHotline: '082-312-346',
    address: '金門縣金城鎮民生路45號',
    coords: { lat: 24.4489, lng: 118.3768 }
  },
  'lienchiang': {
    name: '連江縣',
    description: '連江縣長期照顧服務申請與補助資訊',
    ltcHotline: '0836-22344',
    address: '連江縣南竿鄉介壽村76號',
    coords: { lat: 26.1507, lng: 119.9389 }
  },
};

export async function generateStaticParams() {
  return TAIWAN_CITIES.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityInfo = CITY_INFO[params.city];

  if (!cityInfo) {
    return { title: '無效頁面' };
  }

  const title = `${cityInfo.name}長照補助申請｜${cityInfo.name}長照中心電話、補助金額試算 | 長照3.0`;
  const description = `${cityInfo.name}長期照顧服務補助申請攻略。提供${cityInfo.name}照顧管理中心電話(${cityInfo.ltcHotline})、申請資格、補助金額試算，一次了解${cityInfo.name}的長照四包錢補助。`;

  return {
    title,
    description,
    keywords: [
      `${cityInfo.name}長照`,
      `${cityInfo.name}長照補助`,
      `${cityInfo.name}照顧管理中心`,
      `${cityInfo.name}長照專線`,
      `${cityInfo.name}喘息服務`,
      `${cityInfo.name}輔具補助`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    other: {
      'geo.region': 'TW',
      'geo.placename': cityInfo.name,
    },
  };
}

export default function CityLTCRevenuePage({ params }: PageProps) {
  const cityInfo = CITY_INFO[params.city];

  if (!cityInfo) {
    return <div className="p-8 text-center">無效的縣市參數</div>;
  }

  // 获取区域内的城市（用于相关链接）
  const region = TAIWAN_CITIES.find(c => c.slug === params.city)?.region || '';
  const sameRegionCities = TAIWAN_CITIES.filter(c => c.region === region && c.slug !== params.city);

  return (
    <main className="min-h-screen bg-apple-gray-50 pb-20">
      {/* Header with Geo-LD */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pt-14 pb-16 text-center border-b border-orange-100/50">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-amber-700 mb-4">
            <Link href="/" className="hover:underline">首頁</Link>
            <span className="mx-2">/</span>
            <span>{cityInfo.name}長照</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6 border border-orange-100 text-[13px] font-semibold text-amber-800">
            📍 {region}
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-apple-gray-900 mb-4 leading-tight">
            {cityInfo.name}長照補助申請<br />
            <span className="text-apple-orange">照顧管理中心</span>
          </h1>
          <p className="text-[16px] text-amber-900/70 leading-relaxed">
            {cityInfo.description}。依據衛福部2026年長照3.0最新法規，全台灣補助標準一致。
          </p>
        </div>

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": `${cityInfo.name}長期照顧服務管理中心`,
              "description": cityInfo.description,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": cityInfo.name,
                "addressCountry": "TW"
              },
              "telephone": cityInfo.ltcHotline,
              "areaServed": {
                "@type": "City",
                "name": cityInfo.name,
                "containedInPlace": {
                  "@type": "Country",
                  "name": "台灣"
                }
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": cityInfo.coords.lat,
                "longitude": cityInfo.coords.lng
              }
            })
          }}
        />
      </section>

      {/* Contact Info */}
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold text-apple-gray-900">
              📞 {cityInfo.name}照顧管理中心
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-[20px] p-6 border border-blue-200">
                <div className="text-[14px] text-blue-700 font-medium mb-2">長照專線（24小時）</div>
                <a href={`tel:${cityInfo.ltcHotline.replace(/-/g, '')}`} className="text-[28px] font-bold text-blue-900 hover:underline">
                  {cityInfo.ltcHotline}
                </a>
                <p className="text-[12px] text-blue-600 mt-2">或撥打1966（手機）</p>
              </div>
              <div className="bg-green-50 rounded-[20px] p-6 border border-green-200">
                <div className="text-[14px] text-green-700 font-medium mb-2">服務地址</div>
                <p className="text-[18px] font-bold text-green-900">
                  {cityInfo.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-green-700 hover:underline mt-2 inline-block"
                >
                  在地圖中開啟 →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Nationwide Uniform Subsidy Notice */}
        <div className="bg-amber-50 rounded-[24px] p-6 border border-amber-200 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-[32px]">ℹ️</span>
            <div>
              <h3 className="text-[17px] font-bold text-amber-900 mb-2">
                全台灣長照補助標準一致
              </h3>
              <p className="text-[14px] text-amber-800 leading-relaxed">
                依據衛福部公告，長照3.0的四包錢補助額度在全國各縣市皆相同。
                {cityInfo.name}的補助金額與台北市、高雄市完全一致。
                差異主要在於服務提供的可近性與等待時間。
              </p>
            </div>
          </div>
        </div>

        {/* Quick Calculator */}
        <h3 className="text-[22px] font-bold text-apple-gray-900 mb-6 text-center">
          快速試算{cityInfo.name}補助金額
        </h3>
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-orange-100/50">
            <h4 className="text-[18px] font-bold text-apple-gray-900">
              選擇失能等級開始試算
            </h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-3 mb-6">
              {CMS_LEVELS.map((level) => (
                <Link
                  key={level}
                  href={`/cms${level}`}
                  className="bg-apple-gray-50 hover:bg-orange-50 border border-apple-gray-200 hover:border-orange-300 rounded-[14px] p-4 text-center transition-all group"
                >
                  <div className="text-[16px] font-bold text-apple-gray-900 group-hover:text-apple-orange">
                    CMS {level}
                  </div>
                  <div className="text-[11px] text-apple-gray-500 mt-1">
                    {CMS_LEVEL_INFO[level].name}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
              >
                🧮 開始完整試算
              </Link>
            </div>
          </div>
        </div>

        {/* Related Cities */}
        {sameRegionCities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[18px] font-bold text-apple-gray-900 mb-4">同區域其他縣市</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sameRegionCities.slice(0, 4).map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/長照補助`}
                  className="bg-white rounded-[16px] p-4 border border-apple-gray-200/50 hover:border-orange-200/60 transition-all text-center group"
                >
                  <div className="text-[15px] font-semibold text-apple-gray-700 group-hover:text-amber-800 transition-colors">
                    {city.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[28px] p-8 border border-orange-100/60 text-center">
          <h3 className="text-[20px] font-bold text-apple-gray-900 mb-3">
            了解{cityInfo.name}長照服務資源
          </h3>
          <p className="text-[15px] text-amber-900/70 mb-5">
            查詢{cityInfo.name}的長照機構、日照中心、居家服務單位
          </p>
          <a
            href={`https://1966.gov.tw/LTC/cp-6568-69925-207.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-apple-orange text-[16px] font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow border border-orange-200"
          >
            🔗 衛福部長照專區
          </a>
        </div>
      </section>
    </main>
  );
}
