import { getAPI, setCache } from 'api-4markdown';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { updateYourProfileStoreActions } from 'store/update-your-profile/update-your-profile.store';

// @TODO[PRIO=3]: [Align user profile namings].
const updateYourUserProfile = async (
  payload: API4MarkdownPayload<'updateYourUserProfile'>,
  onOk?: () => void,
): Promise<void> => {
  try {
    updateYourProfileStoreActions.busy();

    const { mdate, profile } = await getAPI().call(`updateYourUserProfile`)(
      payload,
    );

    setCache(`getYourUserProfile`, { profile, mdate });

    updateYourProfileStoreActions.ok();
    yourProfileStoreActions.ok({ mdate, user: profile });
    onOk?.();
  } catch (error: unknown) {
    updateYourProfileStoreActions.fail(error);
  }
};

export { updateYourUserProfile };
