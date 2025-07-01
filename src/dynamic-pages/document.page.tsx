import React from "react";
import type { HeadFC } from "gatsby";
import Meta from "components/meta";
import LogoThumbnail from "images/logo-thumbnail.png";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { AppNavigation } from "components/app-navigation";
import { meta } from "../../meta";
import type { PermanentDocumentDto } from "api-4markdown-contracts";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { DocumentLayoutProvider } from "providers/document-layout.provider";
import { DocumentLayoutContainer } from "containers/document-layout.container";
import { AppFooterContainer } from "containers/app-footer.container";

interface DocumentPageProps {
	pageContext: {
		doc: PermanentDocumentDto;
	};
}

const DocumentPage = ({ pageContext }: DocumentPageProps) => {
	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			<DocumentLayoutProvider document={pageContext.doc}>
				<DocumentLayoutContainer />
			</DocumentLayoutProvider>
			<AppFooterContainer />
		</>
	);
};

export default DocumentPage;

export const Head: HeadFC<unknown, DocumentPageProps["pageContext"]> = ({
	pageContext,
}) => {
	return (
		<Meta
			appName={meta.appName}
			title={pageContext.doc.name}
			description={pageContext.doc.description}
			url={`${meta.siteUrl}${pageContext.doc.path}`}
			keywords={`${meta.appName}, ${pageContext.doc.name}`}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
		/>
	);
};
