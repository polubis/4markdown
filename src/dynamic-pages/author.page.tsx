import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import { meta } from '../../meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import type { AuthorProfileDto } from 'api-4markdown-contracts';
import { AuthorView } from 'features/author/author.view';

interface AuthorPageProps {
  pageContext: {
    author: AuthorProfileDto;
  };
}

const AuthorPage = ({ pageContext }: AuthorPageProps) => {
  return <AuthorView author={pageContext.author} />;
};

export default AuthorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Author Profile"
      description="View the profile of this author on our platform. Explore their contributions and documents."
      url={meta.siteUrl + meta.routes.authors}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
