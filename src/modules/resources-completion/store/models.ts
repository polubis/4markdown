import { ResourcesCompletionDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourcesCompletionState = Transaction<ResourcesCompletionDto>;
type OkResourcesCompletionState = Extract<
  ResourcesCompletionState,
  { is: `ok` }
>;

export type { ResourcesCompletionState, OkResourcesCompletionState };
