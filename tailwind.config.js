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
      shake: {
        '0%, 100%': { transform: `translateY(0)` },
        '70%, 90%': { transform: `translateY(-4px)` },
        '20%, 80%': { transform: `translateY(4px)` },
      },
    },
    animation: {
      'fade-in': `fade-in 0.3s ease-in-out`,
      shake: `shake 0.5s ease-in-out`,
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.scroll-preserve-y': {
          scrollbarGutter: `stable`,
          overflowY: `scroll`,
        },
      });
    },
  ],
};
