import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f1eee4",
        surface: "#fffdf8",
        ink: "#18222f",
        sage: "#e4eddc",
        moss: "#295847",
        amberglow: "#d39a3c",
        terracotta: "#c66a37",
        clay: "#8f4f35"
      },
      fontFamily: {
        body: ['var(--font-body)'],
        display: ['var(--font-display)']
      },
      boxShadow: {
        soft: "0 12px 30px rgba(24, 34, 47, 0.10)",
        panel: "0 18px 40px rgba(24, 34, 47, 0.12)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 15% 20%, rgba(41, 88, 71, 0.18), transparent 32%), radial-gradient(circle at 85% 12%, rgba(211, 154, 60, 0.22), transparent 28%), radial-gradient(circle at 72% 82%, rgba(198, 106, 55, 0.12), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
