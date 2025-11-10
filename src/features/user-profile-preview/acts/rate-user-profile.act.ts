import { customError, getAPI } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { useUserProfileState } from "../store";

const rateUserProfileAct = async (
  payload: API4MarkdownPayload<"rateUserProfile">,
): Promise<void> => {
  try {
    const currentState = useUserProfileState.get();

    if (currentState.stats.is !== `ok`) {
      throw customError(
        `User profile is not loaded yet but you are trying to add a score`,
      );
    }

    const currentRating = currentState.stats.profile[payload.category] ?? 0;

    useUserProfileState.swap({
      ...currentState,
      stats: {
        ...currentState.stats,
        profile: {
          ...currentState.stats.profile,
          [payload.category]: currentRating + 1,
        },
      },
    });

    await getAPI().call("rateUserProfile")(payload);
  } catch (error) {
    const currentState = useUserProfileState.get();

    if (currentState.stats.is !== `ok`) {
      throw customError(
        `User profile is not loaded yet but you are trying to add a score`,
      );
    }

    const currentRating = currentState.stats.profile[payload.category] ?? 0;

    useUserProfileState.swap({
      ...currentState,
      stats: {
        ...currentState.stats,
        profile: {
          ...currentState.stats.profile,
          [payload.category]: currentRating - 1 < 0 ? 0 : currentRating - 1,
        },
      },
    });

    throw error;
  }
};

export { rateUserProfileAct };
