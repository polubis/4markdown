import { useState, useCallback, useRef, useEffect } from 'react';
import { isClient } from './ssr-csr';

type CopyValue = string;

interface BaseState {
  value: CopyValue;
}

interface Idle {
  is: 'idle';
}

interface Unsupported {
  is: 'unsupported';
}

interface Ready {
  is: 'ready';
}

interface Copying extends BaseState {
  is: 'copying';
}

interface Copied extends BaseState {
  is: 'copied';
}

interface Error {
  is: 'error';
}

type ClipboardState = Idle | Unsupported | Ready | Copying | Copied | Error;

interface ClipboardConfig {
  cleansAfter?: number | null;
}

type CopyHandler = (value: CopyValue) => Promise<void>;

type CopyReturn = [ClipboardState, CopyHandler];

const useCopy = (
  { cleansAfter }: ClipboardConfig = {
    cleansAfter: 2500,
  },
): CopyReturn => {
  const [state, setState] = useState<ClipboardState>(() =>
    isClient()
      ? navigator?.clipboard
        ? { is: `ready` }
        : { is: `unsupported` }
      : { is: `unsupported` },
  );
  const timeoutRef = useRef<any | null>(null);

  const cleanUpTimeout = (): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const copy: CopyHandler = useCallback(async (value) => {
    cleanUpTimeout();

    setState({ value, is: `copying` });

    try {
      await navigator.clipboard.writeText(value);

      setState({ value, is: `copied` });

      if (typeof cleansAfter !== `number`) {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setState({ is: `ready` });
      }, cleansAfter);
    } catch (error) {
      setState({ is: `error` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cleanUpTimeout();
  }, []);

  return [state, copy];
};

export { useCopy };
