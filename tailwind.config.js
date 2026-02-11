/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      colors: {
        xia: {
          sky: 'rgb(var(--xia-sky) / <alpha-value>)',
          aqua: 'rgb(var(--xia-aqua) / <alpha-value>)',
          mint: 'rgb(var(--xia-mint) / <alpha-value>)',
          cream: 'rgb(var(--xia-cream) / <alpha-value>)',
          haze: 'rgb(var(--xia-haze) / <alpha-value>)',
          deep: 'rgb(var(--xia-deep) / <alpha-value>)',
          teal: 'rgb(var(--xia-teal) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
