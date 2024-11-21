import { getAPI, getCache, setCache } from 'api-4markdown';
import {
  yourProfileStoreActions,
  yourProfileStoreSelectors,
} from './your-profile.store';
import type { API4MarkdownContractKey } from 'api-4markdown-contracts';

const getYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

    const { is } = yourProfileStoreSelectors.state();

    if (is !== `idle`) return;

    const cachedProfile = getCache(key);

    if (cachedProfile !== null) {
      yourProfileStoreActions.ok({
        mdate: cachedProfile?.mdate ?? null,
        user: cachedProfile?.profile ?? null,
      });
      return;
    }

    yourProfileStoreActions.busy();

    const profile = await getAPI().call(key)();

    setCache(key, profile);

    yourProfileStoreActions.ok({
      mdate: profile?.mdate ?? null,
      user: profile?.profile ?? null,
    });
  } catch (error: unknown) {
    yourProfileStoreActions.fail(error);
  }
};

export { getYourUserProfile };
