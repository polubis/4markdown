type SUID = `${number}:${number}`;

const suid = (): SUID => {
  if (typeof (window as any).__sessionStamp__ === `undefined`) {
    (window as any).__sessionStamp__ = performance.now();
  }

  return `${(window as any).__sessionStamp__}:${performance.now()}`;
};

export type { SUID };
export { suid };
