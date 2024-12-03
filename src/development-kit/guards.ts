type Assert = (condition: unknown, message: string) => asserts condition;

const assert: Assert = (condition, message) => {
  if (condition) return;

  throw Error(message);
};

export { assert };
