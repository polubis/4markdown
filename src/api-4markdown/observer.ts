import type {
  API4MarkdownContractKey,
  API4MarkdownResult,
} from 'api-4markdown-contracts';

type Observer = <TKey extends API4MarkdownContractKey>(
  result: API4MarkdownResult<TKey>,
) => void;

const observersMap = new Map<API4MarkdownContractKey, Map<string, Observer>>();

const observe = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  observer: (result: API4MarkdownResult<TKey>) => void,
) => {
  const id = Symbol(`id`).toString();

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
  result: API4MarkdownResult<TKey>,
): void => {
  observersMap.get(key)?.forEach((observer) => {
    observer(result);
  });
};

export { observe, emit };
