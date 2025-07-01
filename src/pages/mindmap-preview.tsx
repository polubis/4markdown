import Meta from "components/meta";
import { MindmapPreviewView } from "features/mindmap-preview/mindmap-preview.view";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import React from "react";
import { meta } from "../../meta";

const MindmapPreviewPage = () => {
	return <MindmapPreviewView />;
};

export default MindmapPreviewPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title={meta.title}
			description={meta.description}
			url={meta.siteUrl + meta.routes.mindmaps.preview}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
			robots="noindex, nofollow"
		/>
	);
};
