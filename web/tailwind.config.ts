import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dbeeff",
          200: "#b8ddff",
          300: "#84c6ff",
          400: "#48a4ff",
          500: "#1f83fc",
          600: "#0f65e0",
          700: "#0d50b5",
          800: "#0f4392",
          900: "#123a78",
        },
        sky: {
          light: "#e8f6ff",
        },
      },
      fontFamily: {
        sans: ["Heebo", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
