import type { YourAccountDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type YourAccountState = Transaction<YourAccountDto>;

type YourAccountOkState = Extract<YourAccountState, { is: `ok` }>;

export type { YourAccountState, YourAccountOkState };
