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
        background: "rgb(var(--background-rgb))",
        foreground: "rgb(var(--foreground-rgb))",
        card: "rgba(255, 255, 255, 0.03)",
        cardHover: "rgba(255, 255, 255, 0.08)",
        border: "rgba(255, 255, 255, 0.05)",
        borderHover: "rgba(255, 255, 255, 0.15)",
        brand: {
          orange: "#f97316",
          yellow: "#eab308",
        }
      },
    },
  },
  plugins: [],
};
export default config;
