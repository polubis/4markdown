import { parseError } from "api-4markdown";
import { ParsedError } from "api-4markdown-contracts";
import React from "react";

type RawError = unknown;
type Idle = ["idle"];
type Busy = ["busy"];
type Ok<TData> = ["ok", TData];
type Fail = ["fail", ParsedError, RawError];
type ActState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type ActConfig<TData> = {
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: ParsedError, rawError: RawError) => void;
};

const initialState: ActState<unknown> = ["idle"];

const useAct = <TData>(config: ActConfig<TData> = {}) => {
  const { onBusy, onOk, onFail } = config;
  const [state, setState] = React.useState<ActState<TData>>(initialState);

  const configRef = React.useRef<ActConfig<TData>>(config);
  const abortRef = React.useRef<AbortController>();

  React.useEffect(() => {
    configRef.current = config;
  }, [onBusy, onOk, onFail]);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const start = React.useCallback(
    async (handler: Handler<TData>): Promise<void> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setState(["busy"]);
        configRef.current.onBusy?.();
        const data = await handler(controller.signal);

        if (controller.signal.aborted) return;

        setState(["ok", data]);
        configRef.current.onOk?.(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        const parsedError = parseError(error);
        setState(["fail", parsedError, error]);
        configRef.current.onFail?.(parsedError, error);
      }
    },
    [setState],
  );

  const [status] = state;
  const idle = status === "idle";
  const busy = status === "busy";
  const ok = status === "ok";
  const fail = status === "fail";

  return [state, { idle, busy, ok, fail }, start] as const;
};

export type { ActState, ActConfig };
export { useAct };
