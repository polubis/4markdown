import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { zodMindmapSchema } from './zod';
import { expect } from '@jest/globals';

const mindmap = generateMindmap(50);

describe(`Zod benchmark`, () => {
  it(`checks for 100, 500, 1000 iterations`, () => {
    console.table(
      benchmark({
        key: `100 iterations`,
        values: runProbes({
          func: () => zodMindmapSchema.safeParse(mindmap),
          iterations: 100,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `500 iterations`,
        values: runProbes({
          func: () => zodMindmapSchema.safeParse(mindmap),
          iterations: 500,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `1000 iterations`,
        values: runProbes({
          func: () => zodMindmapSchema.safeParse(mindmap),
          iterations: 1000,
        }),
      }),
    );

    expect(true).toBeTruthy();
  });
});
