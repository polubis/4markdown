import React from 'react';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import type { EducationRanPageModel } from 'models/page-models';
import { EducationLayout } from 'components/education-layout';
import { EducationDocumentsList } from 'components/education-documents-list';
import { EducationTopTags } from 'components/education-top-tags';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';

type EducationRankViewProps = EducationRanPageModel;

const EducationRankView = ({
  topDocuments,
  topTags,
}: EducationRankViewProps) => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
        <EducationRankLinkContainer />
      </AppNavigation>
      <EducationLayout
        subTitle={`Top ${topDocuments.length} educational assets`}
        title="The Education Rank"
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
