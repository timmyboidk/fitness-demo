/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: '#000000',
        'accent-alt': '#3C3C43',
        surface: '#1C1C1E',
        card: '#2C2C2E',
        'card-border': '#38383A',
        muted: '#8E8E93',
        gray: {
          50: '#F9F9F9',
          75: '#F2F2F7',
          100: '#E5E5EA',
          150: '#D1D1D6',
          200: '#C7C7CC',
          250: '#AEAEB2',
          300: '#8E8E93',
          400: '#636366',
          500: '#48484A',
          600: '#3C3C43',
          650: '#38383A',
          700: '#2C2C2E',
          750: '#1C1C1E',
          800: '#111111',
          850: '#0A0A0A',
          900: '#000000',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-black': ['Inter_900Black'],
      },
    },
  },
  plugins: [],
}