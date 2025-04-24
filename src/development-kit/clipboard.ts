const copy = async (
  value: string,
): Promise<[true, string] | [false, unknown]> => {
  try {
    await navigator?.clipboard.writeText(value);
    return [true, value];
  } catch (error) {
    return [false, error];
  }
};

export { copy };
