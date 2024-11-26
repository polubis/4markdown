import { getAPI, parseError, removeCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';

const logOutAct = async (): AsyncResult => {
  try {
    await getAPI().logOut();
    removeCache(`getYourUserProfile`, `getYourDocuments`);
    return { is: `ok` };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { logOutAct };
