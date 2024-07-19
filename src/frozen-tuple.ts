const isObject = (
  obj: unknown,
): obj is Record<string | number | symbol, unknown> => {
  return typeof obj === `object` && obj !== null;
};

const deepFreeze = <T>(maybeObject: T): T => {
  if (!isObject(maybeObject)) return maybeObject;

  const propNames: string[] = Object.getOwnPropertyNames(maybeObject);

  for (const name of propNames) {
    const value = maybeObject[name];

    isObject(value) && deepFreeze(value);
  }

  return Object.freeze(maybeObject);
};

const FrozenTuple = <T extends unknown[]>(items: [...T]): Readonly<[...T]> => {
  return Object.freeze(items.map(deepFreeze)) as Readonly<[...T]>;
};

const tuple = FrozenTuple([1, { flag: true }, []]);

let f = tuple[0];
let s = tuple[1];
let t = tuple[2];

f = `1`; // 💢 Blocked at compile/runtime.
s = []; // 💢 Blocked at compile/runtime.
t = {}; // 💢 Blocked at compile/runtime.
