import { getAPI, parseError } from "api-4markdown";
import {
  RatingCategory,
  ResourceId,
  type OperationError,
} from "../domain/models";
import { Atoms } from "api-4markdown-contracts";

export const toOperationError = (error: unknown): OperationError => {
  return parseError(error).message;
};

export const rateDocument = async (
  resourceId: ResourceId,
  category: RatingCategory,
) =>
  getAPI().call("rateDocument")({
    documentId: resourceId as unknown as Atoms["DocumentId"],
    category,
  });
