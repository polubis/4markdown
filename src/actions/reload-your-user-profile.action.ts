import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useYourUserProfileState } from "store/your-user-profile";

const reloadYourUserProfile = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourUserProfile`;

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

export { reloadYourUserProfile };
