import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { joiMindmapSchema } from './joi'; // Importing the Joi schema
import { expect } from '@jest/globals';

const mindmap = generateMindmap(50);

describe(`Joi benchmark`, () => {
  it(`checks for 100, 500, 1000 iterations`, () => {
    console.table(
      benchmark({
        key: `100 iterations`,
        values: runProbes({
          func: () => joiMindmapSchema.validate(mindmap, { abortEarly: false }),
          iterations: 100,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `500 iterations`,
        values: runProbes({
          func: () => joiMindmapSchema.validate(mindmap, { abortEarly: false }),
          iterations: 500,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `1000 iterations`,
        values: runProbes({
          func: () => joiMindmapSchema.validate(mindmap, { abortEarly: false }),
          iterations: 1000,
        }),
      }),
    );

    expect(true).toBeTruthy();
  });
});
