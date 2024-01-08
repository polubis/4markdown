import React from 'react';
import { type HeadFC } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import {
  createInitialCode,
  useCreatorStore,
} from 'store/creator/creator.store';

const HomePage: React.FC = () => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });

    const code = createInitialCode(siteMetadata);

    useCreatorStore.setState({
      is: `ready`,
      initialCode: code,
      prevCode: code,
      code,
    });

    synced.current = true;
  }

  return <CreatorView />;
};

export default HomePage;

export const Head: HeadFC = () => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl}
      keywords={`${meta.appName}, Editor, Github markdown editor online, ${meta.company}, Programming articles, Markdown preview, Online markdown editor`}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
