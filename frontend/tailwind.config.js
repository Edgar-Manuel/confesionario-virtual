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
          900: '#2c0609',
          800: '#4a0e12',
          700: '#6b181e',
          600: '#8b1a1e',
          500: '#a6262b',
        },
        gold: {
          500: '#c9a84c',
          400: '#d4b96a',
          300: '#dfc988',
        },
        dark: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1a1a1a',
          700: '#232323',
          600: '#2d2d2d',
          500: '#3a3a3a',
        },
      },
      fontFamily: {
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(201, 168, 76, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
