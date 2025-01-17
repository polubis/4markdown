import { getAPI, getCache, setCache } from 'api-4markdown';
import {
  yourProfileStoreActions,
  yourProfileStoreSelectors,
} from 'store/your-profile/your-profile.store';
import type { API4MarkdownContractKey } from 'api-4markdown-contracts';

const getYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfileV2`;

    const { is } = yourProfileStoreSelectors.state();

    if (is !== `idle`) return;

    const cachedProfile = getCache(key);

    if (cachedProfile !== null) {
      yourProfileStoreActions.ok(cachedProfile);
      return;
    }

    yourProfileStoreActions.busy();

    const profile = await getAPI().call(key)();

    setCache(key, profile);

    yourProfileStoreActions.ok(profile);
  } catch (error: unknown) {
    yourProfileStoreActions.fail(error);
  }
};

export { getYourUserProfile };
