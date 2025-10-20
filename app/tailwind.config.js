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
      },
    },
    plugins: [],
  }
