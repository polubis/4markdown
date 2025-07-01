export const uid = (separator: string) =>
	new Date()
		.toISOString()
		.replace(/-/g, ``)
		.replace(/:/g, separator)
		.replace(/\./g, ``);
