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
        prose: `65ch`,
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
    },
    animation: {
      'fade-in': `fade-in 0.3s ease-in-out`,
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};
