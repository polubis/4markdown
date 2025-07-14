import { create } from "zustand";

type AuthorizedData = {
  user: {
    name: string | null;
    avatar: string | null;
    uid: string;
  };
};

type AuthStoreStateIdle = { is: "idle" };
type AuthStoreStateAuthorized = {
  is: "authorized";
} & AuthorizedData;

type AuthStoreStateUnauthorized = {
  is: "unauthorized";
};

type AuthStoreState =
  | AuthStoreStateIdle
  | AuthStoreStateAuthorized
  | AuthStoreStateUnauthorized;

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useAuthStore;

const getAuthorized = (state: AuthStoreState): AuthStoreStateAuthorized => {
  if (state.is !== `authorized`)
    throw Error(`Tried to access authorized only state`);

  return state;
};

const authStoreSelectors = {
  authorized: () => getAuthorized(getState()),
  useAuthorized: () => useAuthStore(getAuthorized),
} as const;

const set = (state: AuthStoreState): void => {
  setState(state, true);
};

const authStoreActions = {
  authorize: (user: AuthorizedData["user"]) => {
    set({
      is: `authorized`,
      user,
    });
  },
  unauthorize: () => {
    set({ is: `unauthorized` });
  },
};

export { useAuthStore, authStoreActions, authStoreSelectors };
