import Meta from "components/meta";
import { EducationRankView } from "features/education-rank/education-rank.view";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import type { EducationRankPageModel } from "models/page-models";
import React from "react";
import { meta } from "../../meta";

type EducationRankPageProps = {
	pageContext: EducationRankPageModel;
};

const EducationRankPage = ({
	pageContext: { topDocuments, topTags },
}: EducationRankPageProps) => {
	return <EducationRankView topDocuments={topDocuments} topTags={topTags} />;
};

export default EducationRankPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title="The Education Rank: Programming, Science & More"
			description="Explore the top educational resources in programming, science, and math. Enhance your knowledge with the best content."
			url={meta.siteUrl + meta.routes.education.rank}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
		/>
	);
};
