import { useUserProfileState } from "../store";
import { UserProfileState } from ".";

const setUserProfileStatsAction = (stats: UserProfileState["stats"]) => {
  useUserProfileState.set({
    stats,
  });
};

export { setUserProfileStatsAction };
