import { getAPI, getCache, parseError, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';

const getYourUserProfileAct = async (): AsyncResult => {
  try {
    const cachedProfile = getCache(`getYourUserProfile`);

    if (cachedProfile !== null) {
      yourProfileStoreActions.ok({
        mdate: cachedProfile?.mdate ?? null,
        user: cachedProfile?.profile ?? null,
      });
      return { is: `ok` };
    }

    yourProfileStoreActions.busy();

    const profile = await getAPI().call(`getYourUserProfile`)();

    setCache(`getYourUserProfile`, profile);

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

export { getYourUserProfileAct };
