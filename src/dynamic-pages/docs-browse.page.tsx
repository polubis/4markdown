import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import { DocsBrowseView } from 'features/docs-browse/docs-browse.view';
import { DocsBrowsePageContext } from 'models/pages-contexts';

interface DocsBrowsePageProps {
  pageContext: DocsBrowsePageContext;
}

const DocsBrowsePage = ({ pageContext }: DocsBrowsePageProps) => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });
    synced.current = true;
  }

  return <DocsBrowseView context={pageContext} />;
};

export default DocsBrowsePage;

export const Head: HeadFC = () => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title="Explore a Wealth of Knowledge: Articles About Everything"
      description="Embark on a diverse journey through our extensive collection of articles about programming, mathematics, medicine, and more!"
      url={meta.siteUrl + meta.routes.docs.browse}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
