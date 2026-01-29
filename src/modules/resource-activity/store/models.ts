import { ResourceActivityDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourceActivityState = Transaction<{
  data: ResourceActivityDto[];
}>;

type OkResourceActivityState = Extract<ResourceActivityState, { is: `ok` }>;

export type { ResourceActivityState, OkResourceActivityState };
