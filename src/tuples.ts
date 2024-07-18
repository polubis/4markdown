interface TupleOptions {
  mutable: boolean;
}

type ImmutableTuple<T extends unknown[]> = {
  read(): T;
  getAt<K extends keyof T>(index: K): T[K];
  map<U>(callback: (item: T[number]) => U): U[];
};

type MutableTuple<T extends unknown[]> = ImmutableTuple<T> & {
  set<K extends keyof T>(index: K, value: T[K]): void;
};

type Tupleable<
  T extends unknown[],
  O extends TupleOptions,
> = O['mutable'] extends true ? MutableTuple<T> : ImmutableTuple<T>;

const Tuple = <T extends unknown[], O extends TupleOptions>(
  elements: [...T],
  options: O,
): Tupleable<T, O> => {
  const immutableTuple: ImmutableTuple<T> = {
    read() {
      return Object.freeze([...elements]) as Readonly<T>;
    },
    getAt<K extends keyof T>(index: K) {
      return elements[index];
    },
    map<U>(callback: (item: T[number]) => U) {
      return elements.map(callback);
    },
  };

  if (options.mutable) {
    const mutableTuple: MutableTuple<T> = {
      ...immutableTuple,
      set<K extends keyof T>(index: K, value: T[K]) {
        if (typeof value !== typeof elements[index]) {
          throw new Error(
            `New value must be of the same type as the existing value`,
          );
        }
        elements[index] = value;
      },
    };

    return mutableTuple;
  }

  return immutableTuple as Tupleable<T, O>;
};

export { Tuple };
