import { Tuple } from './tuples';

const tuple = Tuple([1, `eda`, { hi: true }], { mutable: true });

tuple.set(`1`, `now`);

// [1, `sema`, { hi: true }]
const items = tuple.read();

// Possible 💚.
items[1] = `eda2`;

// { hi: true }
const item = tuple.getAt(2);
