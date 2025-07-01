import Meta from "components/meta";
import { DocumentPreviewView } from "features/document-preview/document-preview.view";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import React from "react";
import { meta } from "../../meta";

const DocumentPreviewPage = () => {
	return <DocumentPreviewView />;
};

export default DocumentPreviewPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title={meta.title}
			description={meta.description}
			url={meta.siteUrl + meta.routes.documents.preview}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
			robots="noindex, nofollow"
		/>
	);
};
