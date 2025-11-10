import { customError, getAPI } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { useUserProfileState } from "../store";

const rateUserProfileCommentAct = async (
  payload: API4MarkdownPayload<"rateUserProfileComment">,
): Promise<void> => {
  try {
    const currentState = useUserProfileState.get();

    if (currentState.stats.is !== `ok`) {
      throw customError(
        `User profile is not loaded yet but you are trying to add a score`,
      );
    }

    const currentRating =
      currentState.stats.comments.find(
        (comment) => comment.id === payload.commentId,
      )?.[payload.category] ?? 0;

    useUserProfileState.swap({
      ...currentState,
      stats: {
        ...currentState.stats,
        comments: currentState.stats.comments.map((comment) =>
          comment.id === payload.commentId
            ? { ...comment, [payload.category]: currentRating + 1 }
            : comment,
        ),
      },
    });

    await getAPI().call("rateUserProfileComment")(payload);
  } catch (error) {
    const currentState = useUserProfileState.get();

    if (currentState.stats.is !== `ok`) {
      throw customError(
        `User profile is not loaded yet but you are trying to rate a comment`,
      );
    }

    const currentRating =
      currentState.stats.comments.find(
        (comment) => comment.id === payload.commentId,
      )?.[payload.category] ?? 0;

    useUserProfileState.swap({
      ...currentState,
      stats: {
        ...currentState.stats,
        comments: currentState.stats.comments.map((comment) =>
          comment.id === payload.commentId
            ? {
                ...comment,
                [payload.category]:
                  currentRating - 1 < 0 ? 0 : currentRating - 1,
              }
            : comment,
        ),
      },
    });

    throw error;
  }
};

export { rateUserProfileCommentAct };
