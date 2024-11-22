import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';

const reloadYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

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

export { reloadYourUserProfile };
