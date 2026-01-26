import {
  OkResourceActivityState,
  ResourceActivityState,
} from "./models";

const okResourceActivitySelector = (
  state: ResourceActivityState,
): OkResourceActivityState => {
  if (state.is !== `ok`)
    throw Error(`Invalid reading attempt. Cannot find resource activity`);

  return state;
};

const rawResourceActivitySelector = (
  state: ResourceActivityState,
): OkResourceActivityState["data"] => {
  if (state.is !== `ok`) return [];

  return state.data;
};

export { okResourceActivitySelector, rawResourceActivitySelector };
