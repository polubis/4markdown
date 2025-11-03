import { Atoms, ResourceCompletionDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourcesCompletionState = Transaction<{
  data: Record<Atoms["ResourceId"], ResourceCompletionDto>;
}>;

type OkResourcesCompletionState = Extract<
  ResourcesCompletionState,
  { is: `ok` }
>;

export type { ResourcesCompletionState, OkResourcesCompletionState };
