import { state } from "development-kit/state";
import { UserProfileState } from "../models";

const useUserProfileState = state<UserProfileState>({
	stats: {
		is: `idle`,
	},
});

export { useUserProfileState };
