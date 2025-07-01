import type { PermanentDocumentDto } from "api-4markdown-contracts";
import { AppNavigation } from "components/app-navigation";
import Meta from "components/meta";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { DocumentLayoutContainer } from "containers/document-layout.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import { DocumentLayoutProvider } from "providers/document-layout.provider";
import React from "react";
import { meta } from "../../meta";

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
