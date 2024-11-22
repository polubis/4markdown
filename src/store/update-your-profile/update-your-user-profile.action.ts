import { getAPI, setCache } from 'api-4markdown';
import { updateYourProfileStoreActions } from './update-your-profile.store';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';

// @TODO[PRIO=3]: [Align user profile namings].
const updateYourUserProfile = async (
  payload: API4MarkdownPayload<'updateYourUserProfile'>,
): Promise<void> => {
  try {
    updateYourProfileStoreActions.busy();

    const { mdate, profile } = await getAPI().call(`updateYourUserProfile`)(
      payload,
    );

    setCache(`getYourUserProfile`, { profile, mdate });

    updateYourProfileStoreActions.ok();
    yourProfileStoreActions.ok({ mdate, user: profile });
  } catch (error: unknown) {
    updateYourProfileStoreActions.fail(error);
    throw error;
  }
};

export { updateYourUserProfile };
