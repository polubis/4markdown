import React from 'react';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import type { EducationRanPageModel } from 'models/page-models';
import { EducationLayout } from 'components/education-layout';
import { EducationDocumentsList } from 'components/education-documents-list';
import { EducationTopTags } from 'components/education-top-tags';
import { SubscribeNewsletterLink } from 'components/subscribe-newsletter-link';

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
      </AppNavigation>
      <EducationLayout
        subTitle={`Top ${topDocuments.length} educational assets`}
        title="The Education Rank"
      >
        <EducationDocumentsList documents={topDocuments} />
        <>
          <SubscribeNewsletterLink>
            Subscribe To Weekly Web Dev Newsletter
          </SubscribeNewsletterLink>
          <EducationTopTags className="mt-4" tags={topTags} />
        </>
      </EducationLayout>
      <AppFooterContainer />
    </>
  );
};

export { EducationRankView };
