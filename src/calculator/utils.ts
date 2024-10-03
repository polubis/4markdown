export const sum = (...items: number[]): number =>
  items.reduce((acc, item) => item + acc, 0);

export const min = (...items: number[]): number | null =>
  items.reduce((acc, item) => (item < acc ? item : acc), 0) || null;

export const max = (...items: number[]): number | null => {
  return items.reduce((acc, item) => (item > acc ? item : acc), 0) || null;
};
