import { getAPI, parseError } from 'api-4markdown';
import { useYourAccountState } from 'store/your-account';

const getYourAccountAct = async (): Promise<void> => {
  try {
    const { is } = useYourAccountState.get();

    if (is !== `idle`) return;

    useYourAccountState.set({ is: `busy` });

    const account = await getAPI().call(`getYourAccount`)();

    useYourAccountState.set({ is: `ok`, ...account });
  } catch (error: unknown) {
    useYourAccountState.set({ is: `fail`, error: parseError(error) });
  }
};

export { getYourAccountAct };
