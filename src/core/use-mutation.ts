import { parseError } from "api-4markdown";
import { ParsedError } from "api-4markdown-contracts";
import React from "react";

type RawError = unknown;
type Idle = ["idle"];
type Busy = ["busy"];
type Ok<TData> = ["ok", TData];
type Fail = ["fail", ParsedError, RawError];
type MutationState<TData> = Idle | Busy | Ok<TData> | Fail;
type Handler<TData> = (signal: AbortSignal) => Promise<TData>;

type MutationConfig<TData> = {
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: ParsedError, rawError: RawError) => void;
};

const initialState: MutationState<unknown> = ["idle"];

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

        setState(["busy"]);
        configRef.current.onBusy?.();
        const data = await finalHandler(controller.signal);

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

  const abort = React.useCallback(
    (reset = false) => {
      abortRef.current?.abort();

      if (reset) {
        setState(initialState);
      }
    },
    [setState],
  );

  const [status] = state;
  const idle = status === "idle";
  const busy = status === "busy";
  const blocked = busy || idle;
  const ok = status === "ok";
  const fail = status === "fail";

  return { idle, busy, blocked, ok, fail, state, status, start, abort };
};

export type { MutationState, MutationConfig };
export { useMutation };
