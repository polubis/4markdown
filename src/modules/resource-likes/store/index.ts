import { state } from "development-kit/state";
import type { ResourcesLikeState } from "./models";

const useResourcesLikeState = state<ResourcesLikeState>({
  is: `idle`,
});

export { useResourcesLikeState };
