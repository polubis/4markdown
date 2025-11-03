import { EMPTY, Subject, from } from "rxjs";
import {
  debounceTime,
  switchMap,
  catchError,
  tap,
  distinctUntilChanged,
  filter as rxJsFilter,
} from "rxjs/operators";
import React from "react";
import { parseError } from "api-4markdown";
import { API4MarkdownError } from "api-4markdown-contracts";

type RawError = unknown;
type Idle = { is: "idle" };
type Busy = { is: "busy" };
type Ok<TData> = { is: "ok"; data: TData };
type Fail = { is: "fail"; error: API4MarkdownError; rawError: RawError };
type TypeaheadState<TData> = Idle | Busy | Ok<TData> | Fail;

type Handler<TData> = (query: string, signal: AbortSignal) => Promise<TData>;

type TypeaheadConfig<TData> = {
  delay?: number;
  filter?: (query: string) => boolean;
  handler?: Handler<TData>;
  onBusy?: () => void;
  onOk?: (data: TData) => void;
  onFail?: (error: API4MarkdownError, rawError: unknown) => void;
};

const useTypeaheadQuery = <TData>(config: TypeaheadConfig<TData> = {}) => {
  const { delay, filter, handler, onBusy, onOk, onFail } = config;
  const [state, setState] = React.useState<TypeaheadState<TData>>({
    is: "idle",
  });
  const [subject] = React.useState(
    () => new Subject<{ query: string; handler?: Handler<TData> }>(),
  );
  const [query, setQuery] = React.useState("");
  const abortRef = React.useRef<AbortController>();
  const configRef = React.useRef(config);

  React.useEffect(() => {
    configRef.current = config;
  }, [delay, filter, handler, onBusy, onOk, onFail]);

  React.useEffect(() => {
    const subscription = subject
      .pipe(
        rxJsFilter(
          ({ query }) => configRef.current.filter?.(query) ?? query.length >= 2,
        ),
        debounceTime(configRef.current.delay || 1000),
        distinctUntilChanged((prev, curr) => prev.query === curr.query),
        switchMap(({ query, handler }) => {
          abortRef.current?.abort();
          const controller = new AbortController();
          abortRef.current = controller;
          setState({ is: "busy" });
          configRef.current.onBusy?.();

          const finalHandler = handler || configRef.current.handler;

          return (
            finalHandler
              ? from(finalHandler(query, controller.signal))
              : from(Promise.reject(new Error("Handler is required")))
          ).pipe(
            tap((data) => {
              setState({ is: "ok", data });
              configRef.current.onOk?.(data);
            }),
            catchError((rawError) => {
              const error = parseError(rawError);
              setState({ is: "fail", error, rawError });
              configRef.current.onFail?.(error, rawError);
              return EMPTY;
            }),
          );
        }),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      abortRef.current?.abort();
    };
  }, [subject]);

  const start = React.useCallback(
    (query: string, handler?: Handler<TData>) => {
      setQuery(query);
      subject.next({ query, handler });
    },
    [subject],
  );

  const abort = React.useCallback((reset = false) => {
    abortRef.current?.abort();
    if (reset) {
      setState({ is: "idle" });
      setQuery("");
    }
  }, []);

  return { ...state, query, start, abort };
};

export { useTypeaheadQuery };
