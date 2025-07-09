import React from "react";
import { AppNavigation } from "components/app-navigation";
import { PrivacyPolicyContent } from "components/privacy-policy-content";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";

const UserProfileView = () => {
	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			<PrivacyPolicyContent />
			<AppFooterContainer />
		</>
	);
};

export { UserProfileView };
