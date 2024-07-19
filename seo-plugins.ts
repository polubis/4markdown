import { meta } from './meta';

type SerializedPage = {
  url: string;
  changefreq:
    | `always`
    | `hourly`
    | `daily`
    | `weekly`
    | `monthly`
    | `yearly`
    | `never`;
  priority: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
  lastmod: string;
};

type GatsbyPluginSitemapPage = { path: string };

const disallowedPaths = [
  meta.routes.docs.preview,
  meta.routes.notFound,
  meta.legacyRoutes.docs.preview,
];

const seoPlugins = () =>
  [
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: meta.siteUrl,
        sitemap: `${meta.siteUrl}/sitemap-index.xml`,
        policy: [
          {
            userAgent: `*`,
            allow: [`/`],
            disallow: disallowedPaths,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
      {
        allSitePage {
          nodes {
            path
          }
        }
      }
      `,
        resolveSiteUrl: (): string => meta.siteUrl,
        resolvePages: (payload: {
          allSitePage: { nodes: GatsbyPluginSitemapPage[] };
        }): GatsbyPluginSitemapPage[] =>
          payload.allSitePage.nodes.filter(
            (page) => !(disallowedPaths as string[]).includes(page.path),
          ),
        serialize: ({ path: url }: { path: string }): SerializedPage => {
          const lowPrioPaths = [meta.routes.privacyPolicy];
          const mediumPrioPaths = [
            meta.routes.home,
            meta.routes.docs.educationZone,
          ];
          const lastmod = new Date().toISOString();

          if ((lowPrioPaths as string[]).includes(url)) {
            return {
              url,
              lastmod,
              changefreq: `monthly`,
              priority: 0.5,
            };
          }

          if ((mediumPrioPaths as string[]).includes(url)) {
            return {
              url,
              lastmod,
              changefreq: `weekly`,
              priority: 0.8,
            };
          }

          return {
            url,
            lastmod,
            changefreq: `daily`,
            priority: 1.0,
          };
        },
      },
    },
  ] as const;

export { seoPlugins };
