import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#667eea",
          pink: "#764ba2",
          blue: "#f093fb",
        },
        secondary: {
          cyan: "#4facfe",
          blue: "#00f2fe",
        },
        difficulty: {
          basic: "#10b981",
          intermediate: "#f59e0b",
          advanced: "#ef4444",
        },
        background: {
          light: "#f8fafc",
          dark: "#1a1a1a",
        }
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gradient-secondary": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
