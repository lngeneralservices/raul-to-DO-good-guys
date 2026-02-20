// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(180 45% 30%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(180 32% 73%)",
          foreground: "hsl(0 0% 0%)",
        },
        accent: {
          DEFAULT: "hsl(23 100% 63%)",
          foreground: "hsl(0 0% 0%)",
        },
        background: "hsl(0 0% 100%)",
        foreground: "hsl(210 10% 23%)",
        surface: "hsl(210 17% 98%)",
        muted: {
          DEFAULT: "hsl(208 7% 46%)",
          foreground: "hsl(210 10% 23%)",
        },
        border: "hsl(208 7% 46% / 0.3)",
        input: "hsl(208 7% 46% / 0.3)",
        ring: "hsl(180 45% 30%)",
      },
      fontFamily: {
        heading: ["Playfair Display", "sans-serif"],
        body: ["Merriweather", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0",
      },
      maxWidth: {
        page: "1280px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;