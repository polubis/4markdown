interface TupleOptions {
  mutable: boolean;
}

type TupleBase<T extends unknown[]> = {
  getAt<K extends keyof T>(index: K): T[K];
  map<U>(callback: (item: T[number]) => U): U[];
};

type ImmutableTuple<T extends unknown[]> = TupleBase<T> & {
  read(): Readonly<T>;
};

type MutableTuple<T extends unknown[]> = TupleBase<T> & {
  set<K extends keyof T>(index: K, value: T[K]): void;
  read(): T;
};

type Tupleable<
  T extends unknown[],
  O extends TupleOptions,
> = O['mutable'] extends true ? MutableTuple<T> : ImmutableTuple<T>;

const Tuple = <T extends unknown[], O extends TupleOptions>(
  elements: [...T],
  options: O,
): Tupleable<T, O> => {
  if (options.mutable) {
    const mutableTuple: MutableTuple<T> = {
      read() {
        return elements;
      },
      getAt(index) {
        return elements[index];
      },
      map(callback) {
        return elements.map(callback);
      },
      set(index, value) {
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

  const immutableTuple: ImmutableTuple<T> = {
    read() {
      return Object.freeze([...elements]) as Readonly<T>;
    },
    getAt(index) {
      return elements[index];
    },
    map(callback) {
      return elements.map(callback);
    },
  };

  return immutableTuple as Tupleable<T, O>;
};

export { Tuple };
