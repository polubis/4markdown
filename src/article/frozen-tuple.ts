// Type-safe check to determine if the value is a non-nullable object.
const isObject = (
  obj: unknown,
): obj is Record<string | number | symbol, unknown> => {
  return typeof obj === `object` && obj !== null;
};

// If the value is a non-nullable object, it freezes the object and all
// nested properties recursively.
const deepFreeze = <T>(maybeObject: T): T => {
  if (!isObject(maybeObject)) return maybeObject;

  const propNames = Object.getOwnPropertyNames(maybeObject);

  for (const name of propNames) {
    const value = maybeObject[name];

    if (isObject(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(maybeObject);
};

// Freezing the "wrapping" object, which is an array, and all nested stuff inside.
const FrozenTuple = <T extends unknown[]>(items: [...T]): Readonly<[...T]> => {
  if (!Array.isArray(items)) {
    throw Error(`Passed tuple elements must be an array`);
  }

  return Object.freeze(items.map(deepFreeze)) as Readonly<[...T]>;
};

const tuple = FrozenTuple([1, { flag: true }, []]);

let f = tuple[0];
let s = tuple[1];
let t = tuple[2];

f = `1`; // 💢 Blocked at compile/runtime.
s = []; // 💢 Blocked at compile/runtime.
t = {}; // 💢 Blocked at compile/runtime.

