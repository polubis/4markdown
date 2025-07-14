import { getAPI, parseError } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { getProfileId } from "../utils/get-profile-id";
import { AddUserProfileCommentFormValues } from "../models";
import { setUserProfileStatsAction } from "../models/actions";
import { safeUserProfileStatsSelector } from "../models/selectors";
import { useUserProfileState } from "../store";

const addUserProfileCommentAct = async ({
  content,
}: AddUserProfileCommentFormValues): AsyncResult => {
  try {
    const addedComment = await getAPI().call("addUserProfileComment")({
      receiverProfileId: getProfileId(),
      comment: content,
    });

    const stats = safeUserProfileStatsSelector(useUserProfileState.get());

    setUserProfileStatsAction({
      ...stats,
      comments: [...stats.comments, addedComment],
    });

    return { is: `ok` };
  } catch (error) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { addUserProfileCommentAct };
