interface MockConfig {
  delay?: number; // Delay specified in seconds.
  errorFactor?: number; // % of requests will throw an error.
  error?(): unknown; // Function to generate error object.
}
// Generates a random integer between 0 and 100.
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
