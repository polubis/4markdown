import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { type GatsbyNode } from "gatsby";
import path from "path";
import { meta } from "./meta";
import type {
  EducationRankPageModel,
  EducationPageModel,
  HomePageModel,
  MindmapPageModel,
} from "models/page-models";
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  RatingCategory,
  PermanentDocumentDto,
} from "api-4markdown-contracts";
import { readFileSync, writeFileSync } from "fs";
import { createPathForMindmap } from "./src/core/create-path-for-mindmap";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const createSearchDataFile = (documents: PermanentDocumentDto[]): void => {
  if (documents.length === 0) return;

  const searchData = documents.map((doc) => ({
    title: doc.name,
    description: doc.description,
    url: doc.path,
  }));

  const filePath = path.join(__dirname, `public`, `search-data.json`);

  writeFileSync(filePath, JSON.stringify(searchData, null, 2));
};

const createAhrefsAutoIndexFile = (): void => {
  const indexNowKey = process.env.INDEX_NOW_KEY;

  if (!indexNowKey) return;

  const filePath = path.join(__dirname, `public`, `${indexNowKey}.txt`);

  writeFileSync(filePath, indexNowKey);

  console.log(`IndexNow verification file created at: ${filePath}`);
};

const createBenchmarkFile = (): void => {
  const limits = {
    chunk: 540,
    unit: `kB`,
  };

  const webpackStats: {
    namedChunkGroups: Record<string, { assets: { size: number }[] }>;
  } = JSON.parse(
    readFileSync(path.join(__dirname, `public`, `webpack.stats.json`), `utf8`),
  );

  const benchmark: {
    chunks: Record<
      string,
      {
        sizes: number[];
        totalSize: number;
        sizesAsString: string;
      }
    >;
    totalSize: number;
    failedChunkGroups: string[];
    limits: typeof limits;
  } = {
    chunks: {},
    totalSize: 0,
    failedChunkGroups: [],
    limits,
  };

  const twoDecimal = (value: number) => Number.parseFloat(value.toFixed(2));

  Object.entries(webpackStats.namedChunkGroups).forEach(
    ([chunkKey, chunkValue]) => {
      const sizes = chunkValue.assets.map(({ size }) =>
        twoDecimal(size / 1024),
      );

      benchmark.chunks[chunkKey] = {
        sizes,
        sizesAsString: sizes.join(`|`),
        totalSize: twoDecimal(
          sizes.reduce((sum, assetSize) => assetSize + sum, 0),
        ),
      };
    },
  );

  benchmark.totalSize = twoDecimal(
    Object.values(benchmark.chunks)
      .flatMap(({ totalSize }) => totalSize)
      .reduce((sum, size) => sum + size, 0),
  );
  benchmark.failedChunkGroups = Object.entries(benchmark.chunks).reduce<
    string[]
  >((acc, [key, { sizes }]) => {
    const toBigSizes = sizes.filter((size) => size > limits.chunk);

    toBigSizes.length > 0 && acc.push(key);

    return acc;
  }, []);

  writeFileSync(
    path.join(__dirname, `public`, `benchmark.json`),
    JSON.stringify(benchmark),
  );

  console.log(`Build benchmark file created`);
};

export const onPostBuild: GatsbyNode["onPostBuild"] = () => {
  createAhrefsAutoIndexFile();
  createBenchmarkFile();
};

const getTopDocuments = (
  documents: PermanentDocumentDto[],
  amount: number,
): PermanentDocumentDto[] => {
  const weights: Record<RatingCategory, number> = {
    perfect: 5,
    good: 4,
    decent: 3,
    bad: 2,
    ugly: 1,
  };

  const documentWeights = documents.reduce<
    Record<PermanentDocumentDto["id"], number>
  >((acc, document) => {
    acc[document.id] = Object.entries(document.rating).reduce(
      (acc, [category, rate]) =>
        rate * weights[category as RatingCategory] + acc,
      0,
    );

    return acc;
  }, {});

  return [...documents]
    .sort((prev, curr) => documentWeights[curr.id] - documentWeights[prev.id])
    .slice(0, amount);
};

