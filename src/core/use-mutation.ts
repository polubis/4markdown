import { parseError } from "api-4markdown";
import { ParsedError } from "api-4markdown-contracts";
import React from "react";

type RawError = unknown;
type Idle = { is: "idle" };
type Busy = { is: "busy" };
type Ok<TData> = { is: "ok"; data: TData };
type Fail = { is: "fail"; error: ParsedError; rawError: RawError };
type MutationState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type MutationConfig<TData> = {
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: ParsedError, rawError: RawError) => void;
};

const initialState: MutationState<unknown> = { is: "idle" };

const useMutation = <TData>(config: MutationConfig<TData> = {}) => {
  const { onBusy, onOk, onFail, handler } = config;
  const [state, setState] = React.useState<MutationState<TData>>(initialState);

  const configRef = React.useRef<MutationConfig<TData>>(config);
  const abortRef = React.useRef<AbortController>();

  React.useEffect(() => {
    configRef.current = config;
  }, [onBusy, onOk, onFail, handler]);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

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

  const abort = React.useCallback(
    (reset = false) => {
      abortRef.current?.abort();

      if (reset) {
        setState(initialState);
      }
    },
    [setState],
  );

  const setData = React.useCallback(
    (data: TData) => {
      setState({ is: "ok", data });
    },
    [setState],
  );

  const reset = React.useCallback(() => {
    setState(initialState);
  }, []);

  return { ...state, start, abort, setData, setState, reset };
};

export type { MutationState, MutationConfig };
export { useMutation };
