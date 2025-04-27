import { getAPI, getCache, parseError, setCache } from 'api-4markdown';
import { useYourAccountState } from 'store/your-account';

const getYourAccountAct = async (): Promise<void> => {
  try {
    const { is } = useYourAccountState.get();

    if (is !== `idle`) return;

    const cachedAccount = getCache(`getYourAccount`);

    if (cachedAccount !== null) {
      useYourAccountState.swap({ is: `ok`, ...cachedAccount });
      return;
    }

    useYourAccountState.swap({ is: `busy` });

    const account = await getAPI().call(`getYourAccount`)();

    setCache(`getYourAccount`, account);

    useYourAccountState.swap({ is: `ok`, ...account });
  } catch (error: unknown) {
    useYourAccountState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourAccountAct };
