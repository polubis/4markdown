import { asUserProfileId } from "api-4markdown";
import { UserProfileId } from "api-4markdown-contracts";

const getProfileId = (): UserProfileId => {
  const params = new URLSearchParams(window.location.search);
  return asUserProfileId(params.get(`profileId`));
};

export { getProfileId };
