import type { Date, ResourceId } from "../atoms";

type ResourcesCompletionDto = {
  mdate: Date;
  completion: Record<ResourceId, boolean>;
};

export type { ResourcesCompletionDto };
