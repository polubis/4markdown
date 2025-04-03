type SUID = `${number}:${number}`;

const suid = (() => {
  let counter = 1;
  const sessionStamp = performance.now();

  return (): SUID => {
    const id: SUID = `${sessionStamp}:${performance.now() + counter}`;
    counter++;
    return id;
  };
})();

export type { SUID };
export { suid };
