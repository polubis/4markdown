import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import { meta } from '../../meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import type { UserProfileDto } from 'api-4markdown-contracts';
import { AuthorView } from 'features/author/author.view';
import { AppNavigation } from 'components/app-navigation';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { AppFooterContainer } from 'containers/app-footer.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';

type AuthorPageProps = {
  pageContext: {
    author: UserProfileDto | null;
  };
};

const AuthorPage = ({ pageContext }: AuthorPageProps) => {
  const { author } = pageContext;

  if (!author) {
    return (
      <>
        <AppNavigation>
          <CreationLinkContainer />
          <EducationRankLinkContainer />
          <EducationZoneLinkContainer />
        </AppNavigation>
        <main className="max-w-2xl p-4 mx-auto h-screen flex flex-col justify-center">
          <h1 className="text-2xl">Author Not Found</h1>
          <p className="mt-2">
            The profile may not exist or may have been removed.
          </p>
          <p className="mt-4">
            <a
              href={meta.routes.education.zone}
              className="text-blue-500 underline"
            >
              Browse our education zone
            </a>
            to discover more content.
          </p>
        </main>
        <AppFooterContainer />
      </>
    );
  }

  return <AuthorView author={author} />;
};

export default AuthorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Author Profile`}
      description={`View the profile of this author on our platform. Explore their contributions and documents.`}
      url={`${meta.siteUrl}${meta.routes.authors}`}
      lang={meta.lang}
      image={`${meta.siteUrl}${LogoThumbnail}`}
    />
  );
};
