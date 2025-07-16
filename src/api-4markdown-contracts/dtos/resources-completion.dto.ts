import { Prettify } from "development-kit/utility-types";
import type { DateStamp, ResourceId } from "../atoms";

type ResourcesCompletionDto = Prettify<{
  mdate: DateStamp;
  completion: Record<ResourceId, boolean>;
}>;

export type { ResourcesCompletionDto };
