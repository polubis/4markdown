import { parseError } from 'api-4markdown';
import { IMAGE_EXTENSIONS } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type ImagesStoreState = Transaction;

const useImagesStore = create<ImagesStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useImagesStore;

const set = (state: ImagesStoreState): void => {
  setState(state, true);
};

const imagesStoreRestrictions = {
  type: IMAGE_EXTENSIONS.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

const imagesStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: () => set({ is: `ok` }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
} as const;

export { useImagesStore, imagesStoreActions, imagesStoreRestrictions };
