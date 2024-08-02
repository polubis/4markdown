import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { type ParsedError, parseErrorV2 } from 'development-kit/parse-error-v2';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type YourInfoStoreState = Transaction<
  Awaited<API4MarkdownDto<'getYourInfo'>>,
  { error: ParsedError }
>;

const useYourInfoStore = create<YourInfoStoreState>(() => ({
  is: `idle`,
}));

const set = (state: YourInfoStoreState): void => {
  useYourInfoStore.setState(state);
};

const yourInfoStoreSelectors = {} as const;

const yourInfoStoreActions = {
  idle: () => {
    set({ is: `idle` });
  },
  busy: () => set({ is: `busy` }),
  ok: (data: Awaited<API4MarkdownDto<'getYourInfo'>>) => {
    set({ is: `ok`, ...data });
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseErrorV2(error) }),
} as const;

export { yourInfoStoreActions, yourInfoStoreSelectors };
