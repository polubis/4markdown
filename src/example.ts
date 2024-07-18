import { Tuple } from './tuples';

const mutableTuple = Tuple([1, `sema`, { hi: true }], { mutable: true });

mutableTuple.set(`1`, `now`);
