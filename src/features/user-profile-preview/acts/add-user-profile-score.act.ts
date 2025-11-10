import { customError, getAPI } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { useUserProfileState } from "../store";

const addUserProfileScoreAct = async (
  payload: API4MarkdownPayload<"addUserProfileScore">,
): Promise<void> => {
  try {
    const newScore = await getAPI().call("addUserProfileScore")(payload);

    const currentState = useUserProfileState.get();

    if (currentState.stats.is !== `ok`) {
      throw customError(
        `User profile is not loaded yet but you are trying to add a score`,
      );
    }

    useUserProfileState.swap({
      ...currentState,
      stats: {
        ...currentState.stats,
        profile: {
          ...currentState.stats.profile,
          ...newScore,
        },
      },
    });
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: we need to throw the error to be handled by the caller
    throw error;
  }
};

export { addUserProfileScoreAct };
