import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { asBusy, asFail, asOk } from 'store/your-user-profile/actions';

const updateYourUserProfileAct = async (
  payload: API4MarkdownPayload<'updateYourUserProfile'>,
): AsyncResult => {
  try {
    asBusy();

    const profile = await getAPI().call(`updateYourUserProfile`)(payload);

    setCache(`getYourUserProfile`, profile);

    return asOk(profile);
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { updateYourUserProfileAct };
