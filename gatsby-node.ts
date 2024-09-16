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

  const mindmap = generateMindmap(100);
  let report = ``;

  const suite = new Benchmark.Suite();
  const minSamples = 50;

  suite
    .add(
      `Yup`,
      function () {
        yupMindmapSchema.isValidSync(mindmap, { abortEarly: false });
      },
      { minSamples },
    )
    .add(
      `Zod`,
      function () {
        zodMindmapSchema.safeParse(mindmap);
      },
      { minSamples },
    )
    .add(
      `Joi`,
      function () {
        joiMindmapSchema.validate(mindmap, { abortEarly: false });
      },
      { minSamples },
    )
    .add(
      `Class-Validator`,
      function () {
        validateSync(plainToInstance(Mindmap, mindmap));
      },
      { minSamples },
    )
    .add(
      `Superstruct`,
      function () {
        superstructMindmapSchema.validate(mindmap);
      },
      { minSamples },
    )
    .on(`cycle`, function (event) {
      const opsPerSec = event.target.hz; // Get ops/sec
      const totalSamples = event.target.stats.sample.length; // Get the number of samples
      const totalTimeInSeconds = totalSamples / opsPerSec; // Calculate total time in seconds

      const result = `${String(event.target)} - Total Time: ${totalTimeInSeconds.toFixed(3)} seconds`;
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
