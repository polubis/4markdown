import { falsy } from "development-kit/guards";
import { useYourAccountState } from ".";

const { set } = useYourAccountState;

const updateTokensAction = (tokens: number): void => {
  set((state) => {
    falsy(
      state.is === `ok`,
      `Attempt of changing tokens while account is not loaded`,
    );

    return {
      balance: {
        ...state.balance,
        tokens,
      },
    };
  });
};

export { updateTokensAction };
