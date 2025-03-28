/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/*.{js,jsx,ts,tsx}`,
    `./src/components/*.{js,jsx,ts,tsx}`,
    `./src/design-system/*.{js,jsx,ts,tsx}`,
    `./src/features/**/*.{js,jsx,ts,tsx}`,
    `./src/containers/**/*.{js,jsx,ts,tsx}`,
    `./src/dynamic-pages/**/*.{js,jsx,ts,tsx}`,
    `./src/modules/**/*.{js,jsx,ts,tsx}`,
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
      'gradient-move': {
        '0%': { backgroundPosition: `0% 50%` },
        '50%': { backgroundPosition: `100% 50%` },
        '100%': { backgroundPosition: `0% 50%` },
      },
    },
    animation: {
      'fade-in': `fade-in 0.3s ease-in-out forwards`,
      'gradient-move': `gradient-move 8s ease-in-out infinite`,
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};
