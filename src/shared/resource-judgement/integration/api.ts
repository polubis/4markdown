import { getAPI, parseError } from "api-4markdown";
import type { API4MarkdownPayload } from "api-4markdown-contracts";
import { type OperationError } from "../domain/models";

export const toOperationError = (error: unknown): OperationError => {
  return parseError(error).message;
};

export const rateDocument = async (
  payload: API4MarkdownPayload<"rateDocument">,
) => getAPI().call("rateDocument")(payload);
