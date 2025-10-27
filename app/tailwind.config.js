/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // all your React files
    ],
    theme: {
      extend: {
        colors: {
          'brand-blue': '#001f3e',
          'brand-white': '#ffffff',
          'accent-color': '#f97316',
        },
        keyframes: {
          scroll: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          'slide-in-left': {
            '0%': { opacity: '0', transform: 'translateX(-50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          'slide-in-right': {
            '0%': { opacity: '0', transform: 'translateX(50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
        animation: {
          scroll: 'scroll 30s linear infinite',
          'fade-in': 'fade-in 0.8s ease-out forwards',
          'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
          'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
          'fade-in-up': 'fade-in-up 1s ease-out forwards',
        },
      },
    },
    plugins: [],
  }
