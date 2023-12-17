type Transaction<
  T extends Record<string | number | symbol, unknown> | undefined = undefined,
> =
  | { is: 'idle' }
  | { is: 'busy' }
  | (T extends undefined ? { is: 'ok' } : { is: 'ok' } & T)
  | { is: 'fail'; error: string };

export type { Transaction };
