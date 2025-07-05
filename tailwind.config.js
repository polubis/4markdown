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
		},
		animation: {
			"fade-in": `fade-in 0.3s ease-in-out forwards`,
			"gradient-move": `gradient-move 8s ease-in-out infinite`,
			"slide-in-right": `slide-in-right 0.23s ease-in-out forwards`,
			"slide-in-bottom": `slide-in-bottom 0.23s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`,
			none: "none",
		},
	},
	plugins: [require(`@tailwindcss/typography`)],
};
