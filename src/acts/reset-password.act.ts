import { getAPI, parseError } from "api-4markdown";
import type { AsyncResult } from "development-kit/utility-types";

const resetPasswordAct = async ({ email }: { email: string }): AsyncResult => {
  try {
    await getAPI().resetPassword(email);
    return { is: `ok` };
  } catch (rawError: unknown) {
    return { is: `fail`, error: parseError(rawError) };
  }
};

export { resetPasswordAct };
