import { getAPI, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { asBusy, asOk, asFail } from 'store/your-user-profile/actions';

const reloadYourUserProfileAct = async (): AsyncResult => {
  try {
    asBusy();

    const profile = await getAPI().call(`getYourUserProfile`)();

    setCache(`getYourUserProfile`, profile);

    return asOk(profile);
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { reloadYourUserProfileAct };
