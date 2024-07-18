import { Tuple } from './tuples';

const tuple = Tuple([1, `eda`, { hi: true }], { mutable: false });

// Error 💢.
tuple.set(`1`, `now`);

// readonly [1, `sema`, { hi: true }]
const items = tuple.read();

// Error 💢.
items[1] = `dasad`;
