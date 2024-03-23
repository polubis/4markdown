import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { create } from 'zustand';
import { GetDocsToReviewDto } from 'models/doc';

type ReviewStoreState = Transaction<{ data: GetDocsToReviewDto }>;

const useReviewStore = create<ReviewStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useReviewStore;

const set = (state: ReviewStoreState): void => {
  setState(state, true);
};

const reviewStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (data: GetDocsToReviewDto) => set({ is: `ok`, data }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
} as const;

export { useReviewStore, reviewStoreActions };
