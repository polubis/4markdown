import React from "react";
import { getUserProfileAct } from "../acts/get-user-profile.act";
import { useUserProfileContext } from "../providers/user-profile.provider";

const useUserProfileLoad = () => {
	const [, set] = useUserProfileContext();

	React.useEffect(() => {
		const loadProfile = async (): Promise<void> => {
			set({ is: `busy` });
			set(await getUserProfileAct());
		};

		loadProfile();
	}, []);
};

export { useUserProfileLoad };
