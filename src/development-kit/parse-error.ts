const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return `Ups, something went wrong. Try again.`;
};

export { parseError };
