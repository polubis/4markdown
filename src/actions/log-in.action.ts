import { getAPI } from 'api-4markdown';

const logIn = async (): Promise<void> => {
  try {
    await getAPI().logIn();
  } catch (error: unknown) {}
};

export { logIn };
