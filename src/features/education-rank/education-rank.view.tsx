import React from 'react';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import type { EducationRankViewModel } from 'models/view-models';
import { EducationLayout } from 'components/education-layout';
import { EducationDocumentsList } from 'components/education-documents-list';

type EducationRankViewProps = EducationRankViewModel;

const EducationRankView = ({ top }: EducationRankViewProps) => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <EducationLayout
        subTitle={`Top ${top.length} educational assets`}
        title="The Education Rank"
      >
        <EducationDocumentsList documents={top} />
        <></>
      </EducationLayout>
      <AppFooterContainer />
    </>
  );
};

export { EducationRankView };
