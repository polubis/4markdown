import { Atoms } from "api-4markdown-contracts";

const asUserProfileId = (value: unknown): Atoms["UserProfileId"] => {
  if (typeof value !== `string` || value.length === 0) {
    throw new Error(`User profile ID must be a non-empty string`);
  }

  return value as Atoms["UserProfileId"];
};

const getProfileId = (): Atoms["UserProfileId"] => {
  const params = new URLSearchParams(window.location.search);
  return asUserProfileId(params.get(`profileId`));
};

export { getProfileId, asUserProfileId };
