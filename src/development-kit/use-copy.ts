import { useState, useCallback, useRef, useEffect } from 'react';
import { isClient } from './ssr-csr';
import { copy } from './clipboard';

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

const useCopy = (
  { cleansAfter }: ClipboardConfig = {
    cleansAfter: 2500,
  },
) => {
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

  const copyHandler: CopyHandler = useCallback(async (value) => {
    cleanUpTimeout();

    setState({ value, is: `copying` });

    const [ok] = await copy(value);

    if (ok) {
      setState({ value, is: `copied` });

      if (typeof cleansAfter !== `number`) {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setState({ is: `ready` });
      }, cleansAfter);
    } else {
      setState({ is: `error` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = async (): Promise<void> => {
    await copy(``);
  };

  useEffect(() => {
    cleanUpTimeout();
  }, []);

  return [state, copyHandler, reset] as const;
};

export { useCopy };
