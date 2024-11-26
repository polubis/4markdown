import { getAPI, parseError, setCache } from 'api-4markdown';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { updateYourProfileStoreActions } from 'store/update-your-profile/update-your-profile.store';
import type { AsyncResult } from 'development-kit/utility-types';

// @TODO[PRIO=3]: [Align user profile namings].
const updateYourUserProfileAct = async (
  payload: API4MarkdownPayload<'updateYourUserProfile'>,
): AsyncResult => {
  try {
    updateYourProfileStoreActions.busy();

    const { mdate, profile } = await getAPI().call(`updateYourUserProfile`)(
      payload,
    );

    setCache(`getYourUserProfile`, { profile, mdate });

    updateYourProfileStoreActions.ok();
    yourProfileStoreActions.ok({ mdate, user: profile });
    return { is: `ok` };
  } catch (error: unknown) {
    updateYourProfileStoreActions.fail(error);
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateYourUserProfileAct };
