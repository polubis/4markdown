import { parseError } from "api-4markdown";
import { API4MarkdownError } from "api-4markdown-contracts";
import React, { useRef } from "react";

type RawError = unknown;
type Idle = { is: "idle" };
type Busy = { is: "busy" };
type Ok<TData> = { is: "ok"; data: TData };
type Fail = { is: "fail"; error: API4MarkdownError; rawError: RawError };
type QueryState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type QueryConfig<TData> = {
  initialize?: boolean;
  resetable?: boolean;
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: API4MarkdownError, rawError: RawError) => void;
};

const initialState: QueryState<unknown> = { is: "idle" };

const useQuery2 = <TData>(config: QueryConfig<TData> = {}) => {
  const [state, setState] = React.useState<QueryState<TData>>(initialState);
  const counter = useRef(0);

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

        const resetable = configRef.current.resetable ?? true;

        if (counter.current === 0) {
          setState({ is: "busy" });
        } else if (resetable) {
          setState({ is: "busy" });
        }

        counter.current++;

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

  React.useEffect(() => {
    configRef.current = config;
  }, [config]);

  React.useEffect(() => {
    const initialize = configRef.current.initialize ?? true;

    if (initialize) {
      start();
    }

    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const abort = React.useCallback((reset = false) => {
    abortRef.current?.abort();

    if (reset) {
      setState(initialState);
    }
  }, []);

  const setData = React.useCallback(
    (setter: TData | ((data: TData) => TData)) => {
      setState((state) =>
        state.is !== "ok"
          ? state
          : {
              is: "ok",
              data:
                typeof setter === "function"
                  ? (setter as (data: TData) => TData)(state.data)
                  : setter,
            },
      );
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
    setState,
    setData,
  };
};

export { useQuery2 };
