import type {
  API4MarkdownCacheSignature,
  API4MarkdownContractKey,
  API4MarkdownDto,
} from "api-4markdown-contracts";
import { getCacheVersion } from "./use-api";

const hasValidSignature = <TKey extends API4MarkdownContractKey>(
  parsed: unknown,
): parsed is API4MarkdownCacheSignature<TKey> => {
  return (
    parsed !== null &&
    typeof parsed === `object` &&
    typeof (parsed as API4MarkdownCacheSignature<TKey>).__expiry__ ===
      `number` &&
    typeof (parsed as API4MarkdownCacheSignature<TKey>).__version__ === `string`
  );
};

const setCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  dto: API4MarkdownDto<TKey>,
  ttlInMinutes = 960,
): void => {
  try {
    const version = getCacheVersion();
    localStorage.setItem(
      key,
      JSON.stringify({
        value: dto,
        __expiry__: new Date().getTime() + ttlInMinutes * 60 * 1000,
        __version__: version,
      }),
    );
  } catch {}
};

const removeCache = (...keys: API4MarkdownContractKey[]): void => {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

const getCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
): API4MarkdownDto<TKey> | null => {
  try {
    const version = getCacheVersion();
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;

    if (!hasValidSignature<TKey>(parsed)) {
      removeCache(key);
      return null;
    }

    if (
      parsed.__expiry__ < new Date().getTime() ||
      parsed.__version__ !== version
    ) {
      removeCache(key);
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
};

export { setCache, getCache, removeCache };
