import type { YourAccountState } from "./models";

const hasTokensForFeatureSelector =
	(tokensCost: number) => (state: YourAccountState) =>
		state.is === `ok` && state.balance.tokens - tokensCost >= 0;

export { hasTokensForFeatureSelector };
