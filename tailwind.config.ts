import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        subsidy: "#34C759",
        outOfPocket: "#FF3B30",
        apple: {
          blue: "#007AFF",
          green: "#34C759",
          indigo: "#5856D6",
          orange: "#FF9500",
          pink: "#FF2D55",
          purple: "#AF52DE",
          red: "#FF3B30",
          teal: "#5AC8FA",
          yellow: "#FFCC00",
          gray: {
            50: "#FBFBFD", // Warm System Grouped Background
            100: "#F2F2F7",
            200: "#E5E5EA",
            300: "#D1D1D6",
            400: "#C7C7CC",
            500: "#8E8E93", // Warm Gray for muted text
            600: "#3A3A3C",
            700: "#2C2C2E",
            800: "#1C1C1E", // Dark text
            900: "#000000",
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
        'apple-warm': '0 6px 30px rgba(180,165,150,0.08)',
      }
    },
  },
  plugins: [],
};

export default config;
