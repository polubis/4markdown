import type {
  API4MarkdownCacheSignature,
  API4MarkdownContractKey,
  API4MarkdownDto,
} from 'api-4markdown-contracts';

const hasValidSignature = <TKey extends API4MarkdownContractKey>(
  parsed: unknown,
): parsed is API4MarkdownCacheSignature<TKey> => {
  return (
    parsed !== null &&
    typeof parsed === `object` &&
    typeof (parsed as API4MarkdownCacheSignature<TKey>).__expiry__ === `number`
  );
};

const setCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  dto: API4MarkdownDto<TKey>,
  ttlInMinutes = 60,
): void => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        value: dto,
        __expiry__: new Date().getTime() + ttlInMinutes * 60 * 1000,
      }),
    );
  } catch {}
};

const removeCache = (key: API4MarkdownContractKey): void => {
  localStorage.removeItem(key);
};

const getCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
): API4MarkdownDto<TKey> | null => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;

    if (!hasValidSignature<TKey>(parsed)) {
      removeCache(key);
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
};

export { setCache, getCache, removeCache };
