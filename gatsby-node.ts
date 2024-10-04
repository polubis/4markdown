import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type GatsbyNode } from 'gatsby';
import path from 'path';
import { meta } from './meta';
import { type HomeViewModel } from 'models/view-models';
import {
  type API4MarkdownDto,
  type PermanentDocumentDto,
} from 'api-4markdown-contracts';
import { createInitialCode } from './create-initial-code';
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

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const app = initializeApp(config);
  const functions = getFunctions(app);

  // @TODO: Find a way to call it statically from library.
  const { data: documents } = await httpsCallable<
    unknown,
    PermanentDocumentDto[]
  >(functions, `getPermanentDocuments`)();

  actions.createPage<HomeViewModel>({
    path: meta.routes.home,
    component: path.resolve(`./src/dynamic-pages/home.page.tsx`),
    context: {
      initialCode: createInitialCode(),
    },
  });

  documents.forEach((doc) => {
    actions.createPage({
      path: doc.path,
      component: path.resolve(`./src/dynamic-pages/document.page.tsx`),
      context: {
        doc,
      },
    });
  });

  actions.createPage<API4MarkdownDto<'getEducationDashboard'>>({
    path: meta.routes.docs.educationZone,
    component: path.resolve(`./src/dynamic-pages/education-zone.page.tsx`),
    context: {
      documents: {
        top: [...documents]
          .slice(0, 4)
          .map(({ author, name, id, path, rating, mdate }) => ({
            name,
            id,
            path,
            rating,
            mdate,
            author:
              author?.displayName && author?.bio
                ? {
                    displayName: author.displayName,
                    avatar: author?.avatar ? author.avatar.sm : null,
                  }
                : null,
          })),
        wall: [...documents]
          .slice(0, 20)
          .map(
            ({ author, name, id, path, rating, mdate, description, tags }) => ({
              name,
              id,
              path,
              rating,
              mdate,
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
    },
  });
};
