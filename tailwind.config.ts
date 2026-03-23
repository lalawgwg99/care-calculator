import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        subsidy: "#1F9D66",
        outOfPocket: "#C4493B",
        apple: {
          blue: "#1D6FB8",
          green: "#1F9D66",
          indigo: "#5561C8",
          orange: "#D97722",
          pink: "#D95173",
          purple: "#8F53C7",
          red: "#C4493B",
          teal: "#3FA9C8",
          yellow: "#B38A10",
          gray: {
            50: "#FAF8F4", // Warm grouped background
            100: "#F3EFE8",
            200: "#E6DFD3",
            300: "#D3C7B5",
            400: "#B8A995",
            500: "#71685D", // Better contrast for muted text
            600: "#4E463E",
            700: "#39332D",
            800: "#26211D",
            900: "#141210",
          }
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0,0,0,0.04)',
        'apple-hover': '0 8px 32px rgba(0,0,0,0.08)',
        'apple-warm': '0 8px 28px rgba(126, 90, 52, 0.12)',
      }
    },
  },
  plugins: [],
};

export default config;
