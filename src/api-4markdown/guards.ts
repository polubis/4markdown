import { UserProfileId } from "api-4markdown-contracts";

const asUserProfileId = (value: unknown): UserProfileId => {
  if (typeof value !== `string` || value.length === 0) {
    throw new Error(`User profile ID must be a non-empty string`);
  }

  return value as UserProfileId;
};

export { asUserProfileId };
