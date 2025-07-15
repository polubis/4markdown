import { ResourceId } from "api-4markdown-contracts";

type ResourcesCompletionState = {
  completion: Record<ResourceId, boolean>;
};

export type { ResourcesCompletionState };
