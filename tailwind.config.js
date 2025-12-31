/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: '#CCFF00',
        matte: '#121212',
        surface: '#1E1E1E',
        alert: '#FF3B30',
      },
    },
  },
  plugins: [],
}