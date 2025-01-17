import { getAPI, getCache, parseError, setCache } from 'api-4markdown';

import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import { useYourProfileState } from 'store/your-profile';

const getYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

    const { is } = useYourProfileState.get();

    if (is !== `idle`) return;

    const cachedProfile = getCache(key);

    if (cachedProfile !== null) {
      useYourProfileState.swap({
        is: `ok`,
        mdate: cachedProfile?.mdate ?? null,
        user: cachedProfile?.profile ?? null,
      });
      return;
    }

    useYourProfileState.swap({ is: `busy` });

    const profile = await getAPI().call(key)();

    setCache(key, profile);

    useYourProfileState.swap({
      is: `ok`,
      mdate: profile?.mdate ?? null,
      user: profile?.profile ?? null,
    });
  } catch (error: unknown) {
    useYourProfileState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourUserProfile };
