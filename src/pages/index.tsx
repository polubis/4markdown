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
import { useStoreSync } from 'development-kit/use-store-sync';
import {
  createInitialCode,
  useCreatorStore,
} from 'store/creator/creator.store';

const HomePage: React.FC = () => {
  const siteMetadata = useSiteMetadataQuery();

  useStoreSync(
    useSiteMetadataStore,
    () =>
      ({
        ...siteMetadata,
        is: `ready`,
      }) as const,
    ({ is }) => is === `idle`,
  );
  useStoreSync(
    useCreatorStore,
    () => {
      const code = createInitialCode(siteMetadata);

      return {
        is: `ready`,
        initialCode: code,
        prevCode: code,
        code,
      } as const;
    },
    ({ is }) => is === `idle`,
  );

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
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
