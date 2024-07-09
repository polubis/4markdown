/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./src/**/*.{js,jsx,ts,tsx}`],
  darkMode: `class`,
  theme: {
    extend: {
      screens: {
        tn: `400px`,
      },
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    },
    animation: {
      'fade-in': `fade-in 0.3s ease-in-out`,
    },
  },
  plugins: [],
};
