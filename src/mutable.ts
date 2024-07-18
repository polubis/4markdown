import { Tuple } from './tuples';

const tuple = Tuple([1, `eda`, { hi: true }], { mutable: true });

// Possible to set item but via specific method.
tuple.set(`1`, `now`);

// [1, `sema`, { hi: true }]
const items = tuple.read();

// Error 💢.
items[1] = `eda2`;

// { hi: true }
const item = tuple.getAt(2);

tuple.map((item) => {
  // The "item" is number | string | { hi: boolean } type of.
});

// Error 💢.
items.pop();
