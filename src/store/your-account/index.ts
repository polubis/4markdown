import { state } from "development-kit/state";
import { type YourAccountState } from "./models";

const useYourAccountState = state<YourAccountState>({ is: `idle` });

export { useYourAccountState };
