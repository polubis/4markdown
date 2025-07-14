import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useYourAccountState } from "store/your-account";

const getYourAccountAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourAccount`;

    const { is } = useYourAccountState.get();

    if (is !== `idle`) return;

    const cachedAccount = getCache(key);

    if (cachedAccount !== null) {
      useYourAccountState.swap({ is: `ok`, ...cachedAccount });
      return;
    }

    useYourAccountState.swap({ is: `busy` });

    const account = await getAPI().call(key)();

    setCache(key, account);

    useYourAccountState.swap({ is: `ok`, ...account });
  } catch (error: unknown) {
    useYourAccountState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourAccountAct };
