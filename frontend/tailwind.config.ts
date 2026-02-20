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
        bone: "#E3E7D3",
        clay: "#BDC2BF",
        sage: "#989C94",
        "deep-olive": "#25291C",
        sulfur: "#E6E49F",
      },
    },
  },
  plugins: [],
};
export default config;
