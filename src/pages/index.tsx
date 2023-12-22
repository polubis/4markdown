import React from 'react';
import { useStaticQuery, type HeadFC, graphql } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import type { SiteMetadata } from 'models/queries';
import Meta from 'components/meta';
import {
  siteMetadatStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import {
  createInitialCode,
  useCreatorStore,
} from 'store/creator/creator.store';
import LogoThumbnail from 'images/logo-thumbnail.png';

interface HomePageQuery {
  site: {
    siteMetadata: SiteMetadata;
  };
}

const useHomePageQuery = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<HomePageQuery>(graphql`
    query HomePageQuery {
      site {
        siteMetadata {
          appName
          siteUrl
          description
          title
          company
          lang
          companyUrl
          discordUrl
          linkedInUrl
          sourceCodeUrl
          fbGroupUrl
          ytChannelUrl
          grammarlyUrl
          ytVideoTutorialUrl
        }
      }
    }
  `);

  return siteMetadata;
};

const HomePage: React.FC = () => {
  const synced = React.useRef(false);
  const siteMetadata = useHomePageQuery();

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
  
  console.log(process.env.GATSBY_TEST_USER_EMAIL)
  return <CreatorView />;
};

export default HomePage;

export const Head: HeadFC = () => {
  const meta = siteMetadatStoreSelectors.useReady();

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
