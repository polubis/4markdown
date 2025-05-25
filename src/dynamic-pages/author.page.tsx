import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import { meta } from '../../meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import type { AuthorProfileDto } from 'api-4markdown-contracts';

interface AuthorPageProps {
  pageContext: {
    author: AuthorProfileDto;
  };
}

const AuthorPage = ({ pageContext }: AuthorPageProps) => {
  const { author } = pageContext;
  console.log(author);
  return (
    <>
      <h1>Author Page</h1>
    </>
  );
};

export default AuthorPage;

export const Head: HeadFC<unknown, AuthorPageProps['pageContext']> = ({
  pageContext,
}) => {
  const { author } = pageContext;
  const pageTitle = `${author.displayName || `Author Profile`} - ${meta.appName}`;
  const pageDescription =
    author.bio ||
    `View the profile of ${author.displayName || `this author`} on ${meta.appName}.`;
  const pageUrl = `${meta.siteUrl}${meta.routes.authors}${author.id}/`;
  const imageUrl = author.avatar?.lg.src
    ? `${meta.siteUrl}${author.avatar.lg.src}`
    : `${meta.siteUrl}${LogoThumbnail}`;

  return (
    <Meta
      appName={meta.appName}
      title={pageTitle}
      description={pageDescription}
      url={pageUrl}
      keywords={`${meta.appName}, ${author.displayName}, author profile, documents, mindmaps`}
      lang={meta.lang}
      image={imageUrl}
    />
  );
};
