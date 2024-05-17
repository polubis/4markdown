type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type { NonNullableProperties };
