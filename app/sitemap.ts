import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blogPosts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://care-calculator.vercel.app";

// 台湾各县市列表 - 用于GEO定位页面
const TAIWAN_CITIES = [
  { name: "台北市", slug: "taipei" },
  { name: "新北市", slug: "new-taipei" },
  { name: "桃園市", slug: "taoyuan" },
  { name: "台中市", slug: "taichung" },
  { name: "台南市", slug: "tainan" },
  { name: "高雄市", slug: "kaohsiung" },
  { name: "基隆市", slug: "keelung" },
  { name: "新竹市", slug: "hsinchu-city" },
  { name: "新竹縣", slug: "hsinchu-county" },
  { name: "苗栗縣", slug: "miaoli" },
  { name: "彰化縣", slug: "changhua" },
  { name: "南投縣", slug: "nantou" },
  { name: "雲林縣", slug: "yunlin" },
  { name: "嘉義市", slug: "chiayi-city" },
  { name: "嘉義縣", slug: "chiayi-county" },
  { name: "屏東縣", slug: "pingtung" },
  { name: "宜蘭縣", slug: "yilan" },
  { name: "花蓮縣", slug: "hualien" },
  { name: "台東縣", slug: "taitung" },
  { name: "澎湖縣", slug: "penghu" },
  { name: "金門縣", slug: "kinmen" },
  { name: "連江縣", slug: "lienchiang" },
];

// CMS等级页面 - 长尾关键词优化
const CMS_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];

// 照护方式页面
const CARE_TYPES = [
  { name: "居家照顧", slug: "home-care" },
  { name: "日間照顧", slug: "day-care" },
  { name: "外籍看護", slug: "foreign-caregiver" },
  { name: "住宿機構", slug: "institution" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // 博客文章条目
  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 县市地区长照页面 (GEO优化)
  const cityEntries = TAIWAN_CITIES.map((city) => ({
    url: `${BASE_URL}/${city.slug}/長照補助`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // CMS等级专项页面 (长尾关键词)
  const cmsLevelEntries = CMS_LEVELS.flatMap((level) =>
    CARE_TYPES.map((care) => ({
      url: `${BASE_URL}/cms${level}/${care.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [
    // 首页 - 最高优先级
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // 主要页面
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/insurance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // 工具子页面
    {
      url: `${BASE_URL}/tools/conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tools/caregiverhealth`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tools/daily`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/tools/reablement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // CMS等级专项页面
    ...CMS_LEVELS.map((level) => ({
      url: `${BASE_URL}/cms${level}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // 县市GEO定位页面
    ...cityEntries,
    // CMS等级+照护方式组合页面
    ...cmsLevelEntries,
    // 博客文章
    ...blogEntries,
  ];
}
