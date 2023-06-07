/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cp-indigo": "#9381FF",
        "cp-periwinkle": "#B8B8FF",
        "cp-ghost-white": "#F8F7FF",
        "cp-antique-white": "#FFEEDD",
        "cp-apricot": "#FFD8BE",
        "cp-purple-bg": "#252040",
      },
    },
  },
  plugins: [],
};
