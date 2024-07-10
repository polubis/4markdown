import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type GatsbyNode } from 'gatsby';
import { GetPermanentDocsDto, PermamentSlimDoc } from 'models/doc';
import path from 'path';
import { DocsBrowsePageContext } from 'models/pages-contexts';
import { meta } from './meta';

const config: FirebaseOptions = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
  measurementId: process.env.GATSBY_MEASURMENT_ID,
};

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const app = initializeApp(config);
  const functions = getFunctions(app);

  const { data: docs } = await httpsCallable<unknown, GetPermanentDocsDto>(
    functions,
    `getPermanentDocs`,
  )();

  docs.forEach((doc) => {
    actions.createPage({
      path: doc.path,
      component: path.resolve(`./src/dynamic-pages/document.page.tsx`),
      context: {
        doc,
      },
    });
  });

  actions.createPage<DocsBrowsePageContext>({
    path: meta.routes.docs.browse,
    component: path.resolve(`./src/dynamic-pages/docs-browse.page.tsx`),
    context: {
      docs: docs.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ code, visibility, author, ...doc }): PermamentSlimDoc => ({
          ...doc,
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
  });
};
