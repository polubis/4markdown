import { asUserProfileId, getAPI, parseError } from "api-4markdown";
import { API4MarkdownDto } from "api-4markdown-contracts";
import { AsyncResult } from "development-kit/utility-types";

const getUserProfileAct = async (): AsyncResult<
	API4MarkdownDto<"getUserProfile">
> => {
	try {
		const params = new URLSearchParams(window.location.search);
		const profileId = asUserProfileId(params.get(`profileId`));

		const data = await getAPI().call("getUserProfile")({
			profileId,
		});

		return { is: `ok`, data };
	} catch (error) {
		return { is: `fail`, error: parseError(error) };
	}
};

export { getUserProfileAct };
