import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownPayload } from "api-4markdown-contracts";
import type { AsyncResult } from "development-kit/utility-types";
import { updateYourProfileStoreActions } from "store/update-your-profile/update-your-profile.store";
import { useYourUserProfileState } from "store/your-user-profile";

const updateYourUserProfileAct = async (
	payload: API4MarkdownPayload<"updateYourUserProfileV2">,
): AsyncResult => {
	try {
		updateYourProfileStoreActions.busy();

		const { mdate, profile } = await getAPI().call(`updateYourUserProfileV2`)(
			payload,
		);

		setCache(`getYourUserProfile`, { profile, mdate });

		updateYourProfileStoreActions.ok();
		useYourUserProfileState.swap({ is: `ok`, mdate, user: profile });

		return { is: `ok` };
	} catch (error: unknown) {
		updateYourProfileStoreActions.fail(error);

		return { is: `fail`, error: parseError(error) };
	}
};

export { updateYourUserProfileAct };
