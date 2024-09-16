import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { validateSync } from 'class-validator'; // Import validateSync from class-validator
import { plainToInstance } from 'class-transformer'; // Optional: use this to convert plain objects to class instances if needed
import { expect } from '@jest/globals';
import { Mindmap } from './class-validator';

const mindmapData = generateMindmap(50);

// Convert the generated data into an instance of the Mindmap class
const mindmapInstance = plainToInstance(Mindmap, mindmapData);

describe(`class-validator benchmark`, () => {
  it(`checks for 100, 500, 1000 iterations`, () => {
    console.table(
      benchmark({
        key: `100 iterations`,
        values: runProbes({
          func: () => validateSync(mindmapInstance), // Use validateSync for synchronous validation
          iterations: 100,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `500 iterations`,
        values: runProbes({
          func: () => validateSync(mindmapInstance),
          iterations: 500,
        }),
      }),
    );

    console.table(
      benchmark({
        key: `1000 iterations`,
        values: runProbes({
          func: () => validateSync(mindmapInstance),
          iterations: 1000,
        }),
      }),
    );

    expect(true).toBeTruthy();
  });
});
