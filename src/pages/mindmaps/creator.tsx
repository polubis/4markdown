import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import MindmapsCreatorView from 'features/mindmaps-creator/mindmaps-creator.view';

const MindmapsCreatorPage = () => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });
    synced.current = true;
  }

  return <MindmapsCreatorView />;
};

export default MindmapsCreatorPage;

export const Head: HeadFC = () => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title={`Mindmaps Creator for Building a Knowledge Base`}
      description={`Use this powerful creator to build and link your materials. Share them with others and contribute to each other's work`}
      url={meta.siteUrl + meta.routes.mindmaps.creator}
      lang={meta.lang}
      keywords={`${meta.appName}, Mindmaps creator, Online mindmaps builder, Online mindmaps editor`}
      image={LogoThumbnail}
    />
  );
};
