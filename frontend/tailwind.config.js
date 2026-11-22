/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#06090e',
          900: '#0b111a',
          850: '#101826',
          800: '#162032',
          700: '#23334d'
        }
      }
    },
  },
  plugins: [],
}
