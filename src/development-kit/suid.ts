type SUID = `${number}:${number}`;

const suid = (() => {
  let counter = 1;

  return (): SUID => {
    if (typeof (window as any).__sessionStamp__ === `undefined`) {
      (window as any).__sessionStamp__ = performance.now();
    }

    const id: SUID = `${(window as any).__sessionStamp__}:${performance.now() + counter}`;

    counter++;

    return id;
  };
})();

export type { SUID };
export { suid };
