/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f6f2ea',
        ink: '#20212a',
        stone: '#ded8ce',
        accent: {
          DEFAULT: '#4338ca',
          hover: '#3730a3',
        },
        coral: '#e87963',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        editorial: '0 18px 55px rgba(39, 35, 68, 0.10)',
      },
    },
  },
  plugins: [],
}
