import type { GatsbyConfig } from 'gatsby';
import type { SiteMetadata } from 'models/queries';

const siteMetadata: SiteMetadata = {
  appName: `4Markdown`,
  lang: `en`,
  siteUrl: `https://4markdown.com`,
  description: `Craft, edit, and preview your Markdown documents with ease, all within a clean and user-friendly interface`,
  title: `4Markdown - Online Markdown Editor`,
  companyUrl: `https://greenonsoftware.com/`,
  discordUrl: `https://discord.com/invite/PxXQayT3x3`,
  linkedInUrl: `https://www.linkedin.com/company/greenon-software/`,
  sourceCodeUrl: `https://github.com/polubis/4markdown`,
  ytChannelUrl: `https://www.youtube.com/channel/UCg3avsGct9zd_zK9AVpTOmQ`,
  fbGroupUrl: `https://www.facebook.com/groups/1472987149805006`,
  grammarlyUrl: `https://chromewebstore.google.com/detail/grammarly-grammar-checker/kbfnbcaeplbcioakkpcpgfkobkghlhen?pli=1`,
};

const config: GatsbyConfig = {
  siteMetadata,
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-root-import`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-dark-mode`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          `GA-TRACKING_ID`, // Google Analytics.
        ],
        head: true,
        anonymize: true,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/images/icon.png`,
        name: siteMetadata.appName,
        short_name: siteMetadata.appName,
        description: siteMetadata.description,
        start_url: `/`,
        background_color: `#fff`,
        lang: `en-US`,
        theme_color: `#fff`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./src/images/`,
      },
      __key: `images`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `./src/pages/`,
      },
      __key: `pages`,
    },
  ],
};

export default config;
