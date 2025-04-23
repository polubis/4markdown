import { type YourAccountState } from './models';

const hasNotEnoughTokensSelector =
  (tokensCost: number) => (state: YourAccountState) =>
    state.is === `ok` && state.balance.tokens - tokensCost < 0;

export { hasNotEnoughTokensSelector };
