import { parseError } from 'api-4markdown';
import { useImagesState } from '.';

// const imagesStoreActions = {
//   idle: () => set({ is: `idle` }),
//   busy: () => set({ is: `busy` }),
//   ok: () => set({ is: `ok` }),
//   fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
// } as const;

const { setState: set } = useImagesState;

const asIdle = (): void => {
  set({ is: `idle` });
};

export { asIdle };
