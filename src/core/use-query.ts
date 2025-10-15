import { parseError } from "api-4markdown";
import { ParsedError } from "api-4markdown-contracts";
import React from "react";

type RawError = unknown;
type Idle = { is: "idle" };
type Busy = { is: "busy" };
type Ok<TData> = { is: "ok"; data: TData };
type Fail = { is: "fail"; error: ParsedError; rawError: RawError };
type QueryState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type QueryConfig<TData> = {
  initialize?: boolean;
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: ParsedError, rawError: RawError) => void;
};

const initialState: QueryState<unknown> = { is: "idle" };

const useQuery = <TData>(config: QueryConfig<TData> = {}) => {
  const { onBusy, onOk, onFail, handler, initialize } = config;
  const [state, setState] = React.useState<QueryState<TData>>(initialState);

  const configRef = React.useRef<QueryConfig<TData>>(config);
  const abortRef = React.useRef<AbortController>();

  const start = React.useCallback(
    async (handler?: Handler<TData>): Promise<void> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const finalHandler = handler || configRef.current.handler;

        if (!finalHandler) {
          throw new Error("Handler is required");
        }

        setState({ is: "busy" });
        configRef.current.onBusy?.();
        const data = await finalHandler(controller.signal);

        if (controller.signal.aborted) return;

        setState({ is: "ok", data });
        configRef.current.onOk?.(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        const parsedError = parseError(error);
        setState({ is: "fail", error: parsedError, rawError: error });
        configRef.current.onFail?.(parsedError, error);
      }
    },
    [setState],
  );

  React.useEffect(() => {
    configRef.current = config;
  }, [onBusy, onOk, onFail, handler, initialize]);

  React.useEffect(() => {
    const initialize = configRef.current.initialize ?? true;

    if (initialize) {
      start();
    }

    return () => {
      abortRef.current?.abort();
    };
  }, [start]);

  const abort = React.useCallback(
    (reset = false) => {
      abortRef.current?.abort();

      if (reset) {
        setState(initialState);
      }
    },
    [setState],
  );

  return { ...state, start, abort };
};

export { useQuery };
