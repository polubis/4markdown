import { UserProfileState } from ".";

const safeUserProfileStatsSelector = (
  state: UserProfileState,
): Extract<UserProfileState["stats"], { is: "ok" }> => {
  if (state.stats.is !== "ok")
    throw Error(`Invalid reading attempt. Cannot find stats`);

  return state.stats;
};

export { safeUserProfileStatsSelector };