const getTopTags = (
  documents: PermanentDocumentDto[],
  amount: number,
): string[] => {
  const countedTags = documents.reduce<Record<string, number>>(
    (acc, document) => {
      document.tags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });

      return acc;
    },
    {},
  );

  return Object.entries(countedTags)
    .sort(([, prev], [, curr]) => curr - prev)
    .slice(0, amount)
    .map(([tag]) => tag);
};

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  stage,
  actions,
}) => {
  const debugJs = process.env.DEBUG_JS === `true`;

  if (!debugJs) return;
  if (stage !== `build-javascript`) return;

  actions.setWebpackConfig({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: `server`,
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
    ],
  });
};

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const app = initializeApp({
    apiKey: process.env.GATSBY_API_KEY,
    authDomain: process.env.GATSBY_AUTH_DOMAIN,
    projectId: process.env.GATSBY_PROJECT_ID,
    storageBucket: process.env.GATSBY_STORAGE_BUCKET,
    messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
    appId: process.env.GATSBY_APP_ID,
    measurementId: process.env.GATSBY_MEASURMENT_ID,
  });

  const functions = getFunctions(app);

  // @TODO[PRIO=1]: [Find a way to call it statically from library].
  const [{ data: allDocuments }, { data: allMindmaps }] = await Promise.all([
    httpsCallable<
      API4MarkdownPayload<`getPermanentDocuments`>,
      API4MarkdownDto<`getPermanentDocuments`>
    >(functions, `getPermanentDocuments`)(),
    httpsCallable<
      API4MarkdownPayload<`getPermanentMindmaps`>,
      API4MarkdownDto<`getPermanentMindmaps`>
    >(
      functions,
      `getPermanentMindmaps`,
    )({ limit: 100 }),
  ]);

  const trustedDocuments = allDocuments.filter(
    ({ isAuthorTrusted }) => isAuthorTrusted,
  );

  createSearchDataFile(trustedDocuments);

  actions.createPage<HomePageModel>({
    path: meta.routes.home,
    component: path.resolve(`./src/dynamic-pages/home.page.tsx`),
    context: {},
  });

  trustedDocuments.forEach((document) => {
    actions.createPage({
      path: document.path,
      component: path.resolve(`./src/dynamic-pages/document.page.tsx`),
      context: {
        doc: document,
      },
    });
  });

  const trustedMindmaps = allMindmaps.filter(
    ({ isAuthorTrusted }) => isAuthorTrusted,
  );

  trustedMindmaps.forEach((mindmap) => {
    const mindmapPath = createPathForMindmap(mindmap.id, mindmap.path);

    actions.createPage<MindmapPageModel>({
      path: mindmapPath,
      component: path.resolve(`./src/dynamic-pages/mindmap.page.tsx`),
      context: {
        mindmap,
        mindmapPath,
      },
    });
  });

  const documentsPerPage = 20;
  const documentPagesCount = Math.ceil(
    trustedDocuments.length / documentsPerPage,
  );
  const paginatedDocuments = Array.from(
    { length: documentPagesCount },
    (_, index) => {
      const page = index + 1;

      return {
        page,
        documents: [...trustedDocuments].slice(
          index * documentsPerPage,
          page * documentsPerPage,
        ),
      };
    },
  );

  const topDocuments = getTopDocuments(trustedDocuments, documentsPerPage).map<
    EducationPageModel["documents"]["top"][number]
  >(({ author, name, id, path, rating, cdate }) => ({
    name,
    id,
    path,
    rating,
    cdate,
    author:
      author?.displayName && author?.bio
        ? {
            displayName: author.displayName,
            avatar: author?.avatar ? author.avatar.sm : null,
            id: author.id,
          }
        : null,
  }));
  const partialTopDocuments = [...topDocuments].slice(0, 3);

  const topTags = getTopTags(trustedDocuments, 10);

  topTags.forEach((tag) => {
    actions.createPage<EducationPageModel>({
      path: `${meta.routes.education.zone}${tag}`,
      component: path.resolve(`./src/dynamic-pages/education-zone.page.tsx`),
      context: {
        page: 1,
        pagesCount: 1,
        tag,
        documents: {
          partialTop: partialTopDocuments,
          top: topDocuments,
          wall: trustedDocuments
            .filter((document) => document.tags.includes(tag))
            .map(
              ({
                author,
                name,
                id,
                path,
                rating,
                cdate,
                description,
                tags,
              }) => ({
                name,
                id,
                path,
                rating,
                cdate,
                description,
                tags,
                author:
                  author?.displayName && author?.bio
                    ? {
                        displayName: author.displayName,
                        avatar: author?.avatar ? author.avatar.sm : null,
                        id: author.id,
                      }
                    : null,
              }),
            ),
        },
        topTags,
      },
    });
  });

  paginatedDocuments.forEach(({ documents, page }) => {
    actions.createPage<EducationPageModel>({
      path:
        page === 1
          ? meta.routes.education.zone
          : `${meta.routes.education.zone}${page}`,
      component: path.resolve(`./src/dynamic-pages/education-zone.page.tsx`),
      context: {
        page,
        pagesCount: documentPagesCount,
        documents: {
          partialTop: partialTopDocuments,
          top: topDocuments,
          wall: documents.map(
            ({ author, name, id, path, rating, cdate, description, tags }) => ({
              name,
              id,
              path,
              rating,
              cdate,
              description,
              tags,
              author:
                author?.displayName && author?.bio
                  ? {
                      displayName: author.displayName,
                      avatar: author?.avatar ? author.avatar.sm : null,
                      id: author.id,
                    }
                  : null,
            }),
          ),
        },
        topTags,
      },
    });
  });

  actions.createPage<EducationRankPageModel>({
    path: meta.routes.education.rank,
    component: path.resolve(`./src/dynamic-pages/education-rank.page.tsx`),
    context: {
      topDocuments: getTopDocuments(trustedDocuments, documentsPerPage).map(
        ({ author, name, id, path, rating, cdate, description, tags }) => ({
          name,
          id,
          path,
          rating,
          cdate,
          description,
          tags,
          author:
            author?.displayName && author?.bio
              ? {
                  displayName: author.displayName,
                  avatar: author?.avatar ? author.avatar.sm : null,
                  id: author.id,
                }
              : null,
        }),
      ),
      topTags,
    },
  });
};
