import React from 'react';
import { HeadFC } from 'gatsby';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { AppNavContainer } from 'containers/app-nav.container';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';

const NotFoundPage = () => {
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
      <main className="max-w-4xl p-4 mx-auto h-screen flex flex-col justify-center">
        <h1 className="text-2xl dark:text-white text-black">
          Resource Not Found at the Specified <strong>URL</strong>
        </h1>
        <p className="mt-2">
          If this is a <strong>permanent document</strong>, please wait some
          time for it to be available at the specified <strong>URL</strong>.
          Typically, it takes several days.
        </p>
      </main>
    </>
  );
};

export default NotFoundPage;

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
