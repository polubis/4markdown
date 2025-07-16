import { ResourceId } from "api-4markdown-contracts";
import { OkResourcesCompletionState, ResourcesCompletionState } from "./models";

const okResourcesCompletionSelector = (
  state: ResourcesCompletionState,
): OkResourcesCompletionState => {
  if (state.is !== `ok`)
    throw Error(`Invalid reading attempt. Cannot find resource completion`);

  return state;
};

const rawResourcesCompletionSelector = (
  state: ResourcesCompletionState,
): Record<ResourceId, boolean> => {
  if (state.is !== `ok`) return {};

  return state.completion;
};

export { okResourcesCompletionSelector, rawResourcesCompletionSelector };
