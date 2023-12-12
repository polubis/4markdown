import React from 'react';
import { useStaticQuery, type HeadFC, graphql } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import type { SiteMetadata } from 'models/queries';
import Meta from 'components/meta';

const HomePage: React.FC = () => {
  return <CreatorView />;
};

export default HomePage;

export const Head: HeadFC = () => {
  const { appName, siteUrl, title, description, lang } =
    useStaticQuery<SiteMetadata>(graphql`
      query HomePageQuery {
        site {
          siteMetadata {
            appName
            siteUrl
            title
            description
            lang
          }
        }
      }
    `);

  return (
    <Meta
      appName={appName}
      title={title}
      description={description}
      url={siteUrl}
      lang={lang}
    />
  );
};
