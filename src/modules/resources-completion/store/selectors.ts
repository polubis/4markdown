import type {
  OkResourcesCompletionState,
  ResourcesCompletionState,
} from "./models";

const okResourcesCompletionSelector = (
  state: ResourcesCompletionState,
): OkResourcesCompletionState => {
  if (state.is !== `ok`)
    throw Error(`Invalid reading attempt. Cannot find resource completion`);

  return state;
};

export { okResourcesCompletionSelector };
