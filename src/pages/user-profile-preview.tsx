import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { UserProfilePreviewView } from "features/user-profile-preview";

const UserProfilePreviewPage = () => {
	return <UserProfilePreviewView />;
};

export default UserProfilePreviewPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title={`Browse ${meta.appName} authors content, rating and see their work`}
			description={`Browse your favorite ${meta.appName} authors content and rate their work`}
			url={meta.siteUrl + meta.routes.userProfile.preview}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
			robots="noindex, nofollow"
		/>
	);
};
