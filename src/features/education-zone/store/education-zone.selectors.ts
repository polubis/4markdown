import type { EducationZoneStoreState } from './education-zone.models';

const selectReady = (
  state: EducationZoneStoreState,
): Extract<EducationZoneStoreState, { is: `ready` }> => {
  if (state.is === `ready`) return state;

  throw Error(`State read attempt when in invalid state`);
};

export { selectReady };
