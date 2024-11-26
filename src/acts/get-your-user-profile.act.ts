import { getAPI, getCache, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { asBusy, asFail, asOk } from 'store/your-user-profile/actions';

const getYourUserProfileAct = async (): AsyncResult => {
  try {
    const cachedProfile = getCache(`getYourUserProfile`);

    if (cachedProfile !== null) return asOk(cachedProfile);

    asBusy();

    const profile = await getAPI().call(`getYourUserProfile`)();

    setCache(`getYourUserProfile`, profile);

    return asOk(profile);
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { getYourUserProfileAct };
