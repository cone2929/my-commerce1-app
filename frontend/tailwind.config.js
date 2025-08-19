module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {}
  }, 
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
  safelist: [
    'hs-accordion-active:block',
    'hs-accordion-active:hidden',
    'block',
    'hidden',
  ]
}



