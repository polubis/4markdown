import { getAPI, parseError } from "api-4markdown";
import { getProfileId } from "../utils/get-profile-id";
import { setUserProfileStatsAction } from "../models/actions";

const getUserProfileAct = async (): Promise<void> => {
	try {
		setUserProfileStatsAction({ is: `busy` });

		const stats = await getAPI().call("getUserProfile")({
			profileId: getProfileId(),
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
