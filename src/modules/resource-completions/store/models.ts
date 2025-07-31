import { ResourceCompletionDto, ResourceId } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourcesCompletionState = Transaction<{
  data: Record<ResourceId, ResourceCompletionDto>;
}>;

type OkResourcesCompletionState = Extract<
  ResourcesCompletionState,
  { is: `ok` }
>;

export type { ResourcesCompletionState, OkResourcesCompletionState };
