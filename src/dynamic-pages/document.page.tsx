import React from 'react';
import { type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { DocumentLayout } from 'components/document-layout';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { meta } from '../../meta';
import type { PermanentDocumentDto } from 'api-4markdown-contracts';

interface DocumentPageProps {
  pageContext: {
    doc: PermanentDocumentDto;
  };
}

const DocumentPage = ({ pageContext }: DocumentPageProps) => {
  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <DocumentLayout
        tags={pageContext.doc.tags}
        author={pageContext.doc.author}
      >
        {pageContext.doc.code}
      </DocumentLayout>
      <AppFooterContainer />
    </>
  );
};

export default DocumentPage;

export const Head: HeadFC<object, DocumentPageProps['pageContext']> = ({
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
      image={LogoThumbnail}
    />
  );
};
