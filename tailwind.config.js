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
    `./src/shared/**/*.{js,jsx,ts,tsx}`,
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
      "fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      "gradient-move": {
        "0%": { backgroundPosition: `0% 50%` },
        "50%": { backgroundPosition: `100% 50%` },
        "100%": { backgroundPosition: `0% 50%` },
      },
      "slide-in-right": {
        "0%": { transform: `translateX(100%)` },
        "100%": { transform: `translateX(0)` },
      },
      "slide-in-bottom": {
        "0%": { transform: `translateY(100%)` },
        "100%": { transform: `translateY(0)` },
      },
      "rate-burst": {
        "0%": { opacity: 0, transform: `translateX(0) scaleX(0.2)` },
        "60%": { opacity: 1, transform: `translateX(0.75rem) scaleX(1)` },
        "100%": { opacity: 0, transform: `translateX(1.25rem) scaleX(0.6)` },
      },
      "rate-jump": {
        "0%": { transform: `translateY(0) scale(1)` },
        "25%": { transform: `translateY(-6px) scale(1.18)` },
        "45%": { transform: `translateY(0) scale(0.92)` },
        "65%": { transform: `translateY(-3px) scale(1.08)` },
        "85%": { transform: `translateY(0) scale(0.97)` },
        "100%": { transform: `translateY(0) scale(1)` },
      },
      "rate-letter-walk": {
        "0%": { opacity: 0, transform: `translateY(3px)` },
        "5%": { opacity: 1, transform: `translateY(0)` },
        "70%": { opacity: 1, transform: `translateY(0)` },
        "100%": { opacity: 0, transform: `translateY(3px)` },
      },
      "rate-attract-arrow": {
        "0%, 25%, 50%, 100%": {
          opacity: 0.55,
          transform: `translateY(0)`,
        },
        "32%, 42%": { opacity: 1, transform: `translateY(-3px)` },
      },
      "rate-attract-jump": {
        "0%, 50%, 80%, 100%": { transform: `translateY(0) scale(1)` },
        "60%": { transform: `translateY(-5px) scale(1.15)` },
        "70%": { transform: `translateY(0) scale(0.94)` },
        "78%": { transform: `translateY(-2px) scale(1.04)` },
      },
    },
    animation: {
      "fade-in": `fade-in 0.3s ease-in-out forwards`,
      "gradient-move": `gradient-move 8s ease-in-out infinite`,
      "slide-in-right": `slide-in-right 0.23s ease-in-out forwards`,
      "slide-in-bottom": `slide-in-bottom 0.23s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`,
      "rate-burst": `rate-burst 0.6s ease-out both`,
      "rate-jump": `rate-jump 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
      "rate-letter-walk": `rate-letter-walk 3.4s ease-in-out infinite`,
      "rate-attract-arrow": `rate-attract-arrow 3.4s ease-in-out infinite`,
      "rate-attract-jump": `rate-attract-jump 3.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`,
      none: "none",
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};
