import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { expect } from '@jest/globals';
import { Mindmap } from './class-validator';

const mindmapData = generateMindmap(50);

describe(`Class-Validator benchmark`, () => {
  it(`checks for 100, 500, 1000 iterations`, () => {
    console.table(
      benchmark({
        key: `100 iterations`,
        values: runProbes({
          func: () => validateSync(plainToInstance(Mindmap, mindmapData)),
          iterations: 100,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `500 iterations`,
        values: runProbes({
          func: () => validateSync(plainToInstance(Mindmap, mindmapData)),
          iterations: 500,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `1000 iterations`,
        values: runProbes({
          func: () => validateSync(plainToInstance(Mindmap, mindmapData)),
          iterations: 1000,
        }),
      }),
    );

    expect(true).toBeTruthy();
  });
});
