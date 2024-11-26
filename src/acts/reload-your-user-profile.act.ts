import { getAPI, parseError, setCache } from 'api-4markdown';
import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';

const reloadYourUserProfileAct = async (): AsyncResult => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

    yourProfileStoreActions.busy();

    const profile = await getAPI().call(key)();

    setCache(key, profile);

    yourProfileStoreActions.ok({
      mdate: profile?.mdate ?? null,
      user: profile?.profile ?? null,
    });
    return { is: `ok` };
  } catch (error: unknown) {
    yourProfileStoreActions.fail(error);
    return { is: `fail`, error: parseError(error) };
  }
};

export { reloadYourUserProfileAct };
