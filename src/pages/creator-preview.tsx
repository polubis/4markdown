import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { useCreatorLocalStorageSync } from "core/use-creator-local-storage-sync";
import { useDocumentCreatorState } from "store/document-creator";
import { Markdown } from "components/markdown";

const CreatorPreviewPage = () => {
	useCreatorLocalStorageSync();

	const { code } = useDocumentCreatorState();

	return (
		<main>
			<Markdown className="p-4 mx-auto">{code}</Markdown>
		</main>
	);
};

export default CreatorPreviewPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title={meta.title}
			description={meta.description}
			url={meta.siteUrl + meta.routes.creator.preview}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
			robots="noindex, nofollow"
		/>
	);
};
