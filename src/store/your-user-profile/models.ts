import type { ParsedError, UserProfileDto } from 'api-4markdown-contracts';

type UserProfile = {
  user: UserProfileDto | null;
  mdate: Date | null;
};

type YourUserProfileState = {
  busy: boolean;
  error: ParsedError | null;
  profile: UserProfile | null;
};

export type { YourUserProfileState };
