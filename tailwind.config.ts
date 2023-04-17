import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        markPro: ['"mark pro"', "Montserrat", "sans-serif"],
      },
      colors: {
        darkBlueGrey: "#1f2a4b",
        paleGrey: "#f6f7f8",
        coolGrey: "#9ea3b2",
        coolGrey2: "#a1a4ad",
        coolBlue: "#4a77e5",
        coolPurple: "#4B4BE0",
        skyBlue: "#5A77E1",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
