import { parseErrorV2 } from 'development-kit/parse-error-v2';
import { useYourInfoStore, type YourInfoStoreState } from './your-info.store';
import { getAPI } from 'api-4markdown';

const set = (state: YourInfoStoreState): void =>
  useYourInfoStore.setState(state);

const getYourInfo = async (): Promise<void> => {
  const { call } = getAPI();

  try {
    set({ is: `busy` });
    set({ is: `ok`, ...(await call(`getYourInfo`)()) });
  } catch (error: unknown) {
    set({ is: `fail`, error: parseErrorV2(error) });
  }
};

export { getYourInfo };
