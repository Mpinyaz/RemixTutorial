import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        suse: ["SUSE", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
