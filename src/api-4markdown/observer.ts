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

  observers.set(id, observer as Observer);

  return unobserve;
};

export { observe };
