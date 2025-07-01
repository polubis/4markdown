interface MockConfig {
	delay?: number;
	errorFactor?: number;
	error?(): unknown;
}

const getRandomNumber = (): number => Math.floor(Math.random() * 101);

const mock =
	({ delay = 1, errorFactor = 0, error }: MockConfig = {}) =>
	<Response>(response: Response) =>
	<Payload>(payload: Payload): Promise<Response> => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (getRandomNumber() <= errorFactor) {
					reject(error?.() ?? Error(`Ups problem...`));
				}

				resolve(response);
			}, delay * 1000);
		});
	};

export { mock };
