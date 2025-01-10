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
      maxWidth: {
        prose: `100ch`,
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: `100ch`,
          },
        },
      },
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
  plugins: [require(`@tailwindcss/typography`)],
};
