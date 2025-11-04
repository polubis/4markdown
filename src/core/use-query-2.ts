import { parseError } from "api-4markdown";
import { API4MarkdownError } from "api-4markdown-contracts";
import { useOperation } from "development-kit/use-operation";
import React from "react";

type RawError = unknown;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type QueryConfig<TData> = {
  initialize?: boolean;
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: API4MarkdownError, rawError: RawError) => void;
};

const useQuery2 = <TData>(config: QueryConfig<TData> = {}) => {
  const [state, setState] = useOperation<TData, API4MarkdownError>();

  const configRef = React.useRef<QueryConfig<TData>>(config);
  const abortRef = React.useRef<AbortController>();

  const start = React.useCallback(
    async (
      handler?: Handler<TData>,
    ): Promise<
      ["ok", TData] | ["aborted"] | ["fail", API4MarkdownError, RawError]
    > => {
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

        if (controller.signal.aborted) return ["aborted"];

        setState({ is: "ok", data });
        configRef.current.onOk?.(data);
        return ["ok", data];
      } catch (error) {
        if (controller.signal.aborted) return ["aborted"];

        const parsedError = parseError(error);
        setState({ is: "fail", error: parsedError, rawError: error });
        configRef.current.onFail?.(parsedError, error);
        return ["fail", parsedError, error];
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
  }, [start]);

  const abort = React.useCallback((reset = false) => {
    abortRef.current?.abort();

    if (reset) {
      setState({ is: "idle" });
    }
  }, []);

  const setData = React.useCallback(
    (updater: TData | ((data: TData) => TData)) => {
      setState((state) => {
        if (state.is !== "ok") {
          console.warn("setData called but state is not 'ok'. Ignoring.");
          return state;
        }

        return {
          is: "ok",
          data:
            typeof updater === "function"
              ? (updater as (prevData: TData) => TData)(state.data)
              : updater,
        };
      });
    },
    [],
  );

  return {
    status: state.is,
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
  };
};

export { useQuery2 };
