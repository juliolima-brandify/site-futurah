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
        brand: {
          title: '#1B1B1B',
          background: '#E7E7E7',
          body: '#383838',
          button: '#1B1B1B',
          'button-hover': '#0B2FFF',
          highlight: '#DCFF69',
        },
      },
      fontFamily: {
        sans: ['Neue Haas Grotesk Display', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
