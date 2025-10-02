import { UserProfileId } from "api-4markdown-contracts";
import { useResourceAccessState } from ".";

const setPhraseAction = (phrase: string) => {
  useResourceAccessState.set({ phrase });
};

const removeAccessItemAction = (userId: UserProfileId) => {
  useResourceAccessState.set(({ access }) => ({
    access: access.filter((user) => user.id !== userId),
  }));
};

export { setPhraseAction, removeAccessItemAction };
