import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useYourAccountState } from "store/your-account";

const reloadYourAccountAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourAccount`;

    useYourAccountState.set({ is: `busy` });

    const account = await getAPI().call(key)();

    setCache(key, account);

    useYourAccountState.set({ is: `ok`, ...account });
  } catch (error: unknown) {
    useYourAccountState.set({ is: `fail`, error: parseError(error) });
  }
};

export { reloadYourAccountAct };
