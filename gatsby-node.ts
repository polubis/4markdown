import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type GatsbyNode } from 'gatsby';
import path from 'path';
import { meta } from './meta';
import {
  type EducationRanPageModel,
  type EducationPageModel,
  type HomePageModel,
} from 'models/page-models';
import {
  type DocumentRatingCategory,
  type PermanentDocumentDto,
} from 'api-4markdown-contracts';
import { writeFileSync } from 'fs';

const config: FirebaseOptions = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
  measurementId: process.env.GATSBY_MEASURMENT_ID,
};

// @TODO[PRIO=4]: [Move it to separate file as the "seo-plugins.ts"].
export const onPostBuild: GatsbyNode['onPostBuild'] = async () => {
  const indexNowKey = process.env.INDEX_NOW_KEY;

  if (!indexNowKey) return;

  const filePath = path.join(__dirname, `public`, `${indexNowKey}.txt`);

  writeFileSync(filePath, indexNowKey);

  console.log(`IndexNow verification file created at: ${filePath}`);
};

const getTopDocuments = (
  documents: PermanentDocumentDto[],
  amount: number,
): PermanentDocumentDto[] => {
  const weights: Record<DocumentRatingCategory, number> = {
    perfect: 5,
    good: 4,
    decent: 3,
    bad: 2,
    ugly: 1,
  };

  const documentWeights = documents.reduce<
    Record<PermanentDocumentDto['id'], number>
  >((acc, document) => {
    acc[document.id] = Object.entries(document.rating).reduce(
      (acc, [category, rate]) =>
        rate * weights[category as DocumentRatingCategory] + acc,
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

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const app = initializeApp(config);
  const functions = getFunctions(app);

  // @TODO[PRIO=1]: [Find a way to call it statically from library].
  const { data: allDocuments } = await httpsCallable<
    unknown,
    PermanentDocumentDto[]
  >(functions, `getPermanentDocuments`)();

  actions.createPage<HomePageModel>({
    path: meta.routes.home,
    component: path.resolve(`./src/dynamic-pages/home.page.tsx`),
    context: {},
  });

  allDocuments.forEach((document) => {
    actions.createPage({
      path: document.path,
      component: path.resolve(`./src/dynamic-pages/document.page.tsx`),
      context: {
        doc: document,
      },
    });
  });

  const documentsPerPage = 20;
  const documentPagesCount = Math.ceil(allDocuments.length / documentsPerPage);
  const paginatedDocuments = Array.from(
    { length: documentPagesCount },
    (_, index) => {
      const page = index + 1;

      return {
        page,
        documents: [...allDocuments].slice(
          index * documentsPerPage,
          page * documentsPerPage,
        ),
      };
    },
  );

  const topDocuments = getTopDocuments(allDocuments, documentsPerPage).map<
    EducationPageModel['documents']['top'][number]
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
          }
        : null,
  }));
  const partialTopDocuments = [...topDocuments].slice(0, 3);

  const topTags = getTopTags(allDocuments, 10);

  topTags.forEach((tag) => {
    actions.createPage<EducationPageModel>({
      path: `${meta.routes.docs.educationZone}${tag}`,
      component: path.resolve(`./src/dynamic-pages/education-zone.page.tsx`),
      context: {
        page: 1,
        pagesCount: 1,
        tag,
        documents: {
          partialTop: partialTopDocuments,
          top: topDocuments,
          wall: allDocuments
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
          ? meta.routes.docs.educationZone
          : `${meta.routes.docs.educationZone}${page}`,
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
                    }
                  : null,
            }),
          ),
        },
        topTags,
      },
    });
  });

  actions.createPage<EducationRanPageModel>({
    path: meta.routes.education.rank,
    component: path.resolve(`./src/dynamic-pages/education-rank.page.tsx`),
    context: {
      topDocuments: getTopDocuments(allDocuments, documentsPerPage).map(
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
                }
              : null,
        }),
      ),
      topTags,
    },
  });
};
