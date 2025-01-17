import { getAPI, getCache, parseError, setCache } from 'api-4markdown';

import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import { useYourUserProfileState } from 'store/your-user-profile';

const getYourUserProfileAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

    const { is } = useYourUserProfileState.get();

    if (is !== `idle`) return;

    const cachedProfile = getCache(key);

    if (cachedProfile !== null) {
      useYourUserProfileState.swap({
        is: `ok`,
        mdate: cachedProfile?.mdate ?? null,
        user: cachedProfile?.profile ?? null,
      });
      return;
    }

    useYourUserProfileState.swap({ is: `busy` });

    const profile = await getAPI().call(key)();

    setCache(key, profile);

    useYourUserProfileState.swap({
      is: `ok`,
      mdate: profile?.mdate ?? null,
      user: profile?.profile ?? null,
    });
  } catch (error: unknown) {
    useYourUserProfileState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourUserProfileAct };
