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
): OkResourcesCompletionState["data"] => {
  if (state.is !== `ok`) return {};

  return state.data;
};

export { okResourcesCompletionSelector, rawResourcesCompletionSelector };
