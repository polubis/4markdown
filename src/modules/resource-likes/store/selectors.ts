import { OkResourcesLikeState, ResourcesLikeState } from "./models";

const okResourcesLikeSelector = (
  state: ResourcesLikeState,
): OkResourcesLikeState => {
  if (state.is !== `ok`)
    throw Error(`Invalid reading attempt. Cannot find resource like`);

  return state;
};

const rawResourcesLikeSelector = (
  state: ResourcesLikeState,
): OkResourcesLikeState["data"] => {
  if (state.is !== `ok`) return {};

  return state.data;
};

export { okResourcesLikeSelector, rawResourcesLikeSelector };
