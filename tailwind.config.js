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
          sky: '#7FBFE1',
          aqua: '#68D4DB',
          mint: '#98E6E2',
          cream: '#F8F4E1',
          haze: '#CFEFF0',
          deep: '#0F4C5C',
          teal: '#2C6F7A',
        },
      },
    },
  },
  plugins: [],
}
