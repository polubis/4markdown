type Assert = (condition: unknown, message: string) => asserts condition;

const falsy: Assert = (condition, message) => {
  if (condition) return;

  throw Error(message);
};

export { falsy };
