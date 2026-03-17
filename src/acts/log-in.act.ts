import { getAPI, parseError } from "api-4markdown";
import type { AsyncResult } from "development-kit/utility-types";

const logInAct = async (): AsyncResult => {
  try {
    await getAPI().logIn();
    return { is: `ok` };
  } catch (rawError: unknown) {
    return { is: `fail`, error: parseError(rawError) };
  }
};

export { logInAct };
