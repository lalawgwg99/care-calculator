// 台湾各县市列表 - 用于GEO定位页面
export const TAIWAN_CITIES = [
  { name: '台北市', slug: 'taipei', region: '北部' },
  { name: '新北市', slug: 'new-taipei', region: '北部' },
  { name: '桃園市', slug: 'taoyuan', region: '北部' },
  { name: '台中市', slug: 'taichung', region: '中部' },
  { name: '台南市', slug: 'tainan', region: '南部' },
  { name: '高雄市', slug: 'kaohsiung', region: '南部' },
  { name: '基隆市', slug: 'keelung', region: '北部' },
  { name: '新竹市', slug: 'hsinchu-city', region: '北部' },
  { name: '新竹縣', slug: 'hsinchu-county', region: '北部' },
  { name: '苗栗縣', slug: 'miaoli', region: '中部' },
  { name: '彰化縣', slug: 'changhua', region: '中部' },
  { name: '南投縣', slug: 'nantou', region: '中部' },
  { name: '雲林縣', slug: 'yunlin', region: '中部' },
  { name: '嘉義市', slug: 'chiayi-city', region: '南部' },
  { name: '嘉義縣', slug: 'chiayi-county', region: '南部' },
  { name: '屏東縣', slug: 'pingtung', region: '南部' },
  { name: '宜蘭縣', slug: 'yilan', region: '東部' },
  { name: '花蓮縣', slug: 'hualien', region: '東部' },
  { name: '台東縣', slug: 'taitung', region: '東部' },
  { name: '澎湖縣', slug: 'penghu', region: '離島' },
  { name: '金門縣', slug: 'kinmen', region: '離島' },
  { name: '連江縣', slug: 'lienchiang', region: '離島' },
] as const;

// CMS等级列表
export const CMS_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type CMSLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const CMS_LEVELS_STR = CMS_LEVELS.map(String);

// CMS等级详情
export const CMS_LEVEL_INFO: Record<CMSLevel, { name: string; description: string; subsidy: number; hasTransport: boolean; respite: number }> = {
  1: { name: '輕度失能', description: '日常生活活動能力輕微受限', subsidy: 0, hasTransport: false, respite: 0 },
  2: { name: '輕度失能', description: '日常生活活動能力輕微受限', subsidy: 10020, hasTransport: false, respite: 32340 },
  3: { name: '中度失能', description: '日常生活活動能力中度受限', subsidy: 15460, hasTransport: false, respite: 32340 },
  4: { name: '中度失能', description: '日常生活活動能力中度受限', subsidy: 18580, hasTransport: true, respite: 32340 },
  5: { name: '重度失能', description: '日常生活活動能力重度受限', subsidy: 24100, hasTransport: true, respite: 32340 },
  6: { name: '重度失能', description: '日常生活活動能力重度受限', subsidy: 28070, hasTransport: true, respite: 32340 },
  7: { name: '極重度失能', description: '日常生活活動能力極度受限', subsidy: 32090, hasTransport: true, respite: 48510 },
  8: { name: '極重度失能', description: '日常生活活動能力極度受限', subsidy: 36180, hasTransport: true, respite: 48510 },
};

// 照護方式列表
export const CARE_TYPES = ['home-care', 'day-care', 'foreign-caregiver', 'institution'] as const;
export type CareType = typeof CARE_TYPES[number];

// 照護方式詳情
export const CARE_TYPE_INFO: Record<CareType, { name: string; description: string; subsidyRate: number }> = {
  'home-care': { name: '居家照顧', description: '專業照服員到宅提供身體照顧、生活照顧等服務', subsidyRate: 1 },
  'day-care': { name: '日間照顧', description: '白天至日照中心接受照顧，晚上返回家中', subsidyRate: 1 },
  'foreign-caregiver': { name: '外籍看護', description: '聘僱外國籍監護工提供全日照顧', subsidyRate: 0.3 },
  'institution': { name: '住宿機構', description: '全日型住宿於長照機構', subsidyRate: 1 },
};

// 收入身份列表
export const INCOME_TYPES = ['general', 'mid-low', 'low'] as const;
export type IncomeType = typeof INCOME_TYPES[number];

// 收入身份詳情
export const INCOME_TYPE_INFO: Record<IncomeType, { name: string; copayRate: number }> = {
  'general': { name: '一般戶', copayRate: 0.16 },
  'mid-low': { name: '中低收入戶', copayRate: 0.05 },
  'low': { name: '低收入戶', copayRate: 0 },
};
