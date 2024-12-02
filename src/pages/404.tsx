import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { meta } from '../../meta';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';

const NotFoundPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
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
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.notFound}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
