import type {
  API4MarkdownContractKey,
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";

type Result<TKey extends API4MarkdownContractKey> =
  | { is: `fail`; error: unknown }
  | {
      is: `ok`;
      payload: API4MarkdownPayload<TKey>;
      dto: API4MarkdownDto<TKey>;
    };

type Observer = <TKey extends API4MarkdownContractKey>(
  result: Result<TKey>,
) => void;

const observersMap = new Map<API4MarkdownContractKey, Map<symbol, Observer>>();

const observe = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  observer: (result: Result<TKey>) => void,
) => {
  const id = Symbol(`id`);

  const unobserve = (): void => {
    const observers = observersMap.get(key);

    if (observers === undefined || observers.size === 0) {
      observersMap.delete(key);
      return;
    }

    observers.delete(id);
  };

  let observers = observersMap.get(key);

  if (observers === undefined) {
    observers = new Map();
    observersMap.set(key, observers);
  }
  // @TODO[PRIO=4]: [Go back here and improve type defs to make].
  observers.set(id, observer as Observer);

  return unobserve;
};

const emit = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  result: Result<TKey>,
): void => {
  observersMap.get(key)?.forEach((observer) => {
    observer(result);
  });
};

const unobserveAll = (): void => {
  observersMap.clear();
};

export { observe, emit, unobserveAll };
