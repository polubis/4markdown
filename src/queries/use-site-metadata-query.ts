import { graphql, useStaticQuery } from 'gatsby';
import type { SiteMetadata } from 'models/queries';

interface SiteMetadataQuery {
  site: {
    siteMetadata: SiteMetadata;
  };
}

const useSiteMetadataQuery = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<SiteMetadataQuery>(graphql`
    query SiteMetadata {
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
          routes {
            home
            docs {
              browse
              preview
            }
            mindmaps {
              creator
            }
          }
        }
      }
    }
  `);

  return siteMetadata;
};

export { useSiteMetadataQuery };
