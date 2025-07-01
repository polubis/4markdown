import { AppNavigation } from "components/app-navigation";
import { EducationDocumentsList } from "components/education-documents-list";
import { EducationLayout } from "components/education-layout";
import { EducationTopTags } from "components/education-top-tags";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import type { EducationRankPageModel } from "models/page-models";
import React from "react";

type EducationRankViewProps = EducationRankPageModel;

const EducationRankView = ({
	topDocuments,
	topTags,
}: EducationRankViewProps) => {
	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			<EducationLayout
				subTitle={`Top ${topDocuments.length} educational assets`}
				title="Education Rank"
			>
				<EducationDocumentsList documents={topDocuments} />
				<>
					<EducationTopTags tags={topTags} />
				</>
			</EducationLayout>
			<AppFooterContainer />
		</>
	);
};

export { EducationRankView };
