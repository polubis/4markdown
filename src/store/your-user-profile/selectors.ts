import type { YourUserProfileOkState, YourUserProfileState } from './models';

const yourOkUserProfileSelector = (
  state: YourUserProfileState,
): YourUserProfileOkState => {
  if (state.is !== `ok`)
    throw Error(`Invalid read attempt when getting your user profile`);

  return state;
};

export { yourOkUserProfileSelector };
