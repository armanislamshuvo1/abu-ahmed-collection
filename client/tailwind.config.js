/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E6BE',
          DEFAULT: '#D4AF37',
          hover: '#E5C158',
          dark: '#997D25',
          deep: '#856A1C'
        },
        royal: {
          black: '#0A0A0A',
          dark: '#121212',
          card: '#181818',
          border: '#27272A',
          charcoal: '#222222'
        },
        cream: {
          DEFAULT: '#FFFDF9',
          dark: '#F7F4EB'
        },
        maroon: {
          DEFAULT: '#6B1124',
          light: '#8A1830',
          dark: '#4D0C19'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Hind Siliguri"', 'Georgia', 'serif'],
        sans: ['"Hind Siliguri"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 30px -4px rgba(212, 175, 55, 0.35)',
        soft: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
      }
    },
  },
  plugins: [],
}
