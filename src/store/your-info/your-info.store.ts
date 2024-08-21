import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { type ParsedError } from 'development-kit/parse-error-v2';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type YourInfoStoreState = Transaction<
  API4MarkdownDto<'getYourInfo'>,
  { error: ParsedError }
>;

const useYourInfoStore = create<YourInfoStoreState>(() => ({
  is: `idle`,
}));

export type { YourInfoStoreState };
export { useYourInfoStore };
