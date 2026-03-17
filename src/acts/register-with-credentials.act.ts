import { getAPI, parseError } from "api-4markdown";
import type { AsyncResult } from "development-kit/utility-types";

const registerWithCredentialsAct = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): AsyncResult => {
  try {
    await getAPI().registerWithCredentials(email, password);
    return { is: `ok` };
  } catch (rawError: unknown) {
    return { is: `fail`, error: parseError(rawError) };
  }
};

export { registerWithCredentialsAct };
