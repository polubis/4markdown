import { parseError } from "api-4markdown";
import { API4MarkdownError } from "api-4markdown-contracts";
import React from "react";

type RawError = unknown;
type Idle = { is: "idle" };
type Busy = { is: "busy" };
type Ok<TData> = { is: "ok"; data: TData };
type Fail = { is: "fail"; error: API4MarkdownError; rawError: RawError };
type MutationState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type MutationConfig<TData> = {
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: API4MarkdownError, rawError: RawError) => void;
};

const initialState: MutationState<unknown> = { is: "idle" };

const useMutation2 = <TData>(config: MutationConfig<TData> = {}) => {
  const [state, setState] = React.useState<MutationState<TData>>(initialState);

  const configRef = React.useRef<MutationConfig<TData>>(config);
  const abortRef = React.useRef<AbortController>();

  React.useEffect(() => {
    configRef.current = config;
  }, [config]);

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
    [],
  );

  const abort = React.useCallback((reset = false) => {
    abortRef.current?.abort();

    if (reset) {
      setState(initialState);
    }
  }, []);

  const setData = React.useCallback(
    (setter: TData | ((state: MutationState<TData>) => TData)) => {
      setState((state) => ({
        is: "ok",
        data:
          typeof setter === "function"
            ? (setter as (state: MutationState<TData>) => TData)(state)
            : setter,
      }));
    },
    [],
  );

  return {
    idle: state.is === "idle",
    busy: state.is === "busy",
    ok: state.is === "ok",
    fail: state.is === "fail",
    error: state.is === "fail" ? state.error : null,
    rawError: state.is === "fail" ? state.rawError : null,
    data: state.is === "ok" ? state.data : null,
    state,
    start,
    abort,
    setData,
    setState,
  };
};

export type { MutationState, MutationConfig };
export { useMutation2 };
