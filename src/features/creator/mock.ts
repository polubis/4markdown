const mock = (delay: number, info: string) => {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(info);
        resolve({});
      }, delay);
    });
};

export { mock };
