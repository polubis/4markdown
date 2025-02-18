import React from 'react';
import { isClient } from 'development-kit/ssr-csr';

const generateIdFromSessionStamp = (): string => {
  const sessionId = (window as any).__sessionStamp__;

  if (typeof sessionId !== `number`) throw Error(`Cannot read build id`);

  return `${sessionId}:${performance.now()}`;
};

const useSessionStampIdGeneration = (): void => {
  React.useEffect(() => {
    if (isClient()) {
      (window as any).__sessionStamp__ = performance.now();
    }
  }, []);
};

export { generateIdFromSessionStamp, useSessionStampIdGeneration };
