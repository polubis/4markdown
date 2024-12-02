type Assert = (condition: unknown, message: string) => asserts condition;

const ok: Assert = (condition, message) => {
  if (condition) return;

  throw Error(message);
};

export { ok };
