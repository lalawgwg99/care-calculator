import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { SITE_URL, absoluteUrl, pageAlternates } from "@/lib/site";

describe("SEO 正式網域", () => {
  test("所有網址都以 care.taicalc.com 為唯一來源", () => {
    expect(SITE_URL).toBe("https://care.taicalc.com");
    expect(absoluteUrl("/tools")).toBe("https://care.taicalc.com/tools");
    expect(pageAlternates("/tools")).toEqual({
      canonical: "https://care.taicalc.com/tools",
      languages: { "zh-TW": "https://care.taicalc.com/tools" },
    });
  });

  test("sitemap 的 84 個網址全部使用正式網域且不重複", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toHaveLength(84);
    expect(new Set(urls).size).toBe(urls.length);
    urls.forEach((url) => {
      expect(url === SITE_URL || url.startsWith(`${SITE_URL}/`)).toBe(true);
      expect(url).not.toContain("care-calculator.vercel.app");
      expect(url).not.toContain("care-calculator.pages.dev");
    });
  });

  test("robots 只宣告正式網域與 sitemap", () => {
    const config = robots();

    expect(config.host).toBe(SITE_URL);
    expect(config.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
