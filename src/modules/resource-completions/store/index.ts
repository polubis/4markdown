import { state } from "development-kit/state";
import type { ResourcesCompletionState } from "./models";

const useResourcesCompletionState = state<ResourcesCompletionState>({
  is: `idle`,
});

export { useResourcesCompletionState };
