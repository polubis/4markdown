import React from "react";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { AppNavigation } from "components/app-navigation";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import type { EducationRankPageModel } from "models/page-models";
import { EducationLayout } from "components/education-layout";
import { EducationTopTags } from "components/education-top-tags";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationDocumentsListContainer } from "containers/education-documents-list.container";

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
        <EducationDocumentsListContainer documents={topDocuments} />
        <>
          <EducationTopTags tags={topTags} />
        </>
      </EducationLayout>
      <AppFooterContainer />
    </>
  );
};

export { EducationRankView };
