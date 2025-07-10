import React from "react";
import { getUserProfileAct } from "../acts/get-user-profile.act";

const useUserProfileLoad = () => {
	React.useEffect(() => {
		getUserProfileAct();
	}, []);
};

export { useUserProfileLoad };
