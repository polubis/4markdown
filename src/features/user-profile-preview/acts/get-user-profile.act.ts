import { getAPI, parseError } from "api-4markdown";
import { setUserProfileStatsAction } from "../models/actions";
import { Atoms } from "api-4markdown-contracts";

const getUserProfileAct = async (
  profileId: Atoms["UserProfileId"],
): Promise<void> => {
  try {
    if (!profileId) {
      throw Error(`User profile ID wrong format`);
    }

    setUserProfileStatsAction({ is: `busy` });

    const stats = await getAPI().call("getUserProfile")({
      profileId,
    });

    setUserProfileStatsAction({
      is: "ok",
      comments: stats.comments,
      profile: stats.profile,
    });
  } catch (error) {
    setUserProfileStatsAction({ is: `fail`, error: parseError(error) });
  }
};

export { getUserProfileAct };
