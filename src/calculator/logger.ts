export const logger = (...items: number[]) => {
  return console.log(items.map((item) => `${item}\n`).join(`\n`));
};
