import React from 'react';
import { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { appMetadata } from 'core/constants';

const NotFoundPage = () => {
  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-2xl p-4 mx-auto h-screen flex flex-col justify-center">
        <h1 className="text-2xl">
          Resource Not Found at the Specified <strong>URL</strong>
        </h1>
        <p className="mt-2">
          If this is a <strong>permanent document</strong>, please wait some
          time for it to be available at the specified <strong>URL</strong>.
          Typically, it takes several days.
        </p>
      </main>
      <AppFooterContainer />
    </>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={appMetadata.appName}
      title={appMetadata.title}
      description={appMetadata.description}
      url={appMetadata.siteUrl}
      lang={appMetadata.lang}
      image={LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
