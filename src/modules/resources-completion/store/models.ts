import { ResourceCompletionDto } from "api-4markdown-contracts";
import { Prettify, Transaction } from "development-kit/utility-types";

type ResourcesCompletionState = Transaction<ResourceCompletionDto>;
type OkResourcesCompletionState = Prettify<
  Extract<ResourcesCompletionState, { is: `ok` }>
>;

export type { ResourcesCompletionState, OkResourcesCompletionState };
