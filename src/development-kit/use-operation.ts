import React from "react";

type IdleState = { is: `idle` };

type RawError = unknown;
type BusyState = { is: `busy` };
type OkState<TData> = { is: `ok`; data: TData };
type FailState<TError> = { is: `fail`; error: TError; rawError: RawError };
type OperationState<TData, TError> =
  | IdleState
  | BusyState
  | OkState<TData>
  | FailState<TError>;

const useOperation = <TData, TError>(
  initialState: OperationState<TData, TError> = { is: `idle` },
) => {
  const [state, setState] = React.useState(initialState);

  return [state, setState] as const;
};

export { useOperation };
