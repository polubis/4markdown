import { getAPI, parseError, removeCache } from "api-4markdown";
import type { AsyncResult } from "development-kit/utility-types";

const logOutAct = async (): AsyncResult => {
  try {
    await getAPI().logOut();
    removeCache(
      `getYourUserProfile`,
      `getYourDocuments`,
      `getYourAccount`,
      `getYourMindmaps`,
      `getUserResourceCompletions`,
    );
    return { is: `ok` };
  } catch (rawError: unknown) {
    return { is: `fail`, error: parseError(rawError) };
  }
};

export { logOutAct };
