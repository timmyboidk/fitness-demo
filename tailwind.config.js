/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: '#00F0FF',
        'accent-alt': '#B026FF',
        neon: '#CCFF00',
        matte: '#0A0A0F',
        surface: '#121216',
        card: '#1A1A24',
        'card-border': '#2A2A3A',
        alert: '#FF3B30',
        gold: '#FFD700',
        'off-white': '#F8F7F4',
        charcoal: '#1A1A2E',
        muted: '#6B6B80',
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