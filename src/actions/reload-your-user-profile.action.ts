import { getAPI, parseError, setCache } from 'api-4markdown';
import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import { useYourProfileState } from 'store/your-profile';

const reloadYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

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

export { reloadYourUserProfile };
