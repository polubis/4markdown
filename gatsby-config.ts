import type { GatsbyConfig } from "gatsby";
import { meta } from "./meta";
import { seoPlugins } from "./seo-plugins";
import { CacheVersion } from "api-4markdown-contracts";
import { SiteMetadata } from "core/models";

require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`,
});

const siteMetadata: SiteMetadata = {
  ...meta,
  buildStamp: new Date().toISOString() as CacheVersion,
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
    ...seoPlugins(),
    `gatsby-plugin-mdx`,
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
