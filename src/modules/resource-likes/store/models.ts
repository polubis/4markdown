import { Atoms, ResourceLikeDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourcesLikeState = Transaction<{
  data: Record<Atoms["ResourceId"], ResourceLikeDto>;
}>;

type OkResourcesLikeState = Extract<ResourcesLikeState, { is: `ok` }>;

export type { ResourcesLikeState, OkResourcesLikeState };
