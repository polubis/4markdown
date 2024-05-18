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
          blogUrl
          description
          title
          contactEmail
          authorsUrl
          company
          lang
          companyUrl
          discordUrl
          linkedInUrl
          sourceCodeUrl
          fbGroupUrl
          ytChannelUrl
          mdCheatsheet
          grammarlyUrl
          ytVideoTutorialUrl
          routes {
            home
            docs {
              browse
              preview
            }
            privacyPolicy
          }
        }
      }
    }
  `);

  return siteMetadata;
};

export { useSiteMetadataQuery };
