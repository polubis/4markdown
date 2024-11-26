type AuthIdleState = { is: 'idle' };
type AuthAuthorizedState = {
  is: 'authorized';
  user: {
    name: string | null;
    avatar: string | null;
  };
};

type AuthUnauthorizedState = {
  is: 'unauthorized';
};

type AuthState = AuthIdleState | AuthAuthorizedState | AuthUnauthorizedState;

export type {
  AuthState,
  AuthIdleState,
  AuthAuthorizedState,
  AuthUnauthorizedState,
};
