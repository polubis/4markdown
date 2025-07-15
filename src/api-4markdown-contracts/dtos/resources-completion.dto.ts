import { Prettify } from "development-kit/utility-types";
import type { Date, ResourceId } from "../atoms";

type ResourcesCompletionDto = Prettify<{
  mdate: Date;
  completion: Record<ResourceId, boolean>;
}>;

export type { ResourcesCompletionDto };
