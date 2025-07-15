import { state } from "development-kit/state";
import type { ResourcesCompletionState } from "./models";
import { ResourcesCompletionDto } from "api-4markdown-contracts";

let lastCompletionMdate: ResourcesCompletionDto["mdate"] | null = null;

const useResourcesCompletionState = state<ResourcesCompletionState>({
  completion: {},
});

const getLastCompletionMdate = (): ResourcesCompletionDto["mdate"] | null => {
  return lastCompletionMdate;
};

const setLastCompletionMdate = (
  mdate: ResourcesCompletionDto["mdate"],
): void => {
  lastCompletionMdate = mdate;
};

export {
  useResourcesCompletionState,
  getLastCompletionMdate,
  setLastCompletionMdate,
};
