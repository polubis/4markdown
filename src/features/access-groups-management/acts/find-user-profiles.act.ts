import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const findUserProfilesAct = (
  payload: API4MarkdownPayload<"findUserProfiles">,
): Promise<API4MarkdownDto<"findUserProfiles">> => {
  return getAPI().call("findUserProfiles")(payload);
};

export { findUserProfilesAct };
