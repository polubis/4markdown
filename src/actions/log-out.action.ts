import { getAPI, removeCache } from 'api-4markdown';

// @TODO[PRIO=2]: [Add error handling here...].
const logOut = async (): Promise<void> => {
  try {
    await getAPI().logOut();
    removeCache(`getYourUserProfile`, `getYourDocuments`, `getYourMindmaps`);
  } catch {}
};

export { logOut };
