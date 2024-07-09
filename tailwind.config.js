/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/*.{js,jsx,ts,tsx}`,
    `./src/components/*.{js,jsx,ts,tsx}`,
    `./src/design-system/*.{js,jsx,ts,tsx}`,
    `./src/features/**/*.{js,jsx,ts,tsx}`,
    `./src/containers/**/*.{js,jsx,ts,tsx}`,
    `./src/dynamic-pages/**/*.{js,jsx,ts,tsx}`,
  ],
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
      'slide-in-sidebar': {
        '0%': { transform: `translateX(280px)` },
        '100%': { transform: `translateX(0px)` },
      },
      'slide-out-sidebar': {
        '0%': { transform: `translateX(0px)`, opacity: 1 },
        '100%': { transform: `translateX(280px)`, opacity: 0 },
      },
    },
    animation: {
      'fade-in': `fade-in 0.3s ease-in-out`,
      'slide-in-sidebar': `slide-in-sidebar 0.3s ease-in-out`,
      'slide-out-sidebar': `slide-out-sidebar 0.3s ease-in-out`,
    },
  },
  plugins: [],
};
