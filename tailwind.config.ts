import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pinkCream: "#E91E63",
        iceBlue: "#1CA3D6",
        cherryRed: "#E53935",
        chocolateBrown: "#6D4C41",
        creamWhite: "#FFF8F5",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)"],
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
export default config;
