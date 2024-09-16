import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { superstructMindmapSchema } from './superstruct';
import { expect } from '@jest/globals';

const mindmap = generateMindmap(50);

describe(`Superstruct benchmark`, () => {
  it(`checks for 100, 500, 1000 iterations`, () => {
    console.table(
      benchmark({
        key: `100 iterations`,
        values: runProbes({
          func: () => superstructMindmapSchema.is(mindmap),
          iterations: 100,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `500 iterations`,
        values: runProbes({
          func: () => superstructMindmapSchema.is(mindmap),
          iterations: 500,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `1000 iterations`,
        values: runProbes({
          func: () => superstructMindmapSchema.is(mindmap),
          iterations: 1000,
        }),
      }),
    );

    expect(true).toBeTruthy();
  });
});
