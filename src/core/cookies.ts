const ACCEPTANCE_COOKIE_NAME = `acceptance`;
const COOKIE_TYPE = {
	NECESSARY: `necessary`,
	PERFORMANCE: `performance`,
	FUNCTIONAL: `functional`,
	MARKETING: `marketing`,
} satisfies Record<Uppercase<string>, Lowercase<string>>;

export { ACCEPTANCE_COOKIE_NAME, COOKIE_TYPE };
