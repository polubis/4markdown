const readFileAsBase64 = (file: File | Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;

			if (typeof result !== `string`) {
				return reject(Error(`Cannot convert file to base64`));
			}

			return resolve(result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export { readFileAsBase64 };
