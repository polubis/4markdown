import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { updateYourProfileStoreActions } from 'store/update-your-profile/update-your-profile.store';
import { useYourUserProfileState } from 'store/your-user-profile';

// @TODO[PRIO=3]: [Align user profile namings].
const updateYourUserProfile = async (
  payload: API4MarkdownPayload<'updateYourUserProfileV2'>,
  onOk?: () => void,
): Promise<void> => {
  try {
    updateYourProfileStoreActions.busy();

    const { mdate, profile } = await getAPI().call(`updateYourUserProfileV2`)(
      payload,
    );

    setCache(`getYourUserProfile`, { profile, mdate });

    updateYourProfileStoreActions.ok();
    useYourUserProfileState.swap({ is: `ok`, mdate, user: profile });
    onOk?.();
  } catch (error: unknown) {
    updateYourProfileStoreActions.fail(error);
  }
};

export { updateYourUserProfile };
