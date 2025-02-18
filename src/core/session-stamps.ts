import React from 'react';
import { isClient } from 'development-kit/ssr-csr';

type SUID = `${number}:${number}`;

const suid = (): SUID => {
  const sessionId = (window as any).__sessionStamp__;

  if (typeof sessionId !== `number`) throw Error(`Cannot read build id`);

  return `${sessionId}:${performance.now()}`;
};

const useSUIDGeneration = (): void => {
  React.useEffect(() => {
    if (isClient()) {
      (window as any).__sessionStamp__ = performance.now();
    }
  }, []);
};

export type { SUID };
export { suid, useSUIDGeneration };
