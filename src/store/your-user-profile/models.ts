import type { Date, UserProfileDto } from "api-4markdown-contracts";
import type { Transaction } from "development-kit/utility-types";

type YourUserProfileState = Transaction<{
  user: UserProfileDto | null;
  mdate: Date | null;
}>;

type YourUserProfileOkState = Extract<YourUserProfileState, { is: `ok` }>;

export type { YourUserProfileState, YourUserProfileOkState };
