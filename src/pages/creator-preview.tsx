import { Markdown } from "components/markdown";
import Meta from "components/meta";
import { useCreatorLocalStorageSync } from "core/use-creator-local-storage-sync";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import React from "react";
import { useDocumentCreatorState } from "store/document-creator";
import { meta } from "../../meta";

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
