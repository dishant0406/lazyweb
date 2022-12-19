/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Poppins"', 'sans-serif']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: '#202124',
      altGray: '#35363a',
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: colors.red,
      blue: colors.blue,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      teal: colors.teal,
      orange: colors.orange,
      lime: colors.lime,
      cyan: colors.cyan,
      rose: colors.rose,
      amber: colors.amber,
      fuchsia: colors.fuchsia,
      violet: colors.violet,
      sky: colors.sky,
      trueGray: colors.trueGray,
      warmGray: colors.warmGray,
      lightGray: '#5e5f60'
    }
  },
  plugins: [],
}
