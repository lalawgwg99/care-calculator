import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        subsidy: "#10b981",
        outOfPocket: "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
