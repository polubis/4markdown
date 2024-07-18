import { Tuple } from './tuples';

const tuple = Tuple([1, `eda`, { hi: true }], { mutable: false });

// Error 💢. No option to change once defined tuple.
tuple.set(`1`, `now`);

// readonly [1, `sema`, { hi: true }]
const items = tuple.read();

// Error 💢.
items[1] = `dasad`;

// Readonly<{ hi: true }>
const item = tuple.getAt(2);

tuple.map((item) => {
  // The "item" is number | string | { hi: boolean } type of.
});

// Error 💢.
items.pop();
