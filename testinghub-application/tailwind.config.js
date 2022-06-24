module.exports = {
  mode: "jit",
  purges: [
    "./pages/**/*.{js,ts,jsx,tsx,mjs}",
    "./components/**/*.{js,ts,jsx,tsx,mjs}",
  ],
  darkmode: false, // or 'media' or 'class'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mjs}",
    "./components/**/*.{js,ts,jsx,tsx,mjs}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
