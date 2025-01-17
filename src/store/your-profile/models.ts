import type { Date, UserProfileDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type YourProfileState = Transaction<{
  user: UserProfileDto | null;
  mdate: Date | null;
}>;

type YourProfileOkState = Extract<YourProfileState, { is: `ok` }>;

export type { YourProfileState, YourProfileOkState };
