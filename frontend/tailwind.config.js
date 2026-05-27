/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          950: '#1a0408',
          900: '#2c0609',
          800: '#4a0e12',
          700: '#6b181e',
          600: '#8b1a1e',
          500: '#a6262b',
        },
        gold: {
          700: '#8a7232',
          600: '#a88a3c',
          500: '#c9a84c',
          400: '#d4b96a',
          300: '#e2cc8b',
          200: '#efe1b1',
        },
        ink: {
          990: '#050505',
          980: '#080808',
          950: '#0a0a0a',
          900: '#121212',
          850: '#161616',
          800: '#1a1a1a',
          750: '#1f1f1f',
          700: '#232323',
          600: '#2d2d2d',
          500: '#3a3a3a',
        },
        bone: '#e8e0d4',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        heading: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        script: ['"Grand Vibes"', '"Cormorant Garamond"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
