import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type GatsbyNode } from 'gatsby';
import path from 'path';
import { meta } from './meta';
import {
  type HomeViewModel,
  type EducationZoneViewModel,
} from 'models/view-models';
import { type PermanentDocumentDto } from 'api-4markdown-contracts';
import { createInitialCode } from './create-initial-code';
import { writeFileSync, writeFile } from 'fs';
import { generateMindmap } from './src/store/mindmap-creator/schemas/generate-mindmap';
import { yupMindmapSchema } from './src/store/mindmap-creator/schemas/yup';
import Benchmark from 'benchmark';
import { zodMindmapSchema } from './src/store/mindmap-creator/schemas/zod';
import { joiMindmapSchema } from './src/store/mindmap-creator/schemas/joi';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Mindmap } from './src/store/mindmap-creator/schemas/class-validator';
import { superstructMindmapSchema } from './src/store/mindmap-creator/schemas/superstruct';

const config: FirebaseOptions = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
  measurementId: process.env.GATSBY_MEASURMENT_ID,
};

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

  const mindmap = generateMindmap(200);
  let report = ``;

  const suite = new Benchmark.Suite();

  suite
    .add(`Yup`, function () {
      yupMindmapSchema.isValidSync(mindmap, { abortEarly: false });
    })
    .add(`Zod`, function () {
      zodMindmapSchema.safeParse(mindmap);
    })
    .add(`Joi`, function () {
      joiMindmapSchema.validate(mindmap, { abortEarly: false });
    })
    .add(`Class-Validator`, function () {
      validateSync(plainToInstance(Mindmap, mindmap));
    })
    .add(`Superstruct`, function () {
      superstructMindmapSchema.validate(mindmap);
    })
    .on(`cycle`, function (event) {
      const result = String(event.target);
      console.log(result);
      report += result + `\n`; // Append the result to the report string
    })
    .on(`complete`, function () {
      const fastest = suite.filter(`fastest`).map(`name`);
      console.log(`Fastest is ` + fastest);
      report += `Fastest is ` + fastest + `\n`;

      // Save the report to a file
      writeFile(`benchmark-report.txt`, report, (err) => {
        if (err) throw err;
        console.log(`Benchmark report saved!`);
      });
    })
    .run({ async: true });

  // @TODO: Find a way to call it statically from library.
  const { data: docs } = await httpsCallable<unknown, PermanentDocumentDto[]>(
    functions,
    `getPermanentDocuments`,
  )();

  actions.createPage<HomeViewModel>({
    path: meta.routes.home,
    component: path.resolve(`./src/dynamic-pages/home.page.tsx`),
    context: {
      initialCode: createInitialCode(),
    },
  });

  docs.forEach((doc) => {
    actions.createPage({
      path: doc.path,
      component: path.resolve(`./src/dynamic-pages/document.page.tsx`),
      context: {
        doc,
      },
    });
  });

  actions.createPage<EducationZoneViewModel>({
    path: meta.routes.docs.educationZone,
    component: path.resolve(`./src/dynamic-pages/education-zone.page.tsx`),
    context: {
      docs: docs.map<EducationZoneViewModel['docs'][number]>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ code, visibility, author, ...doc }) => ({
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
