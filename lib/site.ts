export const SITE_URL = "https://carepilot1966.com";

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, `${SITE_URL}/`).toString();
}

export function pageAlternates(pathname = "/") {
  const url = absoluteUrl(pathname);

  return {
    canonical: url,
    languages: {
      "zh-TW": url,
    },
  };
}
