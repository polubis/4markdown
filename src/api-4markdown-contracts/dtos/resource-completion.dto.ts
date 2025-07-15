import type { Date, ResourceId } from "../atoms";

type ResourceCompletionDto = {
  cdate: Date;
  mdate: Date;
  completion: Record<ResourceId, boolean>;
};

export type { ResourceCompletionDto };
