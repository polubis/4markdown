import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import DocPreviewView from 'features/doc-preview/doc-preview.view';
import { useStoreSync } from 'development-kit/use-store-sync';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';

const DocsPreviewPage: React.FC = () => {
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

  return <DocPreviewView />;
};

export default DocsPreviewPage;

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
      robots="noindex, nofollow"
    />
  );
};
