import { benchmark, runProbes } from './benchmark';
import { generateMindmap } from './generate-mindmap';
import { zodMindmapSchema } from './zod';

const mindmap50 = generateMindmap(50);
const mindmap100 = generateMindmap(100);
const mindmap150 = generateMindmap(150);

console.table(
  benchmark({
    key: `Zod50`,
    values: runProbes({
      func: () => zodMindmapSchema.parse(mindmap50),
      iterations: 10,
    }),
  }),
);

console.table(
  benchmark({
    key: `Zod100`,
    values: runProbes({
      func: () => zodMindmapSchema.parse(mindmap100),
      iterations: 10,
    }),
  }),
);
console.table(
  benchmark({
    key: `Zod150`,
    values: runProbes({
      func: () => zodMindmapSchema.parse(mindmap150),
      iterations: 10,
    }),
  }),
);
