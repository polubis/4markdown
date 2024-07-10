import type { GatsbyConfig } from 'gatsby';
import { meta } from './meta';

require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-root-import`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/images/icon.png`,
        name: meta.appName,
        short_name: meta.appName,
        description: meta.description,
        start_url: `/`,
        background_color: `#fff`,
        lang: `en-US`,
        theme_color: `#fff`,
        display: `standalone`,
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: meta.siteUrl,
        sitemap: `${meta.siteUrl}sitemap-index.xml`,
        policy: [
          {
            userAgent: `*`,
            allow: [`/`],
            disallow: [meta.routes.docs.preview, meta.routes.notFound],
          },
        ],
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

if (process.env.GA_ID) {
  config.plugins?.push({
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [process.env.GA_ID],
      head: true,
      anonymize: true,
    },
  });
}

export default config;
