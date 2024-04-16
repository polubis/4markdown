import React from 'react';
import { type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import { PermanentDoc } from 'models/doc';
import { AppNavContainer } from 'containers/app-nav.container';
import { DocumentLayout } from 'components/document-layout';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';

interface DocumentPageProps {
  pageContext: {
    doc: PermanentDoc;
  };
}

const DocumentPage = ({ pageContext }: DocumentPageProps) => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });

    synced.current = true;
  }

  return (
    <>
      <AppNavContainer>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavContainer>
      <DocumentLayout tags={pageContext.doc.tags}>
        {pageContext.doc.code}
      </DocumentLayout>
    </>
  );
};

export default DocumentPage;

export const Head: HeadFC<object, DocumentPageProps['pageContext']> = ({
  pageContext,
}) => {
  const meta = siteMetadataStoreSelectors.useReady();

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
