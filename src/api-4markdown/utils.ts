import { type API4MarkdownError } from "api-4markdown-contracts";
import { parseError } from "./errors";

export type AsyncTuple<TData, TError = API4MarkdownError> = Promise<
  [true, TData] | [false, TError]
>;

export const asyncCall = <TData, TError = API4MarkdownError>(
  promise: Promise<TData>,
): AsyncTuple<TData, TError> => {
  return promise
    .then((data) => [true, data] as [true, TData])
    .catch((error) => [false, parseError(error)] as [false, TError]);
};
