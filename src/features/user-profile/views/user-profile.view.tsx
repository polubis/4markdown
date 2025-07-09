import React from "react";
import { AppNavigation } from "components/app-navigation";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { useUserProfileLoad } from "../hooks/use-user-profile-load";
import { UserProfileContentContainer } from "../containers/user-profile-content.container";

const UserProfileView = () => {
	useUserProfileLoad();

	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			<UserProfileContentContainer />
			<AppFooterContainer />
		</>
	);
};

export { UserProfileView };
