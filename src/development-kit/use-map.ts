import React from 'react';

type IterableEntries<TKey, TValue> =
  | Iterable<readonly [TKey, TValue]>
  | null
  | undefined;

const useMap = <TKey, TValue>(
  initializer?:
    | IterableEntries<TKey, TValue>
    | (() => IterableEntries<TKey, TValue>),
) => {
  const [map, setMap] = React.useState(
    () =>
      new Map(typeof initializer === `function` ? initializer() : initializer),
  );

  const set = React.useCallback((key: TKey, value: TValue): void => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const remove = React.useCallback((key: TKey): void => {
    setMap((prevMap) => {
      if (!prevMap.has(key)) return prevMap;
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = React.useCallback((): void => {
    setMap(() => new Map());
  }, []);

  const get = React.useCallback(
    (key: TKey): TValue | undefined => {
      return map.get(key);
    },
    [map],
  );

  const has = React.useCallback(
    (key: TKey): boolean => {
      return map.has(key);
    },
    [map],
  );

  const entries = React.useCallback((): IterableIterator<[TKey, TValue]> => {
    return map.entries();
  }, [map]);

  const keys = React.useCallback((): IterableIterator<TKey> => {
    return map.keys();
  }, [map]);

  const values = React.useCallback((): IterableIterator<TValue> => {
    return map.values();
  }, [map]);

  return {
    set,
    remove,
    clear,
    get,
    has,
    entries,
    keys,
    values,
  };
};

export { useMap };

// // Usage Example with Initial Entries

// const { set, remove, clear, get, has, entries, keys, values } = useMap<
//   string,
//   number
// >([
//   [`key1`, 10],
//   [`key2`, 20],
//   [`key3`, 30],
// ]);

// console.log([...entries()]); // [['key1', 10], ['key2', 20], ['key3', 30]]
// console.log([...keys()]); // ['key1', 'key2', 'key3']
// console.log([...values()]); // [10, 20, 30]

// set(`key4`, 40); // Adds 'key4' => 40
// remove(`key2`); // Removes 'key2'
// clear(); // Clears the map

// console.log(get(`key1`)); // 10 - Retrieves the value for 'key1'
// console.log(has(`key3`)); // true - Checks if 'key3' exists
// set(`key5`, 50); // Adds 'key5' => 50
// console.log([...entries()]); // [['key1', 10], ['key3', 30], ['key4', 40], ['key5', 50]]
// remove(`key4`); // Removes 'key4'
// console.log([...entries()]); // [['key1', 10], ['key3', 30], ['key5', 50]]
