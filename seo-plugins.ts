import { meta } from "./meta";

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

const legacyRoutes = {
	documents: {
		preview: `/docs/preview/`,
		browse: `/docs/browse/`,
	},
};

const disallowedPaths = [
	meta.routes.documents.preview,
	meta.routes.notFound,
	meta.routes.creator.preview,
	meta.routes.sandbox,
	meta.routes.mindmaps.preview,
	legacyRoutes.documents.preview,
	legacyRoutes.documents.browse,
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
						disallow: [disallowedPaths],
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
					payload.allSitePage.nodes.filter((page) => {
						// When "true" returned then it adds page to sitemap
						const isDisallowedPath = disallowedPaths.includes(page.path);

						if (isDisallowedPath) {
							return false;
						}

						const isEducationZonePage = page.path.startsWith(
							meta.routes.education.zone,
						);
						const isEducationSubPage =
							isEducationZonePage && page.path !== meta.routes.education.zone;

						if (isEducationSubPage) {
							return false;
						}

						return true;
					}),
				serialize: ({ path: url }: { path: string }): SerializedPage => {
					const lowPrioPaths = [meta.routes.privacyPolicy];
					const mediumPrioPaths = [
						meta.routes.home,
						meta.routes.education.zone,
						meta.routes.education.rank,
						meta.routes.mindmaps.creator,
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
